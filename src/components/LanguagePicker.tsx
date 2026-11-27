import { Globe } from 'lucide-react'
import { LANGUAGES, useI18n, type LangCode } from '../i18n'
import { LogoMark } from './icons'

/** Shown on the first visit when the browser's language isn't one the app supports. */
export function LanguagePicker() {
  const { t, setLang } = useI18n()
  return (
    <section className="auth">
      <div className="auth-brand">
        <LogoMark />
        <div>
          <h1>English Fun</h1>
          <p>{t.auth.tagline}</p>
        </div>
      </div>
      <div className="card auth-form">
        <h2>{t.chooseLanguage.title}</h2>
        <p className="muted small">{t.chooseLanguage.text}</p>
        <div className="lang-grid">
          {LANGUAGES.map((l) => (
            <button key={l.code} onClick={() => setLang(l.code)} lang={l.code}>
              {l.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Compact language switcher for the top bar and the sign-in screen. */
export function LanguageSelect({ onChange }: { onChange?: (lang: LangCode) => void }) {
  const { lang, t, setLang } = useI18n()
  return (
    <label className="lang-select" title={t.chooseLanguage.label}>
      <Globe size={15} aria-hidden />
      <select
        value={lang ?? ''}
        aria-label={t.chooseLanguage.label}
        onChange={(e) => {
          const l = e.target.value as LangCode
          setLang(l)
          onChange?.(l)
        }}
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.name}
          </option>
        ))}
      </select>
    </label>
  )
}
