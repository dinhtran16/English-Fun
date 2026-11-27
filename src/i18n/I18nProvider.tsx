import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Ctx, initialLang, loadMessages, storeLang, type I18n } from './context'
import type { LangCode } from './languages'
import en, { type Messages } from './locales/en'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode | null>(initialLang)
  const [loaded, setLoaded] = useState<{ lang: LangCode; t: Messages } | null>(null)

  useEffect(() => {
    if (!lang) return
    let live = true
    loadMessages(lang).then((t) => live && setLoaded({ lang, t }))
    document.documentElement.lang = lang
    return () => {
      live = false
    }
  }, [lang])

  const setLang = useCallback((l: LangCode) => {
    storeLang(l)
    setLangState(l)
  }, [])

  const value = useMemo<I18n>(
    () => ({ lang, t: loaded && loaded.lang === lang ? loaded.t : en, setLang }),
    [lang, loaded, setLang],
  )
  // Wait for the chosen language so the interface doesn't flash in English.
  if (lang && loaded?.lang !== lang && !loaded) return null
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

