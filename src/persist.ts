import { useEffect, useState } from 'react'

/**
 * Drafts of the exercise in progress, kept in localStorage so a page reload
 * brings the learner back to the same passage with their text intact.
 * There is one exercise at a time, so drafts are cleared when a new one starts.
 */
const PREFIX = 'english-fun:draft:'

export function loadDraft<T>(key: string): T | undefined {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw === null ? undefined : (JSON.parse(raw) as T)
  } catch {
    return undefined
  }
}

export function saveDraft(key: string, value: unknown) {
  try {
    if (value === undefined || value === null) localStorage.removeItem(PREFIX + key)
    else localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable: the draft just won't survive a reload.
  }
}

/** Clears every draft except the keys in `keep`. */
export function clearDrafts(keep: string[] = []) {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX) && !keep.includes(k.slice(PREFIX.length)))
      .forEach((k) => localStorage.removeItem(k))
  } catch {
    // ignore
  }
}

/** useState that also survives a page reload. */
export function useDraft<T>(key: string, initial: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    const stored = loadDraft<T>(key)
    if (stored !== undefined) return stored
    return typeof initial === 'function' ? (initial as () => T)() : initial
  })
  useEffect(() => saveDraft(key, value), [key, value])
  return [value, setValue] as const
}
