import type { VocabWord } from './types'

export type ReviewMode = 'flashcard' | 'write-en' | 'write-meaning'

/** Names and hints are in the locale files (review.modes). */
export const REVIEW_MODES: ReviewMode[] = ['flashcard', 'write-en', 'write-meaning']

/** Missed words first, then never-reviewed, then the ones reviewed longest ago. */
export function pickReviewWords(words: VocabWord[], count: number): VocabWord[] {
  const rank = (w: VocabWord) => {
    if (w.lastResult === 'wrong') return 0
    if (!w.reviewCount) return 1
    return 2
  }
  return [...words]
    .map((w) => ({ w, r: Math.random() }))
    .sort(
      (a, b) =>
        rank(a.w) - rank(b.w) ||
        (a.w.lastReviewedAt ?? 0) - (b.w.lastReviewedAt ?? 0) ||
        a.r - b.r,
    )
    .slice(0, count)
    .map(({ w }) => w)
}

const clean = (s: string) =>
  s
    .normalize('NFC')
    .toLowerCase()
    .replace(/[.!?"“”()[\]。！？「」]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const stripAccents = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')

export type Verdict = 'right' | 'almost' | 'wrong'

/** English answer: exact word, ignoring case, allowing a plural -s / -es. */
export function checkEnglish(answer: string, word: string): Verdict {
  const a = clean(answer)
  if (!a) return 'wrong'
  if (a === word || a === `${word}s` || a === `${word}es` || `${a}s` === word) return 'right'
  return 'wrong'
}

/**
 * Meaning in the learner's language: the saved meaning may list several senses ("hạn chót, thời hạn").
 * Right if the answer matches one of them (or one contains the other); "almost" if it
 * only matches once accents are ignored.
 */
export function checkMeaning(answer: string, meaning: string): Verdict {
  const a = clean(answer)
  if (!a) return 'wrong'
  const options = clean(meaning)
    .split(/[,;/、，；|]| hoặc /)
    .map((o) => o.trim())
    .filter(Boolean)
  const matches = (x: string, y: string) =>
    x === y || (x.length >= 2 && y.includes(x)) || (y.length >= 2 && x.includes(y))
  if (options.some((o) => matches(a, o))) return 'right'
  if (options.some((o) => matches(stripAccents(a), stripAccents(o)))) return 'almost'
  return 'wrong'
}
