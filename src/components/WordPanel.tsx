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
      className={`panel ${over ? 'drag-over' : ''}`}
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
      <h3>Bảng từ mới</h3>
      <p className="hint">Kéo từ trong đoạn văn vào đây, hoặc bấm vào từ.</p>
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault()
          add(typed)
          setTyped('')
        }}
      >
        <input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder="Hoặc gõ một từ..."
        />
        <button type="submit">Tra</button>
      </form>

      {pending.length === 0 && <div className="drop-empty">Thả từ vào đây</div>}

      <ul className="pending">
        {pending.map((p) => (
          <li key={p.word} className="card">
            <div className="row space">
              <strong className="big">{p.word}</strong>
              <span>
                {p.info?.phonetic && <span className="muted">{p.info.phonetic} </span>}
                <button className="icon" onClick={() => speak(p.word)} title="Nghe phát âm">
                  🔊
                </button>
              </span>
            </div>
            {p.status === 'loading' ? (
              <p className="muted">Đang tra từ...</p>
            ) : (
              <>
                {p.info?.definition && (
                  <p className="def">
                    {p.info.partOfSpeech && <em>({p.info.partOfSpeech}) </em>}
                    {p.info.definition}
                  </p>
                )}
                {p.info?.example && <p className="example">“{p.info.example}”</p>}
                {!p.info?.definition && !p.info?.meaningVi && (
                  <p className="muted">Không tìm thấy nghĩa tự động, bạn hãy tự nhập.</p>
                )}
              </>
            )}
            <label className="field">
              Nghĩa tiếng Việt
              <input
                value={p.meaning}
                onChange={(e) =>
                  setPending((prev) =>
                    prev.map((x) => (x.word === p.word ? { ...x, meaning: e.target.value } : x)),
                  )
                }
                placeholder="Nhập nghĩa của bạn"
              />
            </label>
            <div className="row">
              <button className="primary" onClick={() => saveWord(p)} disabled={!p.meaning.trim()}>
                {vocab.has(p.word) ? 'Cập nhật trong kho' : '+ Thêm vào kho'}
              </button>
              <button onClick={() => setPending((prev) => prev.filter((x) => x.word !== p.word))}>
                Bỏ
              </button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}
