import { Check, Loader2, MousePointerClick, Pencil, Plus, Search, Volume2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { lookupWord, speak } from '../dictionary'
import { useI18n } from '../i18n'
import type { VocabStore } from '../storage'
import type { PendingWord } from './usePendingWords'

interface Props {
  pending: PendingWord[]
  setPending: React.Dispatch<React.SetStateAction<PendingWord[]>>
  addPending: (word: string) => void
  vocab: VocabStore
  topicId: string
}

export function WordPanel({ pending, setPending, addPending: add, vocab, topicId }: Props) {
  const { lang, t } = useI18n()
  const [over, setOver] = useState(false)
  const [typed, setTyped] = useState('')

  // Look up any word still loading.
  useEffect(() => {
    pending
      .filter((p) => p.status === 'loading')
      .forEach((p) => {
        lookupWord(p.word, lang ?? 'vi').then((info) =>
          setPending((prev) =>
            prev.map((x) =>
              x.word === p.word && x.status === 'loading'
                ? { ...x, status: 'done', info, meaning: x.meaning || info.meaning || '' }
                : x,
            ),
          ),
        )
      })
  }, [pending, setPending, lang])

  const saveWord = (p: PendingWord) => {
    vocab.add({
      word: p.word,
      meaning: p.meaning.trim(),
      phonetic: p.info?.phonetic,
      definition: p.info?.definition,
      example: p.info?.example,
      topicId,
    })
    // Keep the word in the list, marked as saved, so the learner sees what they collected.
    setPending((prev) => prev.map((x) => (x.word === p.word ? { ...x, saved: true } : x)))
  }

  const remove = (word: string) => setPending((prev) => prev.filter((x) => x.word !== word))

  return (
    <aside
      className={`panel card ${over ? 'drag-over' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        const text = e.dataTransfer.getData('text/plain')
        text.split(/\s+/).forEach(add)
      }}
    >
      <div className="panel-head">
        <h3>{t.panel.title}</h3>
        {pending.length > 0 && (
          <span className="row" style={{ gap: 4 }}>
            <span className="small muted">{t.panel.count(pending.length)}</span>
            <button className="link small" onClick={() => setPending([])}>
              {t.panel.clearAll}
            </button>
          </span>
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          add(typed)
          setTyped('')
        }}
      >
        <input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder={t.panel.lookupPlaceholder} />
        <button type="submit" aria-label={t.panel.lookup}>
          <Search size={16} />
        </button>
      </form>

      {pending.length === 0 && (
        <div className="dropzone">
          <MousePointerClick size={20} />
          {t.panel.dropzone}
        </div>
      )}

      <ul className="pending">
        {pending.map((p) =>
          p.saved ? (
          <li key={p.word} className="pending-item saved">
            <div className="row space">
              <span className="word-title">
                <b>{p.word}</b>
                <span className="small muted">{p.meaning}</span>
              </span>
              <span className="row" style={{ gap: 0 }}>
                <span className="saved-mark small" title={t.panel.saved}>
                  <Check size={14} /> {t.panel.saved}
                </span>
                <button className="icon" onClick={() => speak(p.word)} title={t.panel.listen} aria-label={t.panel.listen}>
                  <Volume2 size={16} />
                </button>
                <button
                  className="icon"
                  onClick={() => setPending((prev) => prev.map((x) => (x.word === p.word ? { ...x, saved: false } : x)))}
                  title={t.panel.edit}
                  aria-label={t.panel.edit}
                >
                  <Pencil size={15} />
                </button>
                <button className="icon" onClick={() => remove(p.word)} title={t.panel.remove} aria-label={t.panel.removeWord}>
                  <X size={16} />
                </button>
              </span>
            </div>
          </li>
          ) : (
          <li key={p.word} className="pending-item">
            <div className="row space">
              <span className="word-title">
                <b>{p.word}</b>
                {p.info?.phonetic && <span className="small muted">{p.info.phonetic}</span>}
              </span>
              <span className="row" style={{ gap: 0 }}>
                <button className="icon" onClick={() => speak(p.word)} title={t.panel.listen} aria-label={t.panel.listen}>
                  <Volume2 size={16} />
                </button>
                <button
                  className="icon"
                  onClick={() => remove(p.word)}
                  title={t.panel.remove}
                  aria-label={t.panel.removeWord}
                >
                  <X size={16} />
                </button>
              </span>
            </div>
            {p.status === 'loading' ? (
              <p className="small muted row">
                <Loader2 size={14} className="spin" /> {t.panel.loading}
              </p>
            ) : (
              <>
                {p.info?.definition && (
                  <p className="def">
                    {p.info.partOfSpeech && <em>{p.info.partOfSpeech}</em>}
                    {p.info.definition}
                  </p>
                )}
                {p.info?.example && <p className="example">“{p.info.example}”</p>}
                {!p.info?.definition && !p.info?.meaning && (
                  <p className="small muted">{t.panel.notFound}</p>
                )}
              </>
            )}
            <input
              value={p.meaning}
              onChange={(e) =>
                setPending((prev) =>
                  prev.map((x) => (x.word === p.word ? { ...x, meaning: e.target.value } : x)),
                )
              }
              placeholder={t.panel.meaningPlaceholder}
              aria-label={t.panel.meaningOf(p.word)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && p.meaning.trim()) saveWord(p)
              }}
            />
            <button className="primary" onClick={() => saveWord(p)} disabled={!p.meaning.trim()}>
              {vocab.has(p.word) ? (
                t.panel.update
              ) : (
                <>
                  <Plus size={16} /> {t.panel.add}
                </>
              )}
            </button>
          </li>
          ),
        )}
      </ul>
    </aside>
  )
}
