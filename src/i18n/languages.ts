/**
 * Languages a learner can study English from. The chosen language is used for the
 * interface, word meanings, passage translations, writing exercises and AI feedback.
 * The same list is checked on the server (worker/languages.ts imports it).
 */
export const LANGUAGES = [
  { code: 'vi', name: 'Tiếng Việt', english: 'Vietnamese', translate: 'vi' },
  { code: 'es', name: 'Español', english: 'Spanish', translate: 'es' },
  { code: 'pt', name: 'Português', english: 'Portuguese (Brazilian)', translate: 'pt-BR' },
  { code: 'fr', name: 'Français', english: 'French', translate: 'fr' },
  { code: 'de', name: 'Deutsch', english: 'German', translate: 'de' },
  { code: 'id', name: 'Bahasa Indonesia', english: 'Indonesian', translate: 'id' },
  { code: 'ja', name: '日本語', english: 'Japanese', translate: 'ja' },
  { code: 'ko', name: '한국어', english: 'Korean', translate: 'ko' },
  { code: 'zh', name: '简体中文', english: 'Simplified Chinese', translate: 'zh-CN' },
  { code: 'hi', name: 'हिन्दी', english: 'Hindi', translate: 'hi' },
] as const

export type LangCode = (typeof LANGUAGES)[number]['code']

export const isLang = (v: unknown): v is LangCode => LANGUAGES.some((l) => l.code === v)

export const languageInfo = (code: LangCode) => LANGUAGES.find((l) => l.code === code)!

/** The first of the browser's preferred languages that the app supports, if any. */
export function detectLanguage(preferred: readonly string[]): LangCode | null {
  for (const tag of preferred) {
    const base = tag.toLowerCase().split('-')[0]
    if (isLang(base)) return base
  }
  return null
}
