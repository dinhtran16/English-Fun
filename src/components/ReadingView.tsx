import { Eye, EyeOff, Loader2, RefreshCw, Sparkles, Volume2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AiUnavailable, generatePassage } from '../ai'
import { randomPassage } from '../data/passages'
import { useDraft } from '../persist'
import { speak } from '../dictionary'
import type { VocabStore } from '../storage'
import type { Passage, PracticeSettings, Topic } from '../types'
import { TopicIcon } from './icons'
import { PassageText } from './PassageText'
import { usePendingWords } from './usePendingWords'
import { WordPanel } from './WordPanel'

interface Props {
  topic: Topic
  vocab: VocabStore
  settings: PracticeSettings
}

const builtin = (topicId: string, excludeId?: string): Passage => ({
  ...randomPassage(topicId, excludeId),
  source: 'builtin',
})

export function ReadingView({ topic, vocab, settings }: Props) {
  const [passage, setPassage] = useDraft<Passage | null>('reading:passage', () =>
    settings.aiEnabled ? null : builtin(topic.id),
  )
  const [notice, setNotice] = useState('')
  const [translating, setTranslating] = useDraft('reading:translating', false)
  const [translation, setTranslation] = useDraft('reading:translation', '')
  const [showRef, setShowRef] = useDraft('reading:showRef', false)
  const started = useRef(passage !== null)
  const { pending, setPending, addPending } = usePendingWords()

  const load = useCallback(
    async (excludeId?: string) => {
      setTranslation('')
      setShowRef(false)
      setNotice('')
      if (!settings.aiEnabled) {
        setPassage(builtin(topic.id, excludeId))
        return
      }
      setPassage(null)
      try {
        setPassage(await generatePassage(topic, 'reading', settings.level))
      } catch (err) {
        setNotice(err instanceof AiUnavailable ? err.message : 'AI gặp lỗi, đang dùng bài có sẵn.')
        setPassage(builtin(topic.id, excludeId))
      }
    },
    [settings.aiEnabled, settings.level, topic, setPassage, setShowRef, setTranslation],
  )

  // Generate the first passage once, unless one was restored from a draft.
  useEffect(() => {
    if (started.current) return
    started.current = true
    generatePassage(topic, 'reading', settings.level)
      .then(setPassage)
      .catch((err) => {
        setNotice(err instanceof AiUnavailable ? err.message : 'AI gặp lỗi, đang dùng bài có sẵn.')
        setPassage(builtin(topic.id))
      })
  }, [settings.level, topic, setPassage])

  if (!passage) {
    return (
      <LoadingPassage text={`Đang tạo đoạn văn mới về ${topic.name.toLowerCase()} · trình độ ${settings.level}`} />
    )
  }

  return (
    <div className="split">
      <section className="main">
        <div className="practice-head">
          <div>
            <div className="meta">
              <TopicIcon id={topic.id} size={15} /> {topic.name} · Đọc hiểu
              <SourceTag passage={passage} />
            </div>
            <h1>{passage.title}</h1>
          </div>
          <div className="row">
            <button onClick={() => speak(passage.en)} title="Nghe cả đoạn">
              <Volume2 size={16} /> Nghe
            </button>
            <button onClick={() => load(passage.id)}>
              <RefreshCw size={16} /> Đoạn khác
            </button>
          </div>
        </div>
        {notice && <div className="callout warn">{notice}</div>}

        <div className="card">
          <PassageText text={passage.en} isKnown={vocab.has} onPick={addPending} />
        </div>
        <div className="legend">
          <span>
            <span className="sw" />
            Đã có trong kho
          </span>
          <span>Bấm hoặc kéo một từ sang bảng bên phải để tra nghĩa</span>
        </div>

        <div className="toolbar">
          <label className="toggle">
            <input
              type="checkbox"
              checked={translating}
              onChange={(e) => setTranslating(e.target.checked)}
            />
            Viết bản dịch của tôi
          </label>
          <button onClick={() => setShowRef((v) => !v)}>
            {showRef ? <EyeOff size={16} /> : <Eye size={16} />}
            {showRef ? 'Ẩn bản dịch' : 'Xem bản dịch'}
          </button>
        </div>

        <div className="stack">
          {translating && (
            <textarea
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="Viết bản dịch tiếng Việt của bạn..."
              rows={6}
            />
          )}
          {showRef && (
            <div className="reference">
              <div className="eyebrow">Bản dịch tham khảo</div>
              <p>{passage.vi}</p>
            </div>
          )}
        </div>
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

export function SourceTag({ passage }: { passage: Passage }) {
  return passage.source === 'ai' ? (
    <span className="badge ai">
      <Sparkles size={12} /> AI tạo
    </span>
  ) : (
    <span className="badge">Bài có sẵn</span>
  )
}

export function LoadingPassage({ text }: { text: string }) {
  return (
    <section className="main loading-box">
      <Loader2 size={28} className="spin" />
      <p>{text}...</p>
      <div className="skeleton" aria-hidden>
        <div style={{ width: '92%' }} />
        <div style={{ width: '100%' }} />
        <div style={{ width: '85%' }} />
        <div style={{ width: '60%' }} />
      </div>
    </section>
  )
}
