/**
 * Username + password accounts.
 *
 *   POST /api/auth/signup   { username, password, lang? } -> { user, lang } and a session cookie
 *   POST /api/auth/signin   { username, password }        -> { user, lang } and a session cookie
 *   POST /api/auth/signout                          -> clears the session
 *   GET  /api/auth/me                               -> { user, lang } or 401
 *   POST /api/auth/settings { lang }                -> saves the learner's language
 *   GET  /api/auth/config                           -> { turnstileSiteKey } for the sign-up form
 *
 * Passwords are hashed with PBKDF2-SHA256 and a per-user salt. Sessions are random
 * tokens kept in an HttpOnly cookie; only their SHA-256 hash is stored in D1.
 *
 * Abuse protection: sign-in and sign-up are rate limited per IP, an account is locked for
 * 15 minutes after 10 wrong passwords, and sign-up asks for a Turnstile check when configured.
 */
import { isLang } from '../src/i18n/languages'
import { clientIp, ensureSchema, hit, json, peek, tooMany, type Env } from './http'

export const COOKIE = 'ef_session'
const SESSION_DAYS = 30
const PBKDF2_ITERATIONS = 100_000 // the maximum Workers allows
const USERNAME_RE = /^[a-z0-9_.-]{3,32}$/
const MIN_PASSWORD = 8
const SIGNIN_PER_IP_PER_MINUTE = 10
const SIGNUP_PER_IP_PER_HOUR = 5
const FAILS_BEFORE_LOCK = 10
const LOCK_SECONDS = 15 * 60
const TURNSTILE_VERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

const enc = new TextEncoder()

function toHex(buf: ArrayBuffer | Uint8Array): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function randomHex(bytes: number): string {
  return toHex(crypto.getRandomValues(new Uint8Array(bytes)))
}

async function sha256(text: string): Promise<string> {
  return toHex(await crypto.subtle.digest('SHA-256', enc.encode(text)))
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(salt), iterations: PBKDF2_ITERATIONS },
    key,
    256,
  )
  return toHex(bits)
}

/** Constant-time comparison of two hex strings. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get('cookie') ?? ''
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k === name) return v.join('=')
  }
  return null
}

function sessionCookie(request: Request, token: string, maxAge: number): string {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : ''
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`
}

/** The learner's language, or null if they never chose one (accounts from before languages existed). */
async function userLang(env: Env, username: string): Promise<string | null> {
  const row = await env.DB.prepare('SELECT lang FROM user_settings WHERE username = ?')
    .bind(username)
    .first<{ lang: string | null }>()
  return row?.lang ?? null
}

async function saveLang(env: Env, username: string, lang: string) {
  await env.DB.prepare(
    'INSERT INTO user_settings (username, lang) VALUES (?, ?) ON CONFLICT (username) DO UPDATE SET lang = excluded.lang',
  )
    .bind(username, lang)
    .run()
}

async function startSession(request: Request, env: Env, username: string): Promise<Response> {
  const token = randomHex(32)
  const maxAge = SESSION_DAYS * 24 * 3600
  await env.DB.prepare('INSERT INTO sessions (token_hash, username, expires_at) VALUES (?, ?, ?)')
    .bind(await sha256(token), username, Date.now() + maxAge * 1000)
    .run()
  // Opportunistic cleanup of expired sessions.
  await env.DB.prepare('DELETE FROM sessions WHERE expires_at < ?').bind(Date.now()).run()
  const lang = await userLang(env, username)
  return json({ user: username, lang }, 200, { 'set-cookie': sessionCookie(request, token, maxAge) })
}

/** Returns the signed-in username, or null. */
export async function currentUser(request: Request, env: Env): Promise<string | null> {
  const token = readCookie(request, COOKIE)
  if (!token || !/^[0-9a-f]{64}$/.test(token)) return null
  await ensureSchema(env)
  const row = await env.DB.prepare('SELECT username, expires_at FROM sessions WHERE token_hash = ?')
    .bind(await sha256(token))
    .first<{ username: string; expires_at: number }>()
  if (!row || row.expires_at < Date.now()) return null
  return row.username
}

interface Credentials {
  username: string
  password: string
  turnstileToken?: string
  lang?: string
}

async function readCredentials(request: Request): Promise<Credentials | Response> {
  let body: { username?: unknown; password?: unknown; turnstileToken?: unknown; lang?: unknown }
  try {
    body = await request.json()
  } catch {
    return json({ error: 'invalid_json' }, 400)
  }
  if (typeof body.username !== 'string' || typeof body.password !== 'string') {
    return json({ error: 'missing_fields' }, 400)
  }
  if (body.username.length > 64 || body.password.length > 200) return json({ error: 'wrong_credentials' }, 400)
  return {
    username: body.username.trim().toLowerCase(),
    password: body.password,
    turnstileToken: typeof body.turnstileToken === 'string' ? body.turnstileToken.slice(0, 2048) : undefined,
    lang: isLang(body.lang) ? body.lang : undefined,
  }
}

/** True when Turnstile is not configured, or Cloudflare confirms the token is from a real visitor. */
async function passesTurnstile(request: Request, env: Env, token: string | undefined): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY) return true
  if (!token) return false
  const form = new FormData()
  form.append('secret', env.TURNSTILE_SECRET_KEY)
  form.append('response', token)
  form.append('remoteip', clientIp(request))
  try {
    const res = await fetch(env.TURNSTILE_VERIFY_URL ?? TURNSTILE_VERIFY, { method: 'POST', body: form })
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch {
    return false
  }
}

async function signup(request: Request, env: Env): Promise<Response> {
  if (env.SIGNUP_ENABLED === 'false') return json({ error: 'signup_disabled' }, 403)
  const creds = await readCredentials(request)
  if (creds instanceof Response) return creds
  const { username, password } = creds
  if (!USERNAME_RE.test(username)) return json({ error: 'invalid_username' }, 400)
  if (password.length < MIN_PASSWORD || password.length > 200) return json({ error: 'weak_password' }, 400)
  if (!(await passesTurnstile(request, env, creds.turnstileToken))) return json({ error: 'captcha_failed' }, 400)
  if (!(await hit(env, `signup-ip:${clientIp(request)}`, SIGNUP_PER_IP_PER_HOUR, 3600))) return tooMany()

  const exists = await env.DB.prepare('SELECT 1 FROM users WHERE username = ?').bind(username).first()
  if (exists) return json({ error: 'username_taken' }, 409)

  const salt = randomHex(16)
  await env.DB.prepare('INSERT INTO users (username, password_hash, salt, created_at) VALUES (?, ?, ?, ?)')
    .bind(username, await hashPassword(password, salt), salt, Date.now())
    .run()
  if (creds.lang) await saveLang(env, username, creds.lang)
  return startSession(request, env, username)
}

async function signin(request: Request, env: Env): Promise<Response> {
  const creds = await readCredentials(request)
  if (creds instanceof Response) return creds
  if (!(await hit(env, `signin-ip:${clientIp(request)}`, SIGNIN_PER_IP_PER_MINUTE, 60))) return tooMany()
  const failKey = `signin-fail:${creds.username}`
  if ((await peek(env, failKey, LOCK_SECONDS)) >= FAILS_BEFORE_LOCK) return json({ error: 'locked' }, 429)
  const user = await env.DB.prepare('SELECT password_hash, salt FROM users WHERE username = ?')
    .bind(creds.username)
    .first<{ password_hash: string; salt: string }>()
  // Hash even when the user does not exist, so timing does not reveal which usernames exist.
  const hash = await hashPassword(creds.password, user?.salt ?? 'no-such-user')
  if (!user || !safeEqual(hash, user.password_hash)) {
    await hit(env, failKey, FAILS_BEFORE_LOCK, LOCK_SECONDS)
    return json({ error: 'wrong_credentials' }, 401)
  }
  return startSession(request, env, creds.username)
}

async function signout(request: Request, env: Env): Promise<Response> {
  const token = readCookie(request, COOKIE)
  if (token) {
    await ensureSchema(env)
    await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256(token)).run()
  }
  return json({ ok: true }, 200, { 'set-cookie': sessionCookie(request, '', 0) })
}

export async function handleAuth(request: Request, env: Env, action: string): Promise<Response> {
  if (action === 'me' && request.method === 'GET') {
    const user = await currentUser(request, env)
    return user ? json({ user, lang: await userLang(env, user) }) : json({ error: 'not_signed_in' }, 401)
  }
  if (action === 'config' && request.method === 'GET') {
    return json({ turnstileSiteKey: env.TURNSTILE_SECRET_KEY ? (env.TURNSTILE_SITE_KEY ?? null) : null })
  }
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)
  if (action === 'signup') return signup(request, env)
  if (action === 'signin') return signin(request, env)
  if (action === 'signout') return signout(request, env)
  if (action === 'settings') {
    const user = await currentUser(request, env)
    if (!user) return json({ error: 'not_signed_in' }, 401)
    const body = (await request.json().catch(() => ({}))) as { lang?: unknown }
    if (!isLang(body.lang)) return json({ error: 'bad_lang' }, 400)
    await saveLang(env, user, body.lang)
    return json({ ok: true, lang: body.lang })
  }
  return json({ error: 'not_found' }, 404)
}
