import { useState } from 'react'
import { randomPassage } from '../data/passages'
import { speak } from '../dictionary'
import type { VocabStore } from '../storage'
import type { Topic } from '../types'
import { PassageText } from './PassageText'
import { usePendingWords } from './usePendingWords'
import { WordPanel } from './WordPanel'

interface Props {
  topic: Topic
  vocab: VocabStore
}

export function ReadingView({ topic, vocab }: Props) {
  const [passage, setPassage] = useState(() => randomPassage(topic.id))
  const [translating, setTranslating] = useState(false)
  const [translation, setTranslation] = useState('')
  const [showRef, setShowRef] = useState(false)
  const { pending, setPending, addPending } = usePendingWords()

  const next = () => {
    setPassage(randomPassage(topic.id, passage.id))
    setTranslation('')
    setShowRef(false)
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
            <button onClick={next}>🎲 Đoạn khác</button>
          </div>
        </div>
        <p className="hint">
          Từ <span className="word known">gạch chân xanh</span> đã có trong kho của bạn.
        </p>

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
