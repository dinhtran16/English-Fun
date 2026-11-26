import { ArrowRight, Check, RefreshCw, RotateCcw, Volume2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { speak } from '../dictionary'
import { checkEnglish, checkVietnamese, REVIEW_MODES, type ReviewMode, type Verdict } from '../review'
import type { VocabWord } from '../types'

interface Props {
  mode: ReviewMode
  words: VocabWord[]
  onResult: (word: string, right: boolean) => void
  onExit: () => void
  onRetry: (missed: VocabWord[]) => void
}

export function ReviewSession({ mode, words, onResult, onExit, onRetry }: Props) {
  const [i, setI] = useState(0)
  const [results, setResults] = useState<Record<string, boolean>>({})
  const done = i >= words.length
  const card = words[i]
  const modeInfo = REVIEW_MODES.find((m) => m.id === mode)!

  const record = (right: boolean) => {
    onResult(card.word, right)
    setResults((r) => ({ ...r, [card.word]: right }))
    setI((x) => x + 1)
  }

  if (done) {
    const missed = words.filter((w) => results[w.word] === false)
    const right = words.length - missed.length
    return (
      <section className="main review">
        <div className="card summary">
          <div
            className="ring"
            style={{
              background: `conic-gradient(var(--good) ${(right / words.length) * 360}deg, var(--border) 0)`,
            }}
          >
            <span className="ring-inner">
              {right}/{words.length}
            </span>
          </div>
          <h2>{missed.length === 0 ? 'Xuất sắc, bạn nhớ hết!' : 'Hoàn thành lượt ôn'}</h2>
          <p className="muted">
            {modeInfo.name} · đúng {Math.round((right / words.length) * 100)}%
          </p>
          {missed.length > 0 && (
            <ul className="card word-rows" style={{ width: '100%', textAlign: 'left', boxShadow: 'none' }}>
              {missed.map((w) => (
                <li key={w.word} className="word-row" style={{ cursor: 'default' }}>
                  <span className="w">
                    <b>{w.word}</b>
                  </span>
                  <span className="m">{w.meaning}</span>
                  <span />
                </li>
              ))}
            </ul>
          )}
          <div className="row center">
            <button onClick={onExit}>Về kho từ</button>
            {missed.length > 0 && (
              <button className="primary" onClick={() => onRetry(missed)}>
                <RotateCcw size={16} /> Ôn lại {missed.length} từ sai
              </button>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="main review">
      <div className="row space" style={{ marginBottom: 12 }}>
        <h2>{modeInfo.name}</h2>
        <button className="ghost small" onClick={onExit}>
          <X size={16} /> Dừng
        </button>
      </div>
      <div className="row space small muted" style={{ marginBottom: 6 }}>
        <span>
          {i + 1} / {words.length}
        </span>
        <span>Đã ôn từ này {card.reviewCount ?? 0} lần</span>
      </div>
      <div className="progress">
        <div style={{ width: `${(i / words.length) * 100}%` }} />
      </div>
      {mode === 'flashcard' ? (
        <Flashcard key={card.word} card={card} onAnswer={record} />
      ) : (
        <TypingCard key={card.word} card={card} mode={mode} onAnswer={record} />
      )}
    </section>
  )
}

function Flashcard({ card, onAnswer }: { card: VocabWord; onAnswer: (right: boolean) => void }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <>
      <button className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped((f) => !f)}>
        {flipped ? (
          <>
            <span className="big">{card.meaning}</span>
            {card.definition && <span className="small muted">{card.definition}</span>}
            {card.example && <span className="example">“{card.example}”</span>}
          </>
        ) : (
          <>
            <span className="huge">{card.word}</span>
            {card.phonetic && <span className="muted">{card.phonetic}</span>}
            <span className="hint">Nhớ nghĩa, rồi bấm để lật thẻ</span>
          </>
        )}
      </button>
      <div className="row center">
        <button onClick={() => speak(card.word)} aria-label="Nghe phát âm">
          <Volume2 size={16} />
        </button>
        {flipped ? (
          <>
            <button className="bad lg" onClick={() => onAnswer(false)}>
              <X size={17} /> Chưa nhớ
            </button>
            <button className="good lg" onClick={() => onAnswer(true)}>
              <Check size={17} /> Đã nhớ
            </button>
          </>
        ) : (
          <button className="primary lg" onClick={() => setFlipped(true)}>
            <RefreshCw size={16} /> Lật thẻ
          </button>
        )}
      </div>
    </>
  )
}

function TypingCard({
  card,
  mode,
  onAnswer,
}: {
  card: VocabWord
  mode: ReviewMode
  onAnswer: (right: boolean) => void
}) {
  const [answer, setAnswer] = useState('')
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [override, setOverride] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const nextBtn = useRef<HTMLButtonElement>(null)
  const toEnglish = mode === 'write-en'

  useEffect(() => {
    if (verdict) nextBtn.current?.focus()
    else input.current?.focus()
  }, [verdict, override])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (verdict) return
    const v = toEnglish ? checkEnglish(answer, card.word) : checkVietnamese(answer, card.meaning)
    setVerdict(v)
    if (toEnglish && v !== 'wrong') speak(card.word)
  }

  const right = override || verdict === 'right' || verdict === 'almost'

  return (
    <form className="flashcard typing" onSubmit={submit}>
      <span className="prompt">{toEnglish ? 'Viết từ tiếng Anh' : 'Viết nghĩa tiếng Việt'}</span>
      <span className="huge">{toEnglish ? card.meaning : card.word}</span>
      {!toEnglish && (
        <span className="row center">
          {card.phonetic && <span className="muted">{card.phonetic}</span>}
          <button type="button" className="icon" onClick={() => speak(card.word)} aria-label="Nghe phát âm">
            <Volume2 size={16} />
          </button>
        </span>
      )}
      <input
        ref={input}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        readOnly={!!verdict}
        placeholder={toEnglish ? 'Gõ từ tiếng Anh...' : 'Gõ nghĩa tiếng Việt...'}
        autoCapitalize="none"
        autoComplete="off"
        spellCheck={false}
        className={verdict ? (right ? 'ok' : 'ko') : ''}
      />
      {!verdict ? (
        <div className="row center">
          <button type="button" onClick={() => setVerdict('wrong')}>
            Không nhớ
          </button>
          <button className="primary" type="submit" disabled={!answer.trim()}>
            Kiểm tra
          </button>
        </div>
      ) : (
        <>
          <p className={right ? 'verdict ok' : 'verdict ko'}>
            {right ? <Check size={16} /> : <X size={16} />}
            {override
              ? 'Đã tính là đúng'
              : verdict === 'right'
                ? 'Chính xác'
                : verdict === 'almost'
                  ? 'Gần đúng (thiếu dấu)'
                  : 'Chưa đúng'}
          </p>
          <p>
            Đáp án: <b>{toEnglish ? card.word : card.meaning}</b>
            {toEnglish && card.phonetic && <span className="muted"> {card.phonetic}</span>}
          </p>
          <div className="row center">
            {!right && answer.trim() && (
              <button type="button" onClick={() => setOverride(true)}>
                Tôi trả lời đúng
              </button>
            )}
            <button ref={nextBtn} type="button" className="primary" onClick={() => onAnswer(right)}>
              Tiếp <ArrowRight size={16} />
            </button>
          </div>
        </>
      )}
    </form>
  )
}
