export interface Env {
  ASSETS: Fetcher
  DB: D1Database
  /** "false" turns off new sign-ups (existing accounts keep working). */
  SIGNUP_ENABLED?: string
  /** Secret: DeepSeek API key. Without it the app falls back to built-in passages. */
  DEEPSEEK_API_KEY?: string
  /** Optional overrides (mainly for testing). */
  DEEPSEEK_BASE_URL?: string
  DEEPSEEK_MODEL?: string
  /** Max AI calls per user per day (default 50). */
  AI_DAILY_LIMIT?: string
}

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...headers,
    },
  })
}

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    expires_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS vocab_words (
    username TEXT NOT NULL,
    word TEXT NOT NULL,
    data TEXT NOT NULL,
    updated_at INTEGER NOT NULL,
    PRIMARY KEY (username, word)
  )`,
  `CREATE TABLE IF NOT EXISTS passages (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    topic_id TEXT NOT NULL,
    mode TEXT NOT NULL,
    data TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS passages_by_user ON passages (username, topic_id, created_at)`,
  `CREATE TABLE IF NOT EXISTS ai_usage (
    username TEXT NOT NULL,
    day TEXT NOT NULL,
    count INTEGER NOT NULL,
    PRIMARY KEY (username, day)
  )`,
]

let schemaReady = false

/** Creates the tables on first use, so no manual migration is needed. */
export async function ensureSchema(env: Env) {
  if (schemaReady) return
  await env.DB.batch(SCHEMA.map((s) => env.DB.prepare(s)))
  schemaReady = true
}
