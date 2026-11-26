import { Loader2, MousePointerClick, Plus, Search, Volume2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { lookupWord, speak } from '../dictionary'
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
  const [over, setOver] = useState(false)
  const [typed, setTyped] = useState('')

  // Look up any word still loading.
  useEffect(() => {
    pending
      .filter((p) => p.status === 'loading')
      .forEach((p) => {
        lookupWord(p.word).then((info) =>
          setPending((prev) =>
            prev.map((x) =>
              x.word === p.word && x.status === 'loading'
                ? { ...x, status: 'done', info, meaning: x.meaning || info.meaningVi || '' }
                : x,
            ),
          ),
        )
      })
  }, [pending, setPending])

  const saveWord = (p: PendingWord) => {
    vocab.add({
      word: p.word,
      meaning: p.meaning.trim(),
      phonetic: p.info?.phonetic,
      definition: p.info?.definition,
      example: p.info?.example,
      topicId,
    })
    setPending((prev) => prev.filter((x) => x.word !== p.word))
  }

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
        <h3>Từ mới</h3>
        {pending.length > 0 && <span className="small muted">{pending.length} từ</span>}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          add(typed)
          setTyped('')
        }}
      >
        <input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Tra một từ..." />
        <button type="submit" aria-label="Tra từ">
          <Search size={16} />
        </button>
      </form>

      {pending.length === 0 && (
        <div className="dropzone">
          <MousePointerClick size={20} />
          Kéo hoặc bấm vào một từ trong bài để tra nghĩa và lưu vào kho
        </div>
      )}

      <ul className="pending">
        {pending.map((p) => (
          <li key={p.word} className="pending-item">
            <div className="row space">
              <span className="word-title">
                <b>{p.word}</b>
                {p.info?.phonetic && <span className="small muted">{p.info.phonetic}</span>}
              </span>
              <span className="row" style={{ gap: 0 }}>
                <button className="icon" onClick={() => speak(p.word)} title="Nghe phát âm" aria-label="Nghe phát âm">
                  <Volume2 size={16} />
                </button>
                <button
                  className="icon"
                  onClick={() => setPending((prev) => prev.filter((x) => x.word !== p.word))}
                  title="Bỏ"
                  aria-label="Bỏ từ này"
                >
                  <X size={16} />
                </button>
              </span>
            </div>
            {p.status === 'loading' ? (
              <p className="small muted row">
                <Loader2 size={14} className="spin" /> Đang tra từ...
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
                {!p.info?.definition && !p.info?.meaningVi && (
                  <p className="small muted">Không tìm thấy nghĩa tự động, bạn hãy tự nhập.</p>
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
              placeholder="Nghĩa tiếng Việt"
              aria-label={`Nghĩa tiếng Việt của ${p.word}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && p.meaning.trim()) saveWord(p)
              }}
            />
            <button className="primary" onClick={() => saveWord(p)} disabled={!p.meaning.trim()}>
              {vocab.has(p.word) ? (
                'Cập nhật trong kho'
              ) : (
                <>
                  <Plus size={16} /> Thêm vào kho
                </>
              )}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
