import { TOPICS } from './data/passages'
import type { LangCode } from './i18n/languages'
import type { Messages } from './i18n/locales/en'
import type { Level, Passage, Topic, VocabWord } from './types'

export interface Feedback {
  score: number
  summary: string
  corrections: { original: string; suggestion: string; explanation: string }[]
  improved: string
  wordNotes: { word: string; used: boolean; note: string }[]
}

/** Thrown when the AI can't be used; `code` is a key of `aiErrors` in the locale files. */
export class AiUnavailable extends Error {
  code: string
  constructor(code: string) {
    super(code)
    this.code = code
  }
}

async function post<T>(path: string, body: unknown): Promise<T> {
  let res: Response
  try {
    res = await fetch(`/api/ai/${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'same-origin',
    })
  } catch {
    throw new AiUnavailable('network')
  }
  const isJson = res.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await res.json() : null
  if (!res.ok || !data) {
    throw new AiUnavailable(typeof data?.error === 'string' ? data.error : 'ai_failed')
  }
  return data as T
}

const toTargets = (words: VocabWord[]) => words.map((w) => ({ word: w.word, meaning: w.meaning }))

export async function generatePassage(
  topic: Topic,
  mode: 'reading' | 'writing',
  level: Level,
  lang: LangCode,
  targets: VocabWord[] = [],
): Promise<Passage> {
  const { passage } = await post<{ passage: Passage }>('passage', {
    topicId: topic.id,
    topicName: TOPICS.find((t) => t.id === topic.id)?.name ?? topic.name,
    mode,
    level,
    lang,
    targetWords: toTargets(targets),
  })
  return passage
}

/** `source` is the passage in the learner's language, which they translated into English. */
export async function gradeTranslation(
  passage: Passage,
  source: string,
  answer: string,
  targets: VocabWord[],
  lang: LangCode,
): Promise<Feedback> {
  const { feedback } = await post<{ feedback: Feedback }>('grade', {
    source,
    lang,
    reference: passage.en,
    answer,
    targetWords: toTargets(targets),
  })
  return feedback
}

/** Why the AI passage couldn't be used, followed by "using a built-in passage". */
export function fallbackNotice(t: Messages, err: unknown): string {
  const reason = err instanceof AiUnavailable ? t.aiErrors[err.code] : undefined
  return `${reason ?? t.practice.aiFailed} ${t.practice.usingBuiltin}`
}

