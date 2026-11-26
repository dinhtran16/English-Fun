import { useMemo, useState } from 'react'
import { TOPICS } from '../data/passages'
import { speak } from '../dictionary'
import { pickReviewWords, REVIEW_MODES, type ReviewMode } from '../review'
import type { VocabStore } from '../storage'
import type { VocabWord } from '../types'
import { ReviewSession } from './ReviewSession'

interface Props {
  vocab: VocabStore
}

type Sort = 'newest' | 'least-reviewed' | 'most-missed' | 'az'

const SORTS: { id: Sort; label: string }[] = [
  { id: 'newest', label: 'Mới thêm' },
  { id: 'least-reviewed', label: 'Ít ôn nhất' },
  { id: 'most-missed', label: 'Hay sai' },
  { id: 'az', label: 'A → Z' },
]

const accuracy = (w: VocabWord) =>
  w.reviewCount ? (w.correctCount ?? 0) / w.reviewCount : 1

function sortWords(list: VocabWord[], sort: Sort): VocabWord[] {
  const out = [...list]
  if (sort === 'newest') out.sort((a, b) => b.addedAt - a.addedAt)
  if (sort === 'least-reviewed') out.sort((a, b) => (a.reviewCount ?? 0) - (b.reviewCount ?? 0))
  if (sort === 'most-missed') out.sort((a, b) => accuracy(a) - accuracy(b))
  if (sort === 'az') out.sort((a, b) => a.word.localeCompare(b.word))
  return out
}

const SESSION_SIZES = [10, 20, 0] // 0 = all

export function VocabView({ vocab }: Props) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>('newest')
  const [open, setOpen] = useState<string | null>(null)
  const [size, setSize] = useState(10)
  const [session, setSession] = useState<{ mode: ReviewMode; words: VocabWord[]; key: number } | null>(
    null,
  )

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = vocab.words.filter(
      (w) => !q || w.word.includes(q) || w.meaning.toLowerCase().includes(q),
    )
    return sortWords(filtered, sort)
  }, [vocab.words, query, sort])

  const totalReviews = vocab.words.reduce((n, w) => n + (w.reviewCount ?? 0), 0)
  const missedCount = vocab.words.filter((w) => w.lastResult === 'wrong').length

  const start = (mode: ReviewMode, words?: VocabWord[]) => {
    const chosen = words ?? pickReviewWords(vocab.words, size || vocab.words.length)
    if (chosen.length) setSession({ mode, words: chosen, key: Date.now() })
  }

  if (session) {
    return (
      <ReviewSession
        key={session.key}
        mode={session.mode}
        words={session.words}
        onResult={vocab.markReviewed}
        onExit={() => setSession(null)}
        onRetry={(missed) =>
          start(
            session.mode,
            missed.map((m) => vocab.words.find((w) => w.word === m.word) ?? m),
          )
        }
      />
    )
  }

  return (
    <section className="main">
      <h2>📚 Kho từ vựng</h2>
      <p className="muted small">
        {vocab.words.length} từ · đã ôn tổng cộng {totalReviews} lượt
        {missedCount > 0 && ` · ${missedCount} từ trả lời sai lần gần nhất`}
      </p>

      {vocab.words.length === 0 ? (
        <p className="muted">Chưa có từ nào. Vào phần Đọc và kéo từ mới vào bảng để bắt đầu.</p>
      ) : (
        <div className="review-start">
          <div className="row space">
            <strong>Ôn tập</strong>
            <span className="row small">
              Số từ:
              {SESSION_SIZES.map((n) => (
                <button
                  key={n}
                  className={`mini ${size === n ? 'active' : ''}`}
                  onClick={() => setSize(n)}
                >
                  {n || 'Tất cả'}
                </button>
              ))}
            </span>
          </div>
          <div className="grid modes">
            {REVIEW_MODES.map((m) => (
              <button key={m.id} className="mode" onClick={() => start(m.id)}>
                <span className="big">
                  {m.icon} {m.name}
                </span>
                <span className="small muted">{m.hint}</span>
              </button>
            ))}
          </div>
          <p className="hint">Ưu tiên từ trả lời sai lần trước, rồi đến từ chưa ôn và từ lâu chưa ôn.</p>
        </div>
      )}

      {vocab.words.length > 0 && (
        <div className="row list-tools">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm từ hoặc nghĩa..."
          />
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sắp xếp">
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <ul className="word-rows">
        {list.map((w) =>
          open === w.word ? (
            <WordDetail key={w.word} w={w} vocab={vocab} onClose={() => setOpen(null)} />
          ) : (
            <li key={w.word} className="word-row" onClick={() => setOpen(w.word)}>
              <span className="w">
                <b>{w.word}</b>
                <button
                  className="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    speak(w.word)
                  }}
                  title="Nghe phát âm"
                >
                  🔊
                </button>
              </span>
              <span className="m">{w.meaning}</span>
              <span className="stats small muted" title="Số lần ôn · tỉ lệ đúng">
                {w.lastResult === 'wrong' && <span className="dot" title="Sai lần gần nhất" />}
                {w.reviewCount ? `${w.reviewCount}× · ${Math.round(accuracy(w) * 100)}%` : 'chưa ôn'}
              </span>
            </li>
          ),
        )}
      </ul>
    </section>
  )
}

function WordDetail({ w, vocab, onClose }: { w: VocabWord; vocab: VocabStore; onClose: () => void }) {
  const topic = TOPICS.find((t) => t.id === w.topicId)
  return (
    <li className="word-row open">
      <div className="row space">
        <span>
          <b className="big">{w.word}</b> {w.phonetic && <span className="muted">{w.phonetic}</span>}
          <button className="icon" onClick={() => speak(w.word)} title="Nghe phát âm">
            🔊
          </button>
        </span>
        <button className="icon" onClick={onClose} title="Thu gọn">
          ✕
        </button>
      </div>
      <label className="field">
        Nghĩa tiếng Việt
        <input
          value={w.meaning}
          onChange={(e) => vocab.update(w.word, { meaning: e.target.value })}
          aria-label={`Nghĩa của ${w.word}`}
        />
      </label>
      {w.definition && <p className="def">{w.definition}</p>}
      {w.example && <p className="example">“{w.example}”</p>}
      <p className="small muted">
        {topic && `${topic.emoji} ${topic.name} · `}
        Ôn {w.reviewCount ?? 0} lần, đúng {w.correctCount ?? 0} · Dùng trong bài viết {w.practiceCount} lần
      </p>
      <button className="link danger" onClick={() => vocab.remove(w.word)}>
        Xóa từ này
      </button>
    </li>
  )
}
