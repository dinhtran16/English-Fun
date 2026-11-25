import { useState } from 'react'
import { buildExercise, containsWord, overlapScore } from '../exercise'
import type { VocabStore } from '../storage'
import type { Topic } from '../types'
import { PassageText } from './PassageText'
import { usePendingWords } from './usePendingWords'
import { WordPanel } from './WordPanel'

interface Props {
  topic: Topic
  vocab: VocabStore
}

export function WritingView({ topic, vocab }: Props) {
  const [exercise, setExercise] = useState(() => buildExercise(topic.id, vocab.words))
  const [translation, setTranslation] = useState('')
  const [ownSentences, setOwnSentences] = useState('')
  const [checked, setChecked] = useState(false)
  const { pending, setPending, addPending } = usePendingWords()

  const { passage, targets } = exercise
  const allText = `${translation}\n${ownSentences}`
  const usedWords = targets.filter((t) => containsWord(allText, t.word)).map((t) => t.word)

  const next = () => {
    setExercise(buildExercise(topic.id, vocab.words, passage.id))
    setTranslation('')
    setOwnSentences('')
    setChecked(false)
  }

  const check = () => {
    setChecked(true)
    if (usedWords.length) vocab.markPracticed(usedWords)
  }

  return (
    <div className="split">
      <section className="main">
        <div className="row space">
          <h2>
            {topic.emoji} Bài viết: {passage.title}
          </h2>
          <button onClick={next}>🎲 Bài khác</button>
        </div>

        <div className="targets">
          <strong>Từ cần dùng</strong>
          {targets.length === 0 ? (
            <p className="muted">
              Kho từ của bạn đang trống. Hãy luyện Đọc để thêm từ, bài viết sau sẽ đưa chúng vào.
            </p>
          ) : (
            <ul className="chips">
              {targets.map((t) => (
                <li
                  key={t.word}
                  className={`chip ${usedWords.includes(t.word) ? 'used' : ''}`}
                  title={t.definition}
                >
                  <b>{t.word}</b> · {t.meaning}
                </li>
              ))}
            </ul>
          )}
        </div>

        <h3>1. Dịch đoạn văn sau sang tiếng Anh</h3>
        <div className="reference vi">
          <p>{passage.vi}</p>
        </div>
        <textarea
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          placeholder="Write your English translation here..."
          rows={7}
          spellCheck
        />

        {targets.length > 0 && (
          <>
            <h3>2. Viết thêm 2-3 câu của riêng bạn, dùng các từ còn thiếu</h3>
            <textarea
              value={ownSentences}
              onChange={(e) => setOwnSentences(e.target.value)}
              placeholder="Your own sentences..."
              rows={3}
              spellCheck
            />
          </>
        )}

        <div className="row">
          <button className="primary" onClick={check} disabled={!translation.trim()}>
            ✅ Kiểm tra
          </button>
          {targets.length > 0 && (
            <span className="muted">
              Đã dùng {usedWords.length}/{targets.length} từ
            </span>
          )}
        </div>

        {checked && (
          <div className="result">
            <p>
              Độ trùng khớp với bản gốc: <b>{overlapScore(translation, passage.en)}%</b>
              <span className="muted"> (chỉ là con số tham khảo, cách diễn đạt khác vẫn có thể đúng)</span>
            </p>
            {targets.length > 0 && (
              <p>
                {usedWords.length === targets.length
                  ? '🎉 Tuyệt! Bạn đã dùng đủ tất cả từ cần luyện.'
                  : `Còn thiếu: ${targets
                      .filter((t) => !usedWords.includes(t.word))
                      .map((t) => t.word)
                      .join(', ')}`}
              </p>
            )}
            <strong>Bản gốc tiếng Anh</strong>
            <p className="hint">Bấm hoặc kéo từ mới vào bảng bên cạnh để lưu.</p>
            <PassageText
              text={passage.en}
              isKnown={vocab.has}
              isTarget={(w) => targets.some((t) => t.word === w)}
              onPick={addPending}
            />
          </div>
        )}
      </section>

      <WordPanel
        pending={pending}
        setPending={setPending}
        addPending={addPending}
        vocab={vocab}
        topicId={topic.id}
      />
    </div>
  )
}
