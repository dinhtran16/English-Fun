export type AuthState =
  | { kind: 'checking' }
  | { kind: 'offline' } // no server (e.g. npm run dev): local-only mode
  | { kind: 'signed-out' }
  | { kind: 'guest' } // chose to use the app without an account
  | { kind: 'signed-in'; user: string }

const ERRORS: Record<string, string> = {
  invalid_username: 'Tên đăng nhập gồm 3-32 ký tự: chữ thường, số, dấu chấm, gạch ngang hoặc gạch dưới.',
  weak_password: 'Mật khẩu cần ít nhất 8 ký tự.',
  username_taken: 'Tên đăng nhập này đã có người dùng.',
  wrong_credentials: 'Sai tên đăng nhập hoặc mật khẩu.',
  signup_disabled: 'Hiện chưa mở đăng ký tài khoản mới.',
  captcha_failed: 'Chưa xác minh được bạn là người thật. Hãy làm lại bước xác minh.',
  rate_limited: 'Bạn thử quá nhiều lần. Hãy đợi một lát rồi thử lại.',
  locked: 'Tài khoản tạm khoá 15 phút vì nhập sai mật khẩu nhiều lần.',
}

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
    if (res.ok) return { kind: 'signed-in', user: data.user }
    return res.status === 401 ? { kind: 'signed-out' } : { kind: 'offline' }
  } catch {
    return { kind: 'offline' }
  }
}

/** Signs in or up; returns the username, or throws an Error with a Vietnamese message. */
export async function authenticate(
  mode: 'signin' | 'signup',
  username: string,
  password: string,
  turnstileToken?: string,
) {
  let result
  try {
    result = await call(mode, 'POST', { username, password, turnstileToken })
  } catch {
    throw new Error('Không kết nối được máy chủ. Hãy thử lại.')
  }
  const { res, data } = result
  if (res.ok && data?.user) return data.user as string
  throw new Error(ERRORS[data?.error] ?? 'Có lỗi xảy ra, hãy thử lại.')
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
