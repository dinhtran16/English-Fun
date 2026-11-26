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
  /** Max AI calls per user during their first 24 hours (default 10). */
  AI_NEW_USER_LIMIT?: string
  /** Max AI calls for the whole app per day (default 1000), so a runaway bill is impossible. */
  AI_GLOBAL_DAILY_LIMIT?: string
  /** Cloudflare Turnstile. Without the secret, sign-up works without a captcha. */
  TURNSTILE_SITE_KEY?: string
  TURNSTILE_SECRET_KEY?: string
  TURNSTILE_VERIFY_URL?: string
}

/** Sent with every API response. Static files get the same set from public/_headers. */
export const SECURITY_HEADERS: Record<string, string> = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-frame-options': 'DENY',
  'content-security-policy': "default-src 'none'; frame-ancestors 'none'",
}

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...SECURITY_HEADERS,
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
  `CREATE TABLE IF NOT EXISTS rate_limits (
    key TEXT PRIMARY KEY,
    window_start INTEGER NOT NULL,
    count INTEGER NOT NULL
  )`,
]

let schemaReady = false

/** Creates the tables on first use, so no manual migration is needed. */
export async function ensureSchema(env: Env) {
  if (schemaReady) return
  await env.DB.batch(SCHEMA.map((s) => env.DB.prepare(s)))
  schemaReady = true
}

/** The visitor's IP as seen by Cloudflare. */
export const clientIp = (request: Request) => request.headers.get('cf-connecting-ip') ?? 'local'

const windowStart = (windowSec: number) => Math.floor(Date.now() / 1000 / windowSec) * windowSec

/**
 * Counts one hit for `key` in a fixed time window and returns true while the count is
 * within `limit`. Stored in D1 so the limit holds across all Worker instances.
 */
export async function hit(env: Env, key: string, limit: number, windowSec: number): Promise<boolean> {
  await ensureSchema(env)
  const start = windowStart(windowSec)
  const row = await env.DB.prepare(
    `INSERT INTO rate_limits (key, window_start, count) VALUES (?, ?, 1)
     ON CONFLICT (key) DO UPDATE SET
       count = CASE WHEN window_start = excluded.window_start THEN count + 1 ELSE 1 END,
       window_start = excluded.window_start
     RETURNING count`,
  )
    .bind(key, start)
    .first<{ count: number }>()
  if (Math.random() < 0.02) {
    // Occasionally drop counters that are more than a day old.
    await env.DB.prepare('DELETE FROM rate_limits WHERE window_start < ?')
      .bind(Math.floor(Date.now() / 1000) - 86400)
      .run()
  }
  return (row?.count ?? 1) <= limit
}

/** Reads the current count for `key` without adding to it. */
export async function peek(env: Env, key: string, windowSec: number): Promise<number> {
  await ensureSchema(env)
  const row = await env.DB.prepare('SELECT count FROM rate_limits WHERE key = ? AND window_start = ?')
    .bind(key, windowStart(windowSec))
    .first<{ count: number }>()
  return row?.count ?? 0
}

export const tooMany = () => json({ error: 'rate_limited' }, 429, { 'retry-after': '60' })
