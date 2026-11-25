import { useState } from 'react'
import type { LookupResult } from '../dictionary'
import { normalizeWord } from '../storage'

export interface PendingWord {
  word: string
  status: 'loading' | 'done'
  info?: LookupResult
  meaning: string
}

/** Holds the words dragged into the panel; each new word is looked up automatically by WordPanel. */
export function usePendingWords() {
  const [pending, setPending] = useState<PendingWord[]>([])

  const addPending = (raw: string) => {
    const word = normalizeWord(raw)
    if (!word) return
    setPending((prev) =>
      prev.some((p) => p.word === word)
        ? prev
        : [{ word, status: 'loading', meaning: '' }, ...prev],
    )
  }

  return { pending, setPending, addPending }
}
