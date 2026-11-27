import { useCallback, useEffect } from 'react'
import { useDraft } from '../persist'
import type { LookupResult } from '../dictionary'
import { normalizeWord } from '../storage'

export interface PendingWord {
  word: string
  status: 'loading' | 'done'
  info?: LookupResult
  meaning: string
  /** Already added to the word bank; it stays in the list until the topic or skill changes. */
  saved?: boolean
}

/** Draft key of the word list; App keeps it when a new exercise starts. */
export const PENDING_KEY = 'pending'

interface Stored {
  scope: string
  words: PendingWord[]
}

/**
 * Holds the words dragged into the panel; each new word is looked up automatically by WordPanel.
 * The list belongs to one topic and skill (`scope`): it survives a new passage, a page reload and
 * leaving to the home screen, and starts empty when the learner picks another topic or skill.
 */
export function usePendingWords(scope: string) {
  const [stored, setStored] = useDraft<Stored>(PENDING_KEY, { scope, words: [] })
  const pending = stored.scope === scope && Array.isArray(stored.words) ? stored.words : []

  // A list from another topic or skill is dropped, so it doesn't come back later.
  useEffect(() => {
    if (stored.scope !== scope) setStored({ scope, words: [] })
  }, [stored.scope, scope, setStored])

  // Stable, since WordPanel's lookup effect depends on it.
  const setPending = useCallback<React.Dispatch<React.SetStateAction<PendingWord[]>>>(
    (action) =>
      setStored((prev) => {
        const words = prev.scope === scope && Array.isArray(prev.words) ? prev.words : []
        return { scope, words: typeof action === 'function' ? action(words) : action }
      }),
    [scope, setStored],
  )

  const addPending = (raw: string) => {
    const word = normalizeWord(raw)
    if (!word) return
    setPending((prev) => {
      const found = prev.find((p) => p.word === word)
      // A word dragged in again moves back to the top, ready to edit.
      if (found) return [{ ...found, saved: false }, ...prev.filter((p) => p !== found)]
      return [{ word, status: 'loading', meaning: '' }, ...prev]
    })
  }

  return { pending, setPending, addPending }
}
