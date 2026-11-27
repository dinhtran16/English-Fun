import { languageInfo, type LangCode } from './i18n/languages'

export interface LookupResult {
  phonetic?: string
  definition?: string
  example?: string
  partOfSpeech?: string
  /** Machine translation into the learner's language. */
  meaning?: string
  audioUrl?: string
}

interface DictEntry {
  phonetic?: string
  phonetics?: { text?: string; audio?: string }[]
  meanings?: {
    partOfSpeech?: string
    definitions?: { definition?: string; example?: string }[]
  }[]
}

async function lookupEnglish(word: string): Promise<Partial<LookupResult>> {
  const res = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
  )
  if (!res.ok) return {}
  const data = (await res.json()) as DictEntry[]
  const entry = data[0]
  if (!entry) return {}
  const meaning = entry.meanings?.[0]
  const def = meaning?.definitions?.[0]
  const withExample = entry.meanings
    ?.flatMap((m) => m.definitions ?? [])
    .find((d) => d.example)
  return {
    phonetic: entry.phonetic ?? entry.phonetics?.find((p) => p.text)?.text,
    audioUrl: entry.phonetics?.find((p) => p.audio)?.audio,
    partOfSpeech: meaning?.partOfSpeech,
    definition: def?.definition,
    example: def?.example ?? withExample?.example,
  }
}

async function translate(word: string, lang: LangCode): Promise<string | undefined> {
  const target = languageInfo(lang).translate
  const res = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|${target}`,
  )
  if (!res.ok) return undefined
  const data = (await res.json()) as { responseData?: { translatedText?: string } }
  const text = data.responseData?.translatedText?.trim()
  if (!text || text.toLowerCase() === word.toLowerCase()) return undefined
  return text
}

/** Looks up a word in a free English dictionary and a free translator into the learner's language. Either may fail; the user can always type the meaning. */
export async function lookupWord(word: string, lang: LangCode): Promise<LookupResult> {
  const [en, tr] = await Promise.allSettled([lookupEnglish(word), translate(word, lang)])
  return {
    ...(en.status === 'fulfilled' ? en.value : {}),
    meaning: tr.status === 'fulfilled' ? tr.value : undefined,
  }
}

export function speak(text: string) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = 0.9
  window.speechSynthesis.speak(u)
}
