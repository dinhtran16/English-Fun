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
  practiceCount: number
  lastPracticedAt?: number
}
