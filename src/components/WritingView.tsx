import { Check, Loader2, RefreshCw, Send } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AiUnavailable, fallbackNotice, generatePassage, gradeTranslation, type Feedback } from '../ai'
import { buildExercise, containsWord, overlapScore, pickTargets, type WritingExercise } from '../exercise'
import { useI18n, useTranslationOf, type Messages } from '../i18n'
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

/** Asks the AI for a passage built around the learner's words; falls back to built-in passages. */
async function makeExercise(
  topic: Topic,
  bank: VocabWord[],
  settings: PracticeSettings,
  t: Messages,
  excludeId?: string,
): Promise<{ exercise: WritingExercise; notice: string }> {
  if (!settings.aiEnabled) return { exercise: buildExercise(topic.id, bank, excludeId), notice: '' }
  const targets = pickTargets(bank, topic.id)
  try {
    const passage = await generatePassage(topic, 'writing', settings.level, settings.lang, targets)
    return { exercise: { passage, targets }, notice: '' }
  } catch (err) {
    return { exercise: buildExercise(topic.id, bank, excludeId), notice: fallbackNotice(t, err) }
  }
}

export function WritingView({ topic, vocab, settings }: Props) {
  const { t } = useI18n()
  const translationOf = useTranslationOf()
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
    makeExercise(topic, initialBank, settings, t).then(show)
  }, [topic, initialBank, settings, t, show])

  const next = async () => {
    const excludeId = exercise?.passage.id
    setExercise(null)
    setTranslation('')
    setOwnSentences('')
    setChecked(false)
    setFeedback(null)
    setGradeError('')
    show(await makeExercise(topic, vocab.words, settings, t, excludeId))
  }

  const topicName = t.topics[topic.id] ?? topic.name
  if (!exercise) {
    return <LoadingPassage text={t.writing.loading(topicName, vocab.words.length > 0)} />
  }

  const { passage, targets } = exercise
  const source = translationOf(passage)
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
      setFeedback(await gradeTranslation(passage, source, answer, targets, settings.lang))
    } catch (err) {
      setGradeError((err instanceof AiUnavailable && t.aiErrors[err.code]) || t.writing.gradeFailed)
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
              <TopicIcon id={topic.id} size={15} tinted /> {topicName} · {t.writing.name}
              <SourceTag passage={passage} />
            </div>
            <h1>{passage.title}</h1>
          </div>
          <button onClick={next}>
            <RefreshCw size={16} /> {t.writing.another}
          </button>
        </div>
        {notice && <div className="callout warn">{notice}</div>}

        <div className="card targets">
          <div className="row space">
            <span className="eyebrow" style={{ margin: 0 }}>
              {t.writing.targets}
            </span>
            {targets.length > 0 && (
              <span className="small muted">{t.writing.usedCount(usedWords.length, targets.length)}</span>
            )}
          </div>
          {targets.length === 0 ? (
            <p className="small muted" style={{ marginTop: 6 }}>
              {t.writing.emptyBank}
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
          <h3>{t.writing.step1}</h3>
        </div>
        <div className="card source-vi">{source}</div>
        <textarea
          style={{ marginTop: 12 }}
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          placeholder={t.writing.answerPlaceholder}
          rows={7}
          spellCheck
        />

        {targets.length > 0 && (
          <>
            <div className="step-title">
              <span className="step-num">2</span>
              <h3>
                {t.writing.step2} <span className="small muted">{t.writing.optional}</span>
              </h3>
            </div>
            <textarea
              value={ownSentences}
              onChange={(e) => setOwnSentences(e.target.value)}
              placeholder={t.writing.ownPlaceholder}
              rows={3}
              spellCheck
            />
          </>
        )}

        <div className="toolbar">
          <button className="primary lg" onClick={check} disabled={!translation.trim() || grading}>
            {grading ? <Loader2 size={18} className="spin" /> : <Send size={17} />}
            {grading ? t.writing.grading : settings.aiEnabled ? t.writing.submitAi : t.writing.submit}
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
                    {t.writing.overlap}: <b>{overlapScore(translation, passage.en)}%</b>{' '}
                    <span className="small muted">{t.writing.overlapNote}</span>
                  </p>
                  {targets.length > 0 && (
                    <p>
                      {usedWords.length === targets.length
                        ? t.writing.allUsed
                        : t.writing.missing(
                            targets
                              .filter((w) => !usedWords.includes(w.word))
                              .map((w) => w.word)
                              .join(', '),
                          )}
                    </p>
                  )}
                </div>
              )
            )}
            <div>
              <div className="eyebrow">{t.writing.original}</div>
              <div className="card">
                <PassageText
                  text={passage.en}
                  isKnown={vocab.has}
                  isTarget={(w) => targets.some((x) => x.word === w)}
                  onPick={addPending}
                />
              </div>
              <p className="hint" style={{ marginTop: 8 }}>
                {t.writing.saveHint}
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
  const { t } = useI18n()
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
          <div className="eyebrow">{t.writing.fixes}</div>
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
          <div className="eyebrow">{t.writing.wordNotes}</div>
          <ul className="corrections">
            {feedback.wordNotes.map((n) => (
              <li key={n.word}>
                <b>{n.word}</b> <span className={n.used ? 'right small' : 'muted small'}>{n.used ? t.writing.used : t.writing.notUsed}</span>
                <div className="small muted">{n.note}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {feedback.improved && (
        <div className="reference">
          <div className="eyebrow">{t.writing.improved}</div>
          <p style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem' }}>{feedback.improved}</p>
        </div>
      )}
    </div>
  )
}
