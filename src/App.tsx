import { useState } from 'react'
import { ReadingView } from './components/ReadingView'
import { VocabView } from './components/VocabView'
import { WritingView } from './components/WritingView'
import { TOPICS } from './data/passages'
import { useVocab } from './storage'
import type { Skill, Topic } from './types'

type Screen =
  | { name: 'home' }
  | { name: 'practice'; topic: Topic; skill: Skill; key: number }
  | { name: 'vocab' }

export default function App() {
  const vocab = useVocab()
  const [screen, setScreen] = useState<Screen>({ name: 'home' })
  const [topic, setTopic] = useState<Topic | null>(null)

  const start = (skill: Skill) => {
    if (topic) setScreen({ name: 'practice', topic, skill, key: Date.now() })
  }

  return (
    <div className="app">
      <header className="topbar">
        <button className="brand" onClick={() => setScreen({ name: 'home' })}>
          ✨ English Fun
        </button>
        <nav className="row">
          <button
            className={screen.name === 'home' ? 'active' : ''}
            onClick={() => setScreen({ name: 'home' })}
          >
            Luyện tập
          </button>
          <button
            className={screen.name === 'vocab' ? 'active' : ''}
            onClick={() => setScreen({ name: 'vocab' })}
          >
            Kho từ ({vocab.words.length})
          </button>
        </nav>
      </header>

      <main>
        {screen.name === 'home' && (
          <section className="main home">
            <h1>Hôm nay bạn muốn luyện gì?</h1>
            <h3>1. Chọn chủ đề</h3>
            <div className="grid">
              {TOPICS.map((t) => (
                <button
                  key={t.id}
                  className={`topic ${topic?.id === t.id ? 'selected' : ''}`}
                  onClick={() => setTopic(t)}
                >
                  <span className="huge">{t.emoji}</span>
                  {t.name}
                </button>
              ))}
            </div>
            <h3>2. Chọn kỹ năng</h3>
            <div className="grid two">
              <button className="skill" disabled={!topic} onClick={() => start('reading')}>
                <span className="huge">📖</span>
                <b>Đọc</b>
                <span className="muted">Đọc một đoạn văn ngẫu nhiên, lưu từ mới vào kho</span>
              </button>
              <button className="skill" disabled={!topic} onClick={() => start('writing')}>
                <span className="huge">✍️</span>
                <b>Viết</b>
                <span className="muted">Dịch sang tiếng Anh, luyện dùng từ trong kho</span>
              </button>
            </div>
            {!topic && <p className="hint">Hãy chọn một chủ đề trước.</p>}
          </section>
        )}

        {screen.name === 'practice' &&
          (screen.skill === 'reading' ? (
            <ReadingView key={screen.key} topic={screen.topic} vocab={vocab} />
          ) : (
            <WritingView key={screen.key} topic={screen.topic} vocab={vocab} />
          ))}

        {screen.name === 'vocab' && <VocabView vocab={vocab} />}
      </main>
    </div>
  )
}
