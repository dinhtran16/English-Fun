import { useState } from 'react'
import { authenticate } from '../auth'

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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (mode === 'signup' && password !== confirm) {
      setError('Mật khẩu nhập lại không khớp.')
      return
    }
    setBusy(true)
    try {
      onSignedIn(await authenticate(mode, username, password))
    } catch (err) {
      setError((err as Error).message)
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
      <h1>✨ English Fun</h1>
      <p className="muted">Luyện đọc, viết tiếng Anh và xây kho từ vựng của riêng bạn.</p>
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
        {error && <p className="error">{error}</p>}
        <button className="primary" type="submit" disabled={busy}>
          {busy ? 'Đang xử lý...' : mode === 'signin' ? 'Đăng nhập' : 'Đăng ký'}
        </button>
        <p className="small">
          {mode === 'signin' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
          <button type="button" className="link" onClick={switchMode}>
            {mode === 'signin' ? 'Đăng ký' : 'Đăng nhập'}
          </button>
        </p>
      </form>
      <button className="link" onClick={onGuest}>
        Dùng thử không cần tài khoản (kho từ chỉ lưu trên máy này)
      </button>
    </section>
  )
}
