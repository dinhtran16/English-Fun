export type Skill = 'reading' | 'writing'

export interface Topic {
  id: string
  name: string
  emoji: string
}

export interface Passage {
  id: string
  topicId: string
  title: string
  en: string
  vi: string
  source?: 'ai' | 'builtin'
}

export type Level = 'A2' | 'B1' | 'B2' | 'C1'

/** What the app needs to know to generate content. */
export interface PracticeSettings {
  aiEnabled: boolean
  level: Level
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
