import { useEffect, useState } from 'react'
import { checkSession, signOut, type AuthState } from './auth'
import { AuthScreen } from './components/AuthScreen'
import { ReadingView } from './components/ReadingView'
import { VocabView } from './components/VocabView'
import { WritingView } from './components/WritingView'
import { TOPICS } from './data/passages'
import { useVocab, type SyncStatus } from './storage'
import type { Skill, Topic } from './types'

type Screen =
  | { name: 'home' }
  | { name: 'practice'; topic: Topic; skill: Skill; key: number }
  | { name: 'vocab' }

export default function App() {
  const [auth, setAuth] = useState<AuthState>({ kind: 'checking' })
  const user = auth.kind === 'signed-in' ? auth.user : null
  const vocab = useVocab(user)
  const [screen, setScreen] = useState<Screen>({ name: 'home' })
  const [topic, setTopic] = useState<Topic | null>(null)

  useEffect(() => {
    checkSession().then(setAuth)
  }, [])

  const logout = async () => {
    await signOut()
    vocab.clearLocal()
    setScreen({ name: 'home' })
    setAuth({ kind: 'signed-out' })
  }

  if (auth.kind === 'checking') return <div className="app" />
  if (auth.kind === 'signed-out') {
    return (
      <div className="app">
        <AuthScreen
          onSignedIn={(u) => setAuth({ kind: 'signed-in', user: u })}
          onGuest={() => setAuth({ kind: 'guest' })}
        />
      </div>
    )
  }

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
          <SyncBadge status={vocab.status} user={user} />
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
          {user && (
            <>
              <span className="user-chip">👤 {user}</span>
              <button onClick={logout}>Đăng xuất</button>
            </>
          )}
          {auth.kind === 'guest' && (
            <button onClick={() => setAuth({ kind: 'signed-out' })}>Đăng nhập</button>
          )}
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

function SyncBadge({ status, user }: { status: SyncStatus; user: string | null }) {
  const label = {
    loading: ['⏳', 'Đang kết nối...'],
    synced: ['☁️', 'Đã đồng bộ'],
    local: ['💾', 'Chỉ lưu trên máy này'],
    error: ['⚠️', 'Lỗi đồng bộ, thay đổi sẽ gửi lại lần sau'],
  }[status]
  return (
    <span className={`sync ${status}`} title={user ? `${label[1]} (${user})` : label[1]}>
      {label[0]} <span className="sync-text">{label[1]}</span>
    </span>
  )
}
