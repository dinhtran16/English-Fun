import { useEffect, useState } from 'react'
import { authenticate, AuthError, fetchSignupCaptcha } from '../auth'
import { useI18n, type LangCode } from '../i18n'
import { LogoMark } from './icons'
import { LanguageSelect } from './LanguagePicker'
import { Turnstile } from './Turnstile'

interface Props {
  onSignedIn: (user: string, lang: LangCode | null) => void
  onGuest: () => void
}

export function AuthScreen({ onSignedIn, onGuest }: Props) {
  const { lang, t } = useI18n()
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
      setError(t.auth.mismatch)
      return
    }
    if (needsCaptcha && !captcha) {
      setError(t.auth.captcha)
      return
    }
    setBusy(true)
    try {
      const r = await authenticate(mode, username, password, lang, needsCaptcha ? captcha : undefined)
      onSignedIn(r.user, r.lang)
    } catch (err) {
      const code = err instanceof AuthError ? err.code : 'generic'
      setError(t.auth.errors[code] ?? (code === 'network' ? t.auth.network : t.auth.generic))
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
          <p>{t.auth.tagline}</p>
        </div>
      </div>
      <form className="card auth-form" onSubmit={submit}>
        <h2>{mode === 'signin' ? t.auth.signIn : t.auth.signUp}</h2>
        <label className="field">
          {t.auth.username}
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoCapitalize="none"
            required
          />
        </label>
        <label className="field">
          {t.auth.password}
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
            {t.auth.confirm}
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
          </label>
        )}
        {needsCaptcha && (
          <Turnstile siteKey={siteKey} onToken={setCaptcha} resetKey={captchaRound} language={lang ?? 'auto'} />
        )}
        {error && <p className="error">{error}</p>}
        <button className="primary lg" type="submit" disabled={busy}>
          {busy ? t.auth.busy : mode === 'signin' ? t.auth.signIn : t.auth.signUp}
        </button>
        <p className="auth-foot">
          {mode === 'signin' ? t.auth.noAccount : t.auth.haveAccount}{' '}
          <button type="button" className="link" onClick={switchMode}>
            {mode === 'signin' ? t.auth.switchToSignUp : t.auth.switchToSignIn}
          </button>
        </p>
      </form>
      <div className="divider">{t.auth.or}</div>
      <button className="ghost" onClick={onGuest}>
        {t.auth.guest}
      </button>
      <p className="hint" style={{ textAlign: 'center', marginTop: -12 }}>
        {t.auth.guestNote}
      </p>
      <div className="auth-lang">
        <LanguageSelect />
      </div>
      <p className="hint" style={{ textAlign: 'center' }}>
        {/* The public pages are in Vietnamese for now. */}
        <a href="/">{t.auth.about}</a>
        {lang === 'vi' && (
          <>
            {' '}
            · <a href="/chu-de">Từ vựng theo chủ đề</a> · <a href="/blog">Blog</a>
          </>
        )}
      </p>
    </section>
  )
}
