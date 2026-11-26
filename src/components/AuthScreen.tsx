import { useEffect, useState } from 'react'
import { authenticate, fetchSignupCaptcha } from '../auth'
import { LogoMark } from './icons'
import { Turnstile } from './Turnstile'

interface Props {
  onSignedIn: (user: string) => void
  onGuest: () => void
}

export function AuthScreen({ onSignedIn, onGuest }: Props) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [siteKey, setSiteKey] = useState<string | null>(null)
  const [captcha, setCaptcha] = useState('')
  const [captchaRound, setCaptchaRound] = useState(0)

  useEffect(() => {
    fetchSignupCaptcha().then(setSiteKey)
  }, [])

  const needsCaptcha = mode === 'signup' && !!siteKey

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (mode === 'signup' && password !== confirm) {
      setError('Mật khẩu nhập lại không khớp.')
      return
    }
    if (needsCaptcha && !captcha) {
      setError('Hãy hoàn thành bước xác minh bên dưới.')
      return
    }
    setBusy(true)
    try {
      onSignedIn(await authenticate(mode, username, password, needsCaptcha ? captcha : undefined))
    } catch (err) {
      setError((err as Error).message)
      if (needsCaptcha) {
        // A token works only once, so show a fresh check.
        setCaptcha('')
        setCaptchaRound((n) => n + 1)
      }
    } finally {
      setBusy(false)
    }
  }

  const switchMode = () => {
    setMode((m) => (m === 'signin' ? 'signup' : 'signin'))
    setError('')
  }

  return (
    <section className="auth">
      <div className="auth-brand">
        <LogoMark />
        <div>
          <h1>English Fun</h1>
          <p>Luyện đọc, viết và xây kho từ vựng của riêng bạn</p>
        </div>
      </div>
      <form className="card auth-form" onSubmit={submit}>
        <h2>{mode === 'signin' ? 'Đăng nhập' : 'Tạo tài khoản'}</h2>
        <label className="field">
          Tên đăng nhập
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoCapitalize="none"
            required
          />
        </label>
        <label className="field">
          Mật khẩu
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            required
          />
        </label>
        {mode === 'signup' && (
          <label className="field">
            Nhập lại mật khẩu
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
          </label>
        )}
        {needsCaptcha && <Turnstile siteKey={siteKey} onToken={setCaptcha} resetKey={captchaRound} />}
        {error && <p className="error">{error}</p>}
        <button className="primary lg" type="submit" disabled={busy}>
          {busy ? 'Đang xử lý...' : mode === 'signin' ? 'Đăng nhập' : 'Tạo tài khoản'}
        </button>
        <p className="auth-foot">
          {mode === 'signin' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
          <button type="button" className="link" onClick={switchMode}>
            {mode === 'signin' ? 'Đăng ký' : 'Đăng nhập'}
          </button>
        </p>
      </form>
      <div className="divider">hoặc</div>
      <button className="ghost" onClick={onGuest}>
        Dùng thử không cần tài khoản
      </button>
      <p className="hint" style={{ textAlign: 'center', marginTop: -12 }}>
        Kho từ khi dùng thử chỉ lưu trên máy này.
      </p>
    </section>
  )
}
