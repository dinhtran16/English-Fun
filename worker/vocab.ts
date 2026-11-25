/**
 * Vocabulary bank API, served by the Cloudflare Worker and stored in D1.
 *
 *   GET    /api/vocab              -> { user, words: VocabWord[] }
 *   POST   /api/vocab              body { words: VocabWord[] } -> upserts each word (newest updatedAt wins)
 *   DELETE /api/vocab?word=<word>  -> removes one word
 *
 * The user is identified by Cloudflare Access (header Cf-Access-Authenticated-User-Email).
 * Requests without it are refused, unless the ALLOW_ANONYMOUS variable is "true" (local testing).
 * If ALLOWED_EMAILS is set (comma separated), only those emails are accepted.
 */

export interface Env {
  ASSETS: Fetcher
  DB: D1Database
  ALLOWED_EMAILS?: string
  ALLOW_ANONYMOUS?: string
}

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

const SCHEMA = `CREATE TABLE IF NOT EXISTS vocab (
  user_email TEXT NOT NULL,
  word TEXT NOT NULL,
  data TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (user_email, word)
)`

const MAX_WORDS_PER_REQUEST = 500

let schemaReady = false

async function ensureSchema(db: D1Database) {
  if (schemaReady) return
  await db.prepare(SCHEMA).run()
  schemaReady = true
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })
}

function userOf(request: Request, env: Env): string | Response {
  const email = request.headers.get('Cf-Access-Authenticated-User-Email')?.toLowerCase()
  if (!email) {
    if (env.ALLOW_ANONYMOUS === 'true') return 'anonymous'
    return json({ error: 'not_signed_in' }, 401)
  }
  const allowed = env.ALLOWED_EMAILS?.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
  if (allowed?.length && !allowed.includes(email)) return json({ error: 'forbidden' }, 403)
  return email
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
  if (!env.DB) return json({ error: 'db_not_bound', hint: 'Bind a D1 database as DB in Pages settings' }, 503)
  return null
}

async function handleGet(request: Request, env: Env): Promise<Response> {
  const bad = guard(env)
  if (bad) return bad
  const user = userOf(request, env)
  if (user instanceof Response) return user
  await ensureSchema(env.DB)
  const { results } = await env.DB.prepare(
    'SELECT word, data FROM vocab WHERE user_email = ? ORDER BY updated_at DESC',
  )
    .bind(user)
    .all<Row>()
  const words = results.map((r) => JSON.parse(r.data) as VocabWord)
  return json({ user, words })
}

async function handlePost(request: Request, env: Env): Promise<Response> {
  const bad = guard(env)
  if (bad) return bad
  const user = userOf(request, env)
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

  await ensureSchema(env.DB)
  // Upsert; keep whichever copy was edited most recently.
  const stmt = env.DB.prepare(
    `INSERT INTO vocab (user_email, word, data, updated_at) VALUES (?, ?, ?, ?)
     ON CONFLICT (user_email, word) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at
     WHERE excluded.updated_at >= vocab.updated_at`,
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
  const user = userOf(request, env)
  if (user instanceof Response) return user
  const word = new URL(request.url).searchParams.get('word')
  if (!word) return json({ error: 'missing_word' }, 400)
  await ensureSchema(env.DB)
  await env.DB.prepare('DELETE FROM vocab WHERE user_email = ? AND word = ?').bind(user, word).run()
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
