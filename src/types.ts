import type { LangCode } from './i18n/languages'

export type Skill = 'reading' | 'writing'

export interface Topic {
  id: string
  name: string
  emoji: string
  /** Accent color of the topic's icon (a `tone-*` class in index.css and site.css). */
  tone: string
}

export interface Passage {
  id: string
  topicId: string
  title: string
  en: string
  /** Vietnamese translation (built-in passages, and AI passages made before other languages existed). */
  vi?: string
  /** Translation in the learner's language (AI passages). Built-in ones are looked up in the locale files. */
  tr?: string
  lang?: string
  source?: 'ai' | 'builtin'
}

export type Level = 'A2' | 'B1' | 'B2' | 'C1'

/** What the app needs to know to generate content. */
export interface PracticeSettings {
  aiEnabled: boolean
  level: Level
  /** The learner's language, for translations and AI feedback. */
  lang: LangCode
}

export interface VocabWord {
  word: string
  meaning: string
  phonetic?: string
  definition?: string
  example?: string
  topicId?: string
  addedAt: number
  updatedAt?: number
  /** Times used in a writing exercise. */
  practiceCount: number
  lastPracticedAt?: number
  /** Times reviewed (flashcard or typing quiz), and how many of those were right. */
  reviewCount?: number
  correctCount?: number
  lastReviewedAt?: number
  /** Result of the most recent review, so missed words come back first. */
  lastResult?: 'right' | 'wrong'
}
