import {
  ChevronUp,
  Layers,
  Library,
  Search,
  Trash2,
  Type,
  Volume2,
  Languages,
  type LucideIcon,
} from 'lucide-react'
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

const MODE_ICONS: Record<ReviewMode, LucideIcon> = {
  flashcard: Layers,
  'write-en': Type,
  'write-vi': Languages,
}

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

  const mastered = vocab.words.filter((w) => (w.reviewCount ?? 0) >= 3 && accuracy(w) >= 0.8).length

  return (
    <section className="main">
      <div className="page-head">
        <div>
          <h1>Kho từ vựng</h1>
          <p>Ôn tập thường xuyên để nhớ lâu. Từ trả lời sai sẽ được hỏi lại trước.</p>
        </div>
      </div>

      {vocab.words.length === 0 ? (
        <div className="card empty">
          <Library size={28} />
          <b>Chưa có từ nào</b>
          <span>Vào phần Đọc hiểu, bấm vào từ chưa biết để lưu vào kho.</span>
        </div>
      ) : (
        <>
          <div className="stats">
            <div className="card stat">
              <div className="label">Tổng số từ</div>
              <div className="value">{vocab.words.length}</div>
            </div>
            <div className="card stat">
              <div className="label">Đã thuộc</div>
              <div className="value">{mastered}</div>
            </div>
            <div className="card stat">
              <div className="label">Cần ôn lại</div>
              <div className="value">{missedCount}</div>
            </div>
            <div className="card stat">
              <div className="label">Lượt ôn tập</div>
              <div className="value">{totalReviews}</div>
            </div>
          </div>

          <div className="section">
            <div className="row space" style={{ marginBottom: 10 }}>
              <span className="eyebrow" style={{ margin: 0 }}>
                Ôn tập
              </span>
              <div className="segmented" role="radiogroup" aria-label="Số từ mỗi lượt">
                {SESSION_SIZES.map((n) => (
                  <button
                    key={n}
                    className={size === n ? 'active' : ''}
                    onClick={() => setSize(n)}
                    role="radio"
                    aria-checked={size === n}
                  >
                    {n ? `${n} từ` : 'Tất cả'}
                  </button>
                ))}
              </div>
            </div>
            <div className="mode-grid">
              {REVIEW_MODES.map((m) => {
                const Icon = MODE_ICONS[m.id]
                return (
                  <button key={m.id} className="mode-card" onClick={() => start(m.id)}>
                    <span className="mode-icon">
                      <Icon size={18} />
                    </span>
                    <span className="t">{m.name}</span>
                    <span className="d">{m.hint}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="eyebrow">Danh sách từ</div>
          <div className="list-tools">
            <div className="search">
              <Search size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm từ hoặc nghĩa..."
              />
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sắp xếp">
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <ul className="card word-rows">
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
                      aria-label={`Nghe ${w.word}`}
                    >
                      <Volume2 size={15} />
                    </button>
                  </span>
                  <span className="m">{w.meaning}</span>
                  <span className="st" title="Số lần ôn và tỉ lệ đúng">
                    {w.lastResult === 'wrong' && <span className="dot-miss" title="Sai lần gần nhất" />}
                    {w.reviewCount ? (
                      <>
                        <span>{w.reviewCount} lần</span>
                        <Meter value={accuracy(w)} />
                      </>
                    ) : (
                      <span>Chưa ôn</span>
                    )}
                  </span>
                </li>
              ),
            )}
            {list.length === 0 && <li className="empty">Không tìm thấy từ phù hợp.</li>}
          </ul>
        </>
      )}
    </section>
  )
}

function Meter({ value }: { value: number }) {
  const cls = value < 0.5 ? 'low' : value < 0.8 ? 'mid' : ''
  return (
    <span className={`meter ${cls}`} title={`Đúng ${Math.round(value * 100)}%`}>
      <i style={{ width: `${Math.max(6, value * 100)}%` }} />
    </span>
  )
}

function WordDetail({ w, vocab, onClose }: { w: VocabWord; vocab: VocabStore; onClose: () => void }) {
  const topic = TOPICS.find((t) => t.id === w.topicId)
  return (
    <li className="word-row open">
      <div className="row space">
        <span>
          <b className="big">{w.word}</b> {w.phonetic && <span className="muted">{w.phonetic}</span>}
          <button className="icon" onClick={() => speak(w.word)} title="Nghe phát âm" aria-label="Nghe phát âm">
            <Volume2 size={15} />
          </button>
        </span>
        <button className="icon" onClick={onClose} title="Thu gọn" aria-label="Thu gọn">
          <ChevronUp size={16} />
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
        {topic && `${topic.name} · `}
        Ôn {w.reviewCount ?? 0} lần, đúng {w.correctCount ?? 0} · Dùng trong bài viết {w.practiceCount} lần
      </p>
      <div>
        <button className="small danger-text" onClick={() => vocab.remove(w.word)}>
          <Trash2 size={14} /> Xóa từ này
        </button>
      </div>
    </li>
  )
}
