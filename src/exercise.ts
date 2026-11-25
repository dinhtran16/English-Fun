import { passagesFor } from './data/passages'
import type { Passage, VocabWord } from './types'

export interface WritingExercise {
  passage: Passage
  /** Vocab words the learner should use; those found in the passage come first. */
  targets: VocabWord[]
}

const MAX_TARGETS = 5

/** True if `text` contains `word` or a simple inflection of it (plural, -ed, -ing...). */
export function containsWord(text: string, word: string): boolean {
  if (word.length <= 3) return new RegExp(`\\b${escape(word)}s?\\b`, 'i').test(text)
  const stem = word.replace(/(e|y)$/, '')
  const re = new RegExp(`\\b${escape(stem)}[a-z]{0,4}\\b`, 'i')
  return re.test(text)
}

function escape(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Least-practiced, newest words first, with some randomness so exercises vary. */
function rankWords(words: VocabWord[]): VocabWord[] {
  return shuffle(words).sort(
    (a, b) => a.practiceCount - b.practiceCount || b.addedAt - a.addedAt,
  )
}

/** Up to five words to practise: words already in `preferred` first, then same topic, then the rest. */
export function pickTargets(
  bank: VocabWord[],
  topicId: string,
  preferred: VocabWord[] = [],
): VocabWord[] {
  const others = rankWords(bank).filter((w) => !preferred.includes(w))
  const sameTopic = others.filter((w) => w.topicId === topicId)
  const rest = others.filter((w) => w.topicId !== topicId)
  return [...rankWords(preferred), ...sameTopic, ...rest].slice(0, MAX_TARGETS)
}

/**
 * Builds a writing exercise for a topic: picks the passage that reuses the most
 * words from the learner's bank, then chooses up to five target words to practise.
 */
export function buildExercise(
  topicId: string,
  bank: VocabWord[],
  excludePassageId?: string,
): WritingExercise {
  const all = passagesFor(topicId)
  const candidates = all.length > 1 ? all.filter((p) => p.id !== excludePassageId) : all

  const scored = shuffle(candidates).map((p) => ({
    passage: p,
    hits: bank.filter((w) => containsWord(p.en, w.word)),
  }))
  scored.sort((a, b) => b.hits.length - a.hits.length)
  const { passage, hits } = scored[0]

  return { passage: { ...passage, source: 'builtin' }, targets: pickTargets(bank, topicId, hits) }
}

/** Rough share of the reference's words that appear in the learner's text (0-100). */
export function overlapScore(answer: string, reference: string): number {
  const tokens = (s: string) =>
    s
      .toLowerCase()
      .split(/[^a-z']+/)
      .filter((t) => t.length > 2)
  const ref = new Set(tokens(reference))
  const ans = new Set(tokens(answer))
  if (ref.size === 0) return 0
  let hit = 0
  ref.forEach((t) => ans.has(t) && hit++)
  return Math.round((hit / ref.size) * 100)
}
