import { createContext, useContext } from 'react'
import { detectLanguage, isLang, type LangCode } from './languages'
import en, { type Messages } from './locales/en'

const LANG_KEY = 'english-fun:lang'

/** Each language is its own small chunk, loaded when chosen. */
const LOADERS = import.meta.glob<{ default: Messages }>(['./locales/*.ts', '!./locales/en.ts'])

export async function loadMessages(lang: LangCode): Promise<Messages> {
  const load = LOADERS[`./locales/${lang}.ts`]
  return load ? (await load()).default : en
}

export function readStoredLang(): LangCode | null {
  try {
    const v = localStorage.getItem(LANG_KEY)
    return isLang(v) ? v : null
  } catch {
    return null
  }
}

export function storeLang(lang: LangCode) {
  try {
    localStorage.setItem(LANG_KEY, lang)
  } catch {
    // ignore
  }
}

/**
 * The language to start with: a saved choice, then one passed in the link (?lang=vi from the
 * Vietnamese public pages), then the browser's languages. People who used the app before it
 * had other languages keep Vietnamese. Null means the learner has to pick one.
 */
export function initialLang(): LangCode | null {
  const stored = readStoredLang()
  if (stored) return stored
  const fromLink = new URLSearchParams(window.location.search).get('lang')
  if (isLang(fromLink)) return fromLink
  try {
    if (localStorage.getItem('english-fun:vocab') || localStorage.getItem('english-fun:level')) return 'vi'
  } catch {
    // ignore
  }
  return detectLanguage(navigator.languages ?? [navigator.language])
}

export interface I18n {
  /** The learner's language, or null until they choose one. */
  lang: LangCode | null
  t: Messages
  setLang: (lang: LangCode) => void
}

export const Ctx = createContext<I18n>({ lang: null, t: en, setLang: () => {} })

export const useI18n = () => useContext(Ctx)

/** The learner-language translation of a passage: stored with AI passages, looked up for built-in ones. */
export function useTranslationOf() {
  const { t } = useI18n()
  return (p: { id: string; source?: string; tr?: string; vi?: string }) =>
    p.source === 'ai' ? (p.tr ?? p.vi ?? '') : (t.passages[p.id] ?? p.vi ?? '')
}
