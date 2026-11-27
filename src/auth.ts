import { isLang, type LangCode } from './i18n/languages'

export type AuthState =
  | { kind: 'checking' }
  | { kind: 'offline' } // no server (e.g. npm run dev): local-only mode
  | { kind: 'signed-out' }
  | { kind: 'guest' } // chose to use the app without an account
  | { kind: 'signed-in'; user: string; lang: LangCode | null }

async function call(path: string, method: string, body?: unknown) {
  const res = await fetch(`/api/auth/${path}`, {
    method,
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'same-origin',
  })
  const isJson = res.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await res.json() : null
  return { res, data, isJson }
}

export async function checkSession(): Promise<AuthState> {
  try {
    const { res, data, isJson } = await call('me', 'GET')
    if (!isJson) return { kind: 'offline' }
    if (res.ok) return { kind: 'signed-in', user: data.user, lang: isLang(data.lang) ? data.lang : null }
    return res.status === 401 ? { kind: 'signed-out' } : { kind: 'offline' }
  } catch {
    return { kind: 'offline' }
  }
}

/** Thrown by `authenticate`; `code` is a key of `auth.errors` in the locale files, or 'network' / 'generic'. */
export class AuthError extends Error {
  code: string
  constructor(code: string) {
    super(code)
    this.code = code
  }
}

/** Signs in or up; returns the username and their saved language. A new account saves `lang`. */
export async function authenticate(
  mode: 'signin' | 'signup',
  username: string,
  password: string,
  lang: LangCode | null,
  turnstileToken?: string,
): Promise<{ user: string; lang: LangCode | null }> {
  let result
  try {
    result = await call(mode, 'POST', { username, password, turnstileToken, lang: lang ?? undefined })
  } catch {
    throw new AuthError('network')
  }
  const { res, data } = result
  if (res.ok && data?.user) return { user: data.user as string, lang: isLang(data.lang) ? data.lang : null }
  throw new AuthError(typeof data?.error === 'string' ? data.error : 'generic')
}

/** Saves the learner's language on their account (best effort). */
export async function saveLanguage(lang: LangCode) {
  try {
    await call('settings', 'POST', { lang })
  } catch {
    // Kept locally anyway; sent again next time it changes.
  }
}

export async function signOut() {
  try {
    await call('signout', 'POST')
  } catch {
    // Ignore: the local session is cleared anyway.
  }
}

/** The Turnstile site key when the server asks for a captcha on sign-up, else null. */
export async function fetchSignupCaptcha(): Promise<string | null> {
  try {
    const { res, data } = await call('config', 'GET')
    return res.ok && typeof data?.turnstileSiteKey === 'string' ? data.turnstileSiteKey : null
  } catch {
    return null
  }
}
