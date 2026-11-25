import { useCallback, useEffect, useState } from 'react'
import { AiUnavailable, generatePassage, gradeTranslation, type Feedback } from '../ai'
import { buildExercise, containsWord, overlapScore, pickTargets, type WritingExercise } from '../exercise'
import type { VocabStore } from '../storage'
import type { PracticeSettings, Topic, VocabWord } from '../types'
import { PassageText } from './PassageText'
import { SourceTag } from './ReadingView'
import { usePendingWords } from './usePendingWords'
import { WordPanel } from './WordPanel'

interface Props {
  topic: Topic
  vocab: VocabStore
  settings: PracticeSettings
}

const errorText = (err: unknown) =>
  err instanceof AiUnavailable ? err.message : 'AI gặp lỗi, đang dùng bài có sẵn.'

/** Asks the AI for a passage built around the learner's words; falls back to built-in passages. */
async function makeExercise(
  topic: Topic,
  bank: VocabWord[],
  settings: PracticeSettings,
  excludeId?: string,
): Promise<{ exercise: WritingExercise; notice: string }> {
  if (!settings.aiEnabled) return { exercise: buildExercise(topic.id, bank, excludeId), notice: '' }
  const targets = pickTargets(bank, topic.id)
  try {
    const passage = await generatePassage(topic, 'writing', settings.level, targets)
    return { exercise: { passage, targets }, notice: '' }
  } catch (err) {
    return { exercise: buildExercise(topic.id, bank, excludeId), notice: errorText(err) }
  }
}

export function WritingView({ topic, vocab, settings }: Props) {
  const [exercise, setExercise] = useState<WritingExercise | null>(null)
  const [notice, setNotice] = useState('')
  const [translation, setTranslation] = useState('')
  const [ownSentences, setOwnSentences] = useState('')
  const [checked, setChecked] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [grading, setGrading] = useState(false)
  const [gradeError, setGradeError] = useState('')
  const { pending, setPending, addPending } = usePendingWords()

  const show = useCallback((r: { exercise: WritingExercise; notice: string }) => {
    setExercise(r.exercise)
    setNotice(r.notice)
  }, [])

  // Build the first exercise when the screen opens. The bank is read once on purpose:
  // saving new words while writing must not replace the exercise.
  const [initialBank] = useState(vocab.words)
  useEffect(() => {
    let cancelled = false
    makeExercise(topic, initialBank, settings).then((r) => !cancelled && show(r))
    return () => {
      cancelled = true
    }
  }, [topic, initialBank, settings, show])

  const next = async () => {
    const excludeId = exercise?.passage.id
    setExercise(null)
    setTranslation('')
    setOwnSentences('')
    setChecked(false)
    setFeedback(null)
    setGradeError('')
    show(await makeExercise(topic, vocab.words, settings, excludeId))
  }

  if (!exercise) {
    return (
      <section className="main loading-box">
        <div className="spinner" />
        <p>
          ✨ Đang soạn bài viết về <b>{topic.name}</b>
          {vocab.words.length > 0 && ', lồng các từ trong kho của bạn'}...
        </p>
      </section>
    )
  }

  const { passage, targets } = exercise
  const allText = `${translation}\n${ownSentences}`
  const usedWords = targets.filter((t) => containsWord(allText, t.word)).map((t) => t.word)

  const check = async () => {
    setChecked(true)
    if (usedWords.length) vocab.markPracticed(usedWords)
    if (!settings.aiEnabled) return
    setGrading(true)
    setGradeError('')
    try {
      const answer = ownSentences.trim() ? `${translation}\n\n${ownSentences}` : translation
      setFeedback(await gradeTranslation(passage, answer, targets))
    } catch (err) {
      setGradeError(err instanceof AiUnavailable ? err.message.replace(', đang dùng bài có sẵn', '') : 'AI chưa chấm được bài, hãy thử lại.')
    } finally {
      setGrading(false)
    }
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
        <p className="hint">
          <SourceTag passage={passage} />
        </p>
        {notice && <p className="notice">{notice}</p>}

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
          <button className="primary" onClick={check} disabled={!translation.trim() || grading}>
            {grading ? 'AI đang chấm...' : settings.aiEnabled ? '✅ Nộp bài và chấm' : '✅ Kiểm tra'}
          </button>
          {targets.length > 0 && (
            <span className="muted">
              Đã dùng {usedWords.length}/{targets.length} từ
            </span>
          )}
        </div>

        {checked && (
          <div className="result">
            {grading && (
              <div className="row">
                <div className="spinner small" /> <span>AI đang đọc bài của bạn...</span>
              </div>
            )}
            {gradeError && <p className="notice">{gradeError}</p>}
            {feedback ? (
              <FeedbackView feedback={feedback} />
            ) : (
              !grading && (
                <p>
                  Độ trùng khớp với bản gốc: <b>{overlapScore(translation, passage.en)}%</b>
                  <span className="muted"> (chỉ là con số tham khảo, cách diễn đạt khác vẫn có thể đúng)</span>
                </p>
              )
            )}
            {targets.length > 0 && !feedback && (
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

function FeedbackView({ feedback }: { feedback: Feedback }) {
  return (
    <div className="feedback">
      <div className="row">
        <span className={`score s${Math.round(feedback.score / 3.4)}`}>{feedback.score}/10</span>
        <p>{feedback.summary}</p>
      </div>
      {feedback.corrections.length > 0 && (
        <>
          <strong>Cần sửa</strong>
          <ul className="corrections">
            {feedback.corrections.map((c, i) => (
              <li key={i}>
                <span className="wrong">{c.original}</span> → <span className="right">{c.suggestion}</span>
                <div className="muted small">{c.explanation}</div>
              </li>
            ))}
          </ul>
        </>
      )}
      {feedback.wordNotes.length > 0 && (
        <>
          <strong>Từ cần luyện</strong>
          <ul className="corrections">
            {feedback.wordNotes.map((n) => (
              <li key={n.word}>
                {n.used ? '✅' : '⬜'} <b>{n.word}</b>: <span className="small">{n.note}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      {feedback.improved && (
        <div className="reference">
          <strong>Bài của bạn sau khi sửa</strong>
          <p>{feedback.improved}</p>
        </div>
      )}
    </div>
  )
}
