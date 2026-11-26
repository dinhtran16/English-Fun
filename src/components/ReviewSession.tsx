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
        <h2>🎉 Hoàn thành!</h2>
        <p className="big">
          Đúng <b>{right}</b>/{words.length} từ
        </p>
        <div className="progress">
          <div style={{ width: `${(right / words.length) * 100}%` }} />
        </div>
        {missed.length > 0 && (
          <>
            <strong>Từ cần ôn thêm</strong>
            <ul className="word-rows compact">
              {missed.map((w) => (
                <li key={w.word}>
                  <b>{w.word}</b> <span className="muted">{w.meaning}</span>
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="row">
          {missed.length > 0 && (
            <button className="primary" onClick={() => onRetry(missed)}>
              Ôn lại {missed.length} từ sai
            </button>
          )}
          <button onClick={onExit}>Về kho từ</button>
        </div>
      </section>
    )
  }

  return (
    <section className="main review">
      <div className="row space">
        <h2>
          {modeInfo.icon} {modeInfo.name}
        </h2>
        <button onClick={onExit}>Dừng</button>
      </div>
      <div className="row space small muted">
        <span>
          Thẻ {i + 1}/{words.length}
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
            <span className="hint">Nhớ nghĩa rồi bấm để lật thẻ</span>
          </>
        )}
      </button>
      <div className="row center">
        <button onClick={() => speak(card.word)}>🔊</button>
        {flipped ? (
          <>
            <button className="bad" onClick={() => onAnswer(false)}>
              😕 Chưa nhớ
            </button>
            <button className="good" onClick={() => onAnswer(true)}>
              😊 Đã nhớ
            </button>
          </>
        ) : (
          <button className="primary" onClick={() => setFlipped(true)}>
            Lật thẻ
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
      <span className="muted small">{toEnglish ? 'Từ tiếng Anh của:' : 'Nghĩa tiếng Việt của:'}</span>
      <span className="huge">{toEnglish ? card.meaning : card.word}</span>
      {!toEnglish && (
        <span className="row center">
          {card.phonetic && <span className="muted">{card.phonetic}</span>}
          <button type="button" className="icon" onClick={() => speak(card.word)}>
            🔊
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
            {override
              ? '✅ Đã tính là đúng'
              : verdict === 'right'
                ? '✅ Chính xác!'
                : verdict === 'almost'
                  ? '✅ Gần đúng (thiếu dấu)'
                  : '❌ Chưa đúng'}
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
              Tiếp →
            </button>
          </div>
        </>
      )}
    </form>
  )
}
