import { Check, Loader2, RefreshCw, Send } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AiUnavailable, generatePassage, gradeTranslation, type Feedback } from '../ai'
import { buildExercise, containsWord, overlapScore, pickTargets, type WritingExercise } from '../exercise'
import { useDraft } from '../persist'
import type { VocabStore } from '../storage'
import type { PracticeSettings, Topic, VocabWord } from '../types'
import { PassageText } from './PassageText'
import { TopicIcon } from './icons'
import { LoadingPassage, SourceTag } from './ReadingView'
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
  const [exercise, setExercise] = useDraft<WritingExercise | null>('writing:exercise', null)
  const [notice, setNotice] = useState('')
  const [translation, setTranslation] = useDraft('writing:translation', '')
  const [ownSentences, setOwnSentences] = useDraft('writing:own', '')
  const [checked, setChecked] = useDraft('writing:checked', false)
  const [feedback, setFeedback] = useDraft<Feedback | null>('writing:feedback', null)
  const started = useRef(exercise !== null)
  const [grading, setGrading] = useState(false)
  const [gradeError, setGradeError] = useState('')
  const { pending, setPending, addPending } = usePendingWords()

  const show = useCallback(
    (r: { exercise: WritingExercise; notice: string }) => {
      setExercise(r.exercise)
      setNotice(r.notice)
    },
    [setExercise],
  )

  // Build the first exercise once, unless one was restored from a draft. The bank is
  // read once on purpose: saving new words while writing must not replace the exercise.
  const [initialBank] = useState(vocab.words)
  useEffect(() => {
    if (started.current) return
    started.current = true
    makeExercise(topic, initialBank, settings).then(show)
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
      <LoadingPassage
        text={`Đang soạn bài viết về ${topic.name.toLowerCase()}${
          vocab.words.length > 0 ? ', lồng các từ trong kho của bạn' : ''
        }`}
      />
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
        <div className="practice-head">
          <div>
            <div className="meta">
              <TopicIcon id={topic.id} size={15} /> {topic.name} · Viết và dịch
              <SourceTag passage={passage} />
            </div>
            <h1>{passage.title}</h1>
          </div>
          <button onClick={next}>
            <RefreshCw size={16} /> Bài khác
          </button>
        </div>
        {notice && <div className="callout warn">{notice}</div>}

        <div className="card targets">
          <div className="row space">
            <span className="eyebrow" style={{ margin: 0 }}>
              Từ cần dùng
            </span>
            {targets.length > 0 && (
              <span className="small muted">
                Đã dùng {usedWords.length}/{targets.length}
              </span>
            )}
          </div>
          {targets.length === 0 ? (
            <p className="small muted" style={{ marginTop: 6 }}>
              Kho từ đang trống. Luyện Đọc để lưu từ mới, các bài viết sau sẽ lồng chúng vào.
            </p>
          ) : (
            <ul className="chips">
              {targets.map((t) => (
                <li
                  key={t.word}
                  className={`chip ${usedWords.includes(t.word) ? 'used' : ''}`}
                  title={t.definition}
                >
                  {usedWords.includes(t.word) && <Check size={14} />}
                  <b>{t.word}</b> {t.meaning}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="step-title">
          <span className="step-num">1</span>
          <h3>Dịch đoạn văn sang tiếng Anh</h3>
        </div>
        <div className="card source-vi">{passage.vi}</div>
        <textarea
          style={{ marginTop: 12 }}
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          placeholder="Write your English translation here..."
          rows={7}
          spellCheck
        />

        {targets.length > 0 && (
          <>
            <div className="step-title">
              <span className="step-num">2</span>
              <h3>
                Viết thêm 2-3 câu dùng các từ còn thiếu <span className="small muted">(không bắt buộc)</span>
              </h3>
            </div>
            <textarea
              value={ownSentences}
              onChange={(e) => setOwnSentences(e.target.value)}
              placeholder="Your own sentences..."
              rows={3}
              spellCheck
            />
          </>
        )}

        <div className="toolbar">
          <button className="primary lg" onClick={check} disabled={!translation.trim() || grading}>
            {grading ? <Loader2 size={18} className="spin" /> : <Send size={17} />}
            {grading ? 'Đang chấm...' : settings.aiEnabled ? 'Nộp bài và chấm' : 'Kiểm tra'}
          </button>
        </div>

        {checked && (
          <div className="result">
            {gradeError && <div className="callout warn">{gradeError}</div>}
            {feedback ? (
              <FeedbackView feedback={feedback} />
            ) : (
              !grading && (
                <div className="card card-pad stack">
                  <p>
                    Độ trùng khớp với bản gốc: <b>{overlapScore(translation, passage.en)}%</b>{' '}
                    <span className="small muted">
                      (chỉ để tham khảo, cách diễn đạt khác vẫn có thể đúng)
                    </span>
                  </p>
                  {targets.length > 0 && (
                    <p>
                      {usedWords.length === targets.length
                        ? 'Bạn đã dùng đủ tất cả từ cần luyện.'
                        : `Còn thiếu: ${targets
                            .filter((t) => !usedWords.includes(t.word))
                            .map((t) => t.word)
                            .join(', ')}`}
                    </p>
                  )}
                </div>
              )
            )}
            <div>
              <div className="eyebrow">Bản gốc tiếng Anh</div>
              <div className="card">
                <PassageText
                  text={passage.en}
                  isKnown={vocab.has}
                  isTarget={(w) => targets.some((t) => t.word === w)}
                  onPick={addPending}
                />
              </div>
              <p className="hint" style={{ marginTop: 8 }}>
                Bấm hoặc kéo từ mới sang bảng bên phải để lưu vào kho.
              </p>
            </div>
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
  const tone = feedback.score >= 8 ? 's3' : feedback.score < 5 ? 's0' : ''
  return (
    <div className="card feedback">
      <div className="feedback-head">
        <span className={`score ${tone}`}>
          <span>
            {feedback.score}
            <small>/10</small>
          </span>
        </span>
        <p>{feedback.summary}</p>
      </div>
      {feedback.corrections.length > 0 && (
        <div>
          <div className="eyebrow">Cần sửa</div>
          <ul className="corrections">
            {feedback.corrections.map((c, i) => (
              <li key={i}>
                <span className="wrong">{c.original}</span> → <span className="right">{c.suggestion}</span>
                <div className="small muted">{c.explanation}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {feedback.wordNotes.length > 0 && (
        <div>
          <div className="eyebrow">Từ cần luyện</div>
          <ul className="corrections">
            {feedback.wordNotes.map((n) => (
              <li key={n.word}>
                <b>{n.word}</b> <span className={n.used ? 'right small' : 'muted small'}>{n.used ? 'đã dùng' : 'chưa dùng'}</span>
                <div className="small muted">{n.note}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {feedback.improved && (
        <div className="reference">
          <div className="eyebrow">Bài của bạn sau khi sửa</div>
          <p style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem' }}>{feedback.improved}</p>
        </div>
      )}
    </div>
  )
}
