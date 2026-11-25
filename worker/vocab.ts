/**
 * Vocabulary bank API, served by the Cloudflare Worker and stored in D1.
 * Every request needs a signed-in user (see auth.ts).
 *
 *   GET    /api/vocab              -> { user, words: VocabWord[] }
 *   POST   /api/vocab              body { words: VocabWord[] } -> upserts each word (newest updatedAt wins)
 *   DELETE /api/vocab?word=<word>  -> removes one word
 */
import { currentUser } from './auth'
import { ensureSchema, json, type Env } from './http'

interface VocabWord {
  word: string
  meaning: string
  phonetic?: string
  definition?: string
  example?: string
  topicId?: string
  addedAt: number
  updatedAt?: number
  practiceCount: number
  lastPracticedAt?: number
}

interface Row {
  word: string
  data: string
}

const MAX_WORDS_PER_REQUEST = 500

async function userOf(request: Request, env: Env): Promise<string | Response> {
  return (await currentUser(request, env)) ?? json({ error: 'not_signed_in' }, 401)
}

function isValidWord(w: unknown): w is VocabWord {
  if (!w || typeof w !== 'object') return false
  const v = w as Record<string, unknown>
  return (
    typeof v.word === 'string' &&
    v.word.length > 0 &&
    v.word.length <= 64 &&
    typeof v.meaning === 'string' &&
    v.meaning.length <= 500 &&
    typeof v.addedAt === 'number' &&
    typeof v.practiceCount === 'number'
  )
}

function guard(env: Env): Response | null {
  if (!env.DB) return json({ error: 'db_not_bound' }, 503)
  return null
}

async function handleGet(request: Request, env: Env): Promise<Response> {
  const bad = guard(env)
  if (bad) return bad
  const user = await userOf(request, env)
  if (user instanceof Response) return user
  await ensureSchema(env)
  const { results } = await env.DB.prepare(
    'SELECT word, data FROM vocab_words WHERE username = ? ORDER BY updated_at DESC',
  )
    .bind(user)
    .all<Row>()
  const words = results.map((r) => JSON.parse(r.data) as VocabWord)
  return json({ user, words })
}

async function handlePost(request: Request, env: Env): Promise<Response> {
  const bad = guard(env)
  if (bad) return bad
  const user = await userOf(request, env)
  if (user instanceof Response) return user

  let body: { words?: unknown }
  try {
    body = await request.json()
  } catch {
    return json({ error: 'invalid_json' }, 400)
  }
  if (!Array.isArray(body.words)) return json({ error: 'words_must_be_array' }, 400)
  if (body.words.length > MAX_WORDS_PER_REQUEST) return json({ error: 'too_many_words' }, 413)
  const words = body.words.filter(isValidWord)

  await ensureSchema(env)
  // Upsert; keep whichever copy was edited most recently.
  const stmt = env.DB.prepare(
    `INSERT INTO vocab_words (username, word, data, updated_at) VALUES (?, ?, ?, ?)
     ON CONFLICT (username, word) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at
     WHERE excluded.updated_at >= vocab_words.updated_at`,
  )
  if (words.length) {
    await env.DB.batch(
      words.map((w) => {
        const updatedAt = w.updatedAt ?? w.addedAt
        return stmt.bind(user, w.word, JSON.stringify({ ...w, updatedAt }), updatedAt)
      }),
    )
  }
  return json({ saved: words.length, skipped: body.words.length - words.length })
}

async function handleDelete(request: Request, env: Env): Promise<Response> {
  const bad = guard(env)
  if (bad) return bad
  const user = await userOf(request, env)
  if (user instanceof Response) return user
  const word = new URL(request.url).searchParams.get('word')
  if (!word) return json({ error: 'missing_word' }, 400)
  await ensureSchema(env)
  await env.DB.prepare('DELETE FROM vocab_words WHERE username = ? AND word = ?').bind(user, word).run()
  return json({ deleted: word })
}

export async function handleVocab(request: Request, env: Env): Promise<Response> {
  switch (request.method) {
    case 'GET':
      return handleGet(request, env)
    case 'POST':
      return handlePost(request, env)
    case 'DELETE':
      return handleDelete(request, env)
    default:
      return json({ error: 'method_not_allowed' }, 405)
  }
}
