import { useCallback, useEffect, useState } from 'react'
import { AiUnavailable, generatePassage } from '../ai'
import { randomPassage } from '../data/passages'
import { speak } from '../dictionary'
import type { VocabStore } from '../storage'
import type { Passage, PracticeSettings, Topic } from '../types'
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
  const [passage, setPassage] = useState<Passage | null>(() =>
    settings.aiEnabled ? null : builtin(topic.id),
  )
  const [notice, setNotice] = useState('')
  const [translating, setTranslating] = useState(false)
  const [translation, setTranslation] = useState('')
  const [showRef, setShowRef] = useState(false)
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
    [settings.aiEnabled, settings.level, topic],
  )

  // Generate the first passage when the screen opens.
  useEffect(() => {
    if (!settings.aiEnabled) return
    let cancelled = false
    generatePassage(topic, 'reading', settings.level)
      .then((p) => !cancelled && setPassage(p))
      .catch((err) => {
        if (cancelled) return
        setNotice(err instanceof AiUnavailable ? err.message : 'AI gặp lỗi, đang dùng bài có sẵn.')
        setPassage(builtin(topic.id))
      })
    return () => {
      cancelled = true
    }
  }, [settings.aiEnabled, settings.level, topic])

  if (!passage) {
    return (
      <section className="main loading-box">
        <div className="spinner" />
        <p>
          ✨ Đang tạo đoạn văn mới về <b>{topic.name}</b> (trình độ {settings.level})...
        </p>
      </section>
    )
  }

  return (
    <div className="split">
      <section className="main">
        <div className="row space">
          <h2>
            {topic.emoji} {passage.title}
          </h2>
          <div className="row">
            <button onClick={() => speak(passage.en)} title="Nghe cả đoạn">
              🔊 Nghe
            </button>
            <button onClick={() => load(passage.id)}>🎲 Đoạn khác</button>
          </div>
        </div>
        <p className="hint">
          <SourceTag passage={passage} /> Từ <span className="word known">gạch chân xanh</span> đã
          có trong kho của bạn.
        </p>
        {notice && <p className="notice">{notice}</p>}

        <PassageText text={passage.en} isKnown={vocab.has} onPick={addPending} />

        <div className="row">
          <label className="toggle">
            <input
              type="checkbox"
              checked={translating}
              onChange={(e) => setTranslating(e.target.checked)}
            />
            Tôi muốn viết bản dịch
          </label>
          <button onClick={() => setShowRef((v) => !v)}>
            {showRef ? 'Ẩn bản dịch tham khảo' : 'Xem bản dịch tham khảo'}
          </button>
        </div>

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
            <strong>Bản dịch tham khảo</strong>
            <p>{passage.vi}</p>
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

export function SourceTag({ passage }: { passage: Passage }) {
  return passage.source === 'ai' ? (
    <span className="tag ai">✨ AI tạo</span>
  ) : (
    <span className="tag">📚 Bài có sẵn</span>
  )
}
