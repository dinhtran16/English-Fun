export interface Env {
  ASSETS: Fetcher
  DB: D1Database
  /** "false" turns off new sign-ups (existing accounts keep working). */
  SIGNUP_ENABLED?: string
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
]

let schemaReady = false

/** Creates the tables on first use, so no manual migration is needed. */
export async function ensureSchema(env: Env) {
  if (schemaReady) return
  await env.DB.batch(SCHEMA.map((s) => env.DB.prepare(s)))
  schemaReady = true
}
