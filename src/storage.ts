import { useCallback, useEffect, useRef, useState } from 'react'
import type { VocabWord } from './types'

/**
 * The vocabulary bank lives on the server (Cloudflare D1 through /api/vocab) when it is
 * reachable, with a copy in localStorage so the app still works offline or in local dev.
 * Changes not yet confirmed by the server are remembered in "dirty"/"deleted" lists and
 * sent on the next successful sync.
 */

const KEYS = {
  vocab: 'english-fun:vocab',
  dirty: 'english-fun:vocab-dirty',
  deleted: 'english-fun:vocab-deleted',
  syncedUser: 'english-fun:synced-user',
}

const PUSH_DELAY_MS = 800

export type SyncStatus = 'loading' | 'synced' | 'local' | 'error'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
  } catch {
    // Storage may be unavailable (private mode). The app still works for this visit.
  }
}

const readSet = (key: string) => new Set(read<string[]>(key, []))
const writeSet = (key: string, s: Set<string>) => write(key, [...s])

export function normalizeWord(w: string): string {
  return w
    .toLowerCase()
    .replace(/^[^a-z']+|[^a-z']+$/g, '')
    .replace(/'s$/, '')
}

const stamp = (w: VocabWord) => w.updatedAt ?? w.addedAt

async function api(method: string, init: RequestInit & { query?: string } = {}) {
  const res = await fetch(`/api/vocab${init.query ?? ''}`, {
    method,
    headers: init.body ? { 'content-type': 'application/json' } : undefined,
    body: init.body,
    credentials: 'same-origin',
  })
  const isJson = res.headers.get('content-type')?.includes('application/json')
  if (!res.ok || !isJson) throw new Error(`api ${res.status}`)
  return res.json()
}

/** `user` is the signed-in username, or null to keep the bank on this device only. */
export function useVocab(user: string | null) {
  const [words, setWords] = useState<VocabWord[]>(() => read(KEYS.vocab, []))
  // The sync status belongs to one user; for anyone else it is derived below.
  const [sync, setSync] = useState<{ user: string | null; status: SyncStatus }>({
    user: null,
    status: 'loading',
  })
  const status: SyncStatus = !user ? 'local' : sync.user === user ? sync.status : 'loading'
  const userRef = useRef(user)
  useEffect(() => {
    userRef.current = user
  }, [user])
  const setStatus = useCallback(
    (s: SyncStatus) => setSync({ user: userRef.current, status: s }),
    [],
  )
  const wordsRef = useRef(words)
  const statusRef = useRef(status)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    wordsRef.current = words
    write(KEYS.vocab, words)
  }, [words])
  useEffect(() => {
    statusRef.current = status
  }, [status])

  /** Sends every dirty word and pending delete to the server. */
  const flush = useCallback(async () => {
    if (statusRef.current !== 'synced' && statusRef.current !== 'error') return
    const dirty = readSet(KEYS.dirty)
    const deleted = readSet(KEYS.deleted)
    const toSend = wordsRef.current.filter((w) => dirty.has(w.word))
    try {
      if (toSend.length) await api('POST', { body: JSON.stringify({ words: toSend }) })
      for (const word of deleted) {
        await api('DELETE', { query: `?word=${encodeURIComponent(word)}` })
      }
      // Keep anything changed again while we were sending.
      const nowDirty = readSet(KEYS.dirty)
      toSend.forEach((w) => {
        const current = wordsRef.current.find((x) => x.word === w.word)
        if (!current || stamp(current) === stamp(w)) nowDirty.delete(w.word)
      })
      writeSet(KEYS.dirty, nowDirty)
      const nowDeleted = readSet(KEYS.deleted)
      deleted.forEach((d) => nowDeleted.delete(d))
      writeSet(KEYS.deleted, nowDeleted)
      setStatus('synced')
    } catch {
      setStatus('error')
    }
  }, [setStatus])

  const schedulePush = useCallback(() => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(flush, PUSH_DELAY_MS)
  }, [flush])

  // Sync with the server whenever the signed-in user changes.
  useEffect(() => {
    let cancelled = false
    statusRef.current = user ? 'loading' : 'local'
    if (!user) return
    ;(async () => {
      try {
        const data = (await api('GET')) as { user: string; words: VocabWord[] }
        if (cancelled) return
        const local = read<VocabWord[]>(KEYS.vocab, [])
        const firstSyncHere = read<string | null>(KEYS.syncedUser, null) !== data.user
        const dirty = firstSyncHere ? new Set(local.map((w) => w.word)) : readSet(KEYS.dirty)
        const deleted = readSet(KEYS.deleted)

        const merged = new Map(data.words.filter((w) => !deleted.has(w.word)).map((w) => [w.word, w]))
        for (const w of local) {
          if (!dirty.has(w.word)) continue
          const server = merged.get(w.word)
          if (!server || stamp(w) >= stamp(server)) merged.set(w.word, w)
          else dirty.delete(w.word)
        }
        writeSet(KEYS.dirty, dirty)
        write(KEYS.syncedUser, JSON.stringify(data.user))

        const list = [...merged.values()].sort((a, b) => b.addedAt - a.addedAt)
        wordsRef.current = list
        statusRef.current = 'synced'
        setWords(list)
        setStatus('synced')
        if (dirty.size || deleted.size) flush()
      } catch {
        if (!cancelled) setStatus('local')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [flush, setStatus, user])

  /** Forgets this device's copy (used on sign-out, so the next person starts clean). */
  const clearLocal = useCallback(() => {
    window.clearTimeout(timer.current)
    Object.values(KEYS).forEach((k) => {
      try {
        localStorage.removeItem(k)
      } catch {
        // ignore
      }
    })
    wordsRef.current = []
    setWords([])
  }, [])

  const markDirty = useCallback(
    (list: string[]) => {
      const dirty = readSet(KEYS.dirty)
      list.forEach((w) => dirty.add(w))
      writeSet(KEYS.dirty, dirty)
      const deleted = readSet(KEYS.deleted)
      list.forEach((w) => deleted.delete(w))
      writeSet(KEYS.deleted, deleted)
      schedulePush()
    },
    [schedulePush],
  )

  const has = useCallback(
    (word: string) => words.some((w) => w.word === normalizeWord(word)),
    [words],
  )

  const add = useCallback(
    (entry: Omit<VocabWord, 'addedAt' | 'practiceCount' | 'updatedAt'>) => {
      const word = normalizeWord(entry.word)
      if (!word) return
      const now = Date.now()
      setWords((prev) => {
        const existing = prev.find((w) => w.word === word)
        if (existing) {
          return prev.map((w) => (w.word === word ? { ...w, ...entry, word, updatedAt: now } : w))
        }
        return [{ ...entry, word, addedAt: now, updatedAt: now, practiceCount: 0 }, ...prev]
      })
      markDirty([word])
    },
    [markDirty],
  )

  const update = useCallback(
    (word: string, patch: Partial<VocabWord>) => {
      const now = Date.now()
      setWords((prev) => prev.map((w) => (w.word === word ? { ...w, ...patch, updatedAt: now } : w)))
      markDirty([word])
    },
    [markDirty],
  )

  const remove = useCallback(
    (word: string) => {
      setWords((prev) => prev.filter((w) => w.word !== word))
      const dirty = readSet(KEYS.dirty)
      dirty.delete(word)
      writeSet(KEYS.dirty, dirty)
      const deleted = readSet(KEYS.deleted)
      deleted.add(word)
      writeSet(KEYS.deleted, deleted)
      schedulePush()
    },
    [schedulePush],
  )

  const markPracticed = useCallback(
    (list: string[]) => {
      const now = Date.now()
      setWords((prev) =>
        prev.map((w) =>
          list.includes(w.word)
            ? { ...w, practiceCount: w.practiceCount + 1, lastPracticedAt: now, updatedAt: now }
            : w,
        ),
      )
      markDirty(list)
    },
    [markDirty],
  )

  return { words, has, add, update, remove, markPracticed, status, clearLocal }
}

export type VocabStore = ReturnType<typeof useVocab>
