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
  reviewCount?: number
  correctCount?: number
  lastReviewedAt?: number
  lastResult?: 'right' | 'wrong'
}

interface Row {
  word: string
  data: string
}

const MAX_WORDS_PER_REQUEST = 500
const MAX_WORDS_PER_USER = 5000

async function userOf(request: Request, env: Env): Promise<string | Response> {
  return (await currentUser(request, env)) ?? json({ error: 'not_signed_in' }, 401)
}

const text = (v: unknown, max: number) => (typeof v === 'string' && v.length <= max ? v : undefined)
const count = (v: unknown) =>
  typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 1e13 ? Math.floor(v) : undefined

/** Keeps only the known fields, with sane types and lengths; returns null for an invalid word. */
function cleanWord(w: unknown): VocabWord | null {
  if (!w || typeof w !== 'object') return null
  const v = w as Record<string, unknown>
  const word = text(v.word, 64)
  const meaning = text(v.meaning, 500)
  const addedAt = count(v.addedAt)
  if (!word || !word.trim() || meaning === undefined || addedAt === undefined) return null
  const out: VocabWord = {
    word,
    meaning,
    phonetic: text(v.phonetic, 100),
    definition: text(v.definition, 1000),
    example: text(v.example, 1000),
    topicId: text(v.topicId, 40),
    addedAt,
    updatedAt: count(v.updatedAt),
    practiceCount: count(v.practiceCount) ?? 0,
    lastPracticedAt: count(v.lastPracticedAt),
    reviewCount: count(v.reviewCount),
    correctCount: count(v.correctCount),
    lastReviewedAt: count(v.lastReviewedAt),
    lastResult: v.lastResult === 'right' || v.lastResult === 'wrong' ? v.lastResult : undefined,
  }
  return out
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
  let words = body.words.map(cleanWord).filter((w): w is VocabWord => w !== null)

  await ensureSchema(env)
  // Cap the bank size: once full, only words already in it can be updated.
  const total = await env.DB.prepare('SELECT COUNT(*) AS n FROM vocab_words WHERE username = ?')
    .bind(user)
    .first<{ n: number }>()
  if ((total?.n ?? 0) + words.length > MAX_WORDS_PER_USER) {
    const { results } = await env.DB.prepare('SELECT word FROM vocab_words WHERE username = ?')
      .bind(user)
      .all<{ word: string }>()
    const existing = new Set(results.map((r) => r.word))
    let room = MAX_WORDS_PER_USER - existing.size
    words = words.filter((w) => existing.has(w.word) || room-- > 0)
  }
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
  if (!word || word.length > 64) return json({ error: 'missing_word' }, 400)
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
