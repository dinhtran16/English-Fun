import { useCallback, useEffect, useState } from 'react'
import type { VocabWord } from './types'

const VOCAB_KEY = 'english-fun:vocab'

function load(): VocabWord[] {
  try {
    const raw = localStorage.getItem(VOCAB_KEY)
    return raw ? (JSON.parse(raw) as VocabWord[]) : []
  } catch {
    return []
  }
}

function save(words: VocabWord[]) {
  try {
    localStorage.setItem(VOCAB_KEY, JSON.stringify(words))
  } catch {
    // Storage may be unavailable (private mode). The app still works for this visit.
  }
}

export function normalizeWord(w: string): string {
  return w
    .toLowerCase()
    .replace(/^[^a-z']+|[^a-z']+$/g, '')
    .replace(/'s$/, '')
}

export function useVocab() {
  const [words, setWords] = useState<VocabWord[]>(load)

  useEffect(() => save(words), [words])

  const has = useCallback(
    (word: string) => words.some((w) => w.word === normalizeWord(word)),
    [words],
  )

  const add = useCallback((entry: Omit<VocabWord, 'addedAt' | 'practiceCount'>) => {
    const word = normalizeWord(entry.word)
    if (!word) return
    setWords((prev) => {
      const existing = prev.find((w) => w.word === word)
      if (existing) {
        return prev.map((w) => (w.word === word ? { ...w, ...entry, word } : w))
      }
      return [{ ...entry, word, addedAt: Date.now(), practiceCount: 0 }, ...prev]
    })
  }, [])

  const update = useCallback((word: string, patch: Partial<VocabWord>) => {
    setWords((prev) => prev.map((w) => (w.word === word ? { ...w, ...patch } : w)))
  }, [])

  const remove = useCallback((word: string) => {
    setWords((prev) => prev.filter((w) => w.word !== word))
  }, [])

  const markPracticed = useCallback((list: string[]) => {
    const now = Date.now()
    setWords((prev) =>
      prev.map((w) =>
        list.includes(w.word)
          ? { ...w, practiceCount: w.practiceCount + 1, lastPracticedAt: now }
          : w,
      ),
    )
  }, [])

  return { words, has, add, update, remove, markPracticed }
}

export type VocabStore = ReturnType<typeof useVocab>
