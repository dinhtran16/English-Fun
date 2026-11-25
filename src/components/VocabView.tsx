import { useMemo, useState } from 'react'
import { TOPICS } from '../data/passages'
import { speak } from '../dictionary'
import type { VocabStore } from '../storage'
import type { VocabWord } from '../types'

interface Props {
  vocab: VocabStore
}

export function VocabView({ vocab }: Props) {
  const [query, setQuery] = useState('')
  const [reviewing, setReviewing] = useState(false)

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return vocab.words.filter(
      (w) => !q || w.word.includes(q) || w.meaning.toLowerCase().includes(q),
    )
  }, [vocab.words, query])

  if (reviewing && vocab.words.length > 0) {
    return <Review words={vocab.words} onDone={() => setReviewing(false)} />
  }

  return (
    <section className="main">
      <div className="row space">
        <h2>📚 Kho từ vựng ({vocab.words.length})</h2>
        <button
          className="primary"
          disabled={vocab.words.length === 0}
          onClick={() => setReviewing(true)}
        >
          Ôn tập thẻ từ
        </button>
      </div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm từ hoặc nghĩa..."
      />
      {vocab.words.length === 0 && (
        <p className="muted">Chưa có từ nào. Vào phần Đọc và kéo từ mới vào bảng để bắt đầu.</p>
      )}
      <ul className="vocab-list">
        {list.map((w) => (
          <li key={w.word} className="card">
            <div className="row space">
              <span>
                <strong className="big">{w.word}</strong>{' '}
                {w.phonetic && <span className="muted">{w.phonetic}</span>}
                <button className="icon" onClick={() => speak(w.word)} title="Nghe phát âm">
                  🔊
                </button>
              </span>
              <span className="muted small">
                {TOPICS.find((t) => t.id === w.topicId)?.emoji} Đã luyện {w.practiceCount} lần
              </span>
            </div>
            <input
              className="meaning"
              value={w.meaning}
              onChange={(e) => vocab.update(w.word, { meaning: e.target.value })}
              aria-label={`Nghĩa của ${w.word}`}
            />
            {w.definition && <p className="def">{w.definition}</p>}
            {w.example && <p className="example">“{w.example}”</p>}
            <button className="link danger" onClick={() => vocab.remove(w.word)}>
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Review({ words, onDone }: { words: VocabWord[]; onDone: () => void }) {
  const [order] = useState(() =>
    [...words].sort((a, b) => a.practiceCount - b.practiceCount).slice(0, 20),
  )
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const card = order[i]

  const go = (d: number) => {
    setFlipped(false)
    setI((x) => Math.min(order.length - 1, Math.max(0, x + d)))
  }

  return (
    <section className="main review">
      <div className="row space">
        <h2>
          Ôn tập {i + 1}/{order.length}
        </h2>
        <button onClick={onDone}>Xong</button>
      </div>
      <button className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped((f) => !f)}>
        {flipped ? (
          <>
            <span className="big">{card.meaning}</span>
            {card.example && <span className="example">“{card.example}”</span>}
          </>
        ) : (
          <>
            <span className="huge">{card.word}</span>
            {card.phonetic && <span className="muted">{card.phonetic}</span>}
            <span className="hint">Bấm để lật thẻ</span>
          </>
        )}
      </button>
      <div className="row center">
        <button onClick={() => go(-1)} disabled={i === 0}>
          ← Trước
        </button>
        <button onClick={() => speak(card.word)}>🔊</button>
        <button onClick={() => go(1)} disabled={i === order.length - 1}>
          Sau →
        </button>
      </div>
    </section>
  )
}
