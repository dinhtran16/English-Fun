import { useEffect, useMemo, useRef, useState } from 'react'
import { checkSession, signOut, type AuthState } from './auth'
import { ArrowRight, BookOpen, Library, LogIn, LogOut, PenLine } from 'lucide-react'
import { AuthScreen } from './components/AuthScreen'
import { LogoMark, TopicIcon } from './components/icons'
import { ReadingView } from './components/ReadingView'
import { VocabView } from './components/VocabView'
import { WritingView } from './components/WritingView'
import { TOPICS } from './data/passages'
import { clearDrafts, useDraft } from './persist'
import { useVocab, type SyncStatus } from './storage'
import type { Level, PracticeSettings, Skill, Topic } from './types'

const LEVEL_KEY = 'english-fun:level'
const LEVELS: { id: Level; label: string }[] = [
  { id: 'A2', label: 'Sơ cấp' },
  { id: 'B1', label: 'Trung cấp' },
  { id: 'B2', label: 'Trung cao' },
  { id: 'C1', label: 'Nâng cao' },
]

function readLevel(): Level {
  try {
    const v = localStorage.getItem(LEVEL_KEY)
    if (LEVELS.some((l) => l.id === v)) return v as Level
  } catch {
    // ignore
  }
  return 'B1'
}

/**
 * Links from the public pages open the app with a preset, e.g. /app/?guest=1&topic=travel&skill=reading.
 * guest=1 skips the sign-in screen (guests only use built-in content, so no AI cost).
 */
interface EntryLink {
  guest: boolean
  topic: Topic | null
  skill: Skill | null
}

function readEntryLink(): EntryLink {
  const q = new URLSearchParams(window.location.search)
  const skill = q.get('skill')
  const link: EntryLink = {
    guest: q.get('guest') === '1',
    topic: TOPICS.find((t) => t.id === q.get('topic')) ?? null,
    skill: skill === 'reading' || skill === 'writing' ? skill : null,
  }
  if (window.location.search) window.history.replaceState(null, '', window.location.pathname)
  return link
}

type Screen = { name: 'home' } | { name: 'practice' } | { name: 'vocab' }

/** The exercise in progress. It stays mounted while the learner visits other screens. */
interface Session {
  topic: Topic
  skill: Skill
  key: number
}

export default function App() {
  const [auth, setAuth] = useState<AuthState>({ kind: 'checking' })
  const user = auth.kind === 'signed-in' ? auth.user : null
  const vocab = useVocab(user)
  const [session, setSession] = useDraft<Session | null>('session', null)
  const [screen, setScreen] = useState<Screen>(() => ({ name: session ? 'practice' : 'home' }))
  const [topic, setTopic] = useState<Topic | null>(null)
  const [level, setLevel] = useState<Level>(readLevel)
  const settings = useMemo<PracticeSettings>(() => ({ aiEnabled: !!user, level }), [user, level])

  const chooseLevel = (l: Level) => {
    setLevel(l)
    try {
      localStorage.setItem(LEVEL_KEY, l)
    } catch {
      // ignore
    }
  }

  const entry = useRef<EntryLink | null>(null)
  if (entry.current === null) entry.current = readEntryLink()

  useEffect(() => {
    checkSession().then((a) => setAuth(a.kind === 'signed-out' && entry.current?.guest ? { kind: 'guest' } : a))
  }, [])

  // Apply the topic and skill from the link once the app is ready.
  useEffect(() => {
    const link = entry.current
    if (!link?.topic || (auth.kind !== 'guest' && auth.kind !== 'signed-in')) return
    entry.current = { guest: false, topic: null, skill: null }
    setTopic(link.topic)
    if (link.skill) {
      clearDrafts()
      setSession({ topic: link.topic, skill: link.skill, key: Date.now() })
      setScreen({ name: 'practice' })
    }
  }, [auth.kind, setSession])

  const logout = async () => {
    await signOut()
    vocab.clearLocal()
    setScreen({ name: 'home' })
    setSession(null)
    clearDrafts()
    setAuth({ kind: 'signed-out' })
  }

  if (auth.kind === 'checking') return <div className="app" />
  if (auth.kind === 'signed-out') {
    return (
      <div className="app auth-wrap">
        <AuthScreen
          onSignedIn={(u) => setAuth({ kind: 'signed-in', user: u })}
          onGuest={() => setAuth({ kind: 'guest' })}
        />
      </div>
    )
  }

  const start = (skill: Skill) => {
    if (!topic) return
    clearDrafts()
    setSession({ topic, skill, key: Date.now() })
    setScreen({ name: 'practice' })
  }

  const toReview = vocab.words.filter((w) => !w.reviewCount || w.lastResult === 'wrong').length

  return (
    <div className="app">
      <header className="topbar">
        <div className="container topbar-inner">
          <button className="brand" onClick={() => setScreen({ name: 'home' })}>
            <LogoMark />
            <span className="brand-name">English Fun</span>
          </button>
          <nav className="tabs">
            <button
              className={`tab ${screen.name === 'home' ? 'active' : ''}`}
              onClick={() => setScreen({ name: 'home' })}
            >
              Luyện tập
            </button>
            {session && (
              <button
                className={`tab ${screen.name === 'practice' ? 'active' : ''}`}
                onClick={() => setScreen({ name: 'practice' })}
              >
                {session.skill === 'reading' ? <BookOpen size={15} /> : <PenLine size={15} />}
                Bài đang làm
              </button>
            )}
            <button
              className={`tab ${screen.name === 'vocab' ? 'active' : ''}`}
              onClick={() => setScreen({ name: 'vocab' })}
            >
              Kho từ <span className="count">{vocab.words.length}</span>
            </button>
          </nav>
          <div className="topbar-right">
            <SyncBadge status={vocab.status} user={user} />
            {user && (
              <div className="user-menu">
                <span className="avatar" title={user}>
                  {user.slice(0, 1)}
                </span>
                <span className="user-name">{user}</span>
                <button className="icon" onClick={logout} title="Đăng xuất" aria-label="Đăng xuất">
                  <LogOut size={16} />
                </button>
              </div>
            )}
            {auth.kind === 'guest' && (
              <button className="small" onClick={() => setAuth({ kind: 'signed-out' })}>
                <LogIn size={15} /> Đăng nhập
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container">
        {screen.name === 'home' && (
          <section className="main home">
            <div className="page-head">
              <div>
                <h1>{user ? `Chào ${user}, hôm nay luyện gì?` : 'Hôm nay bạn muốn luyện gì?'}</h1>
                <p>
                  {vocab.words.length > 0
                    ? `Kho từ có ${vocab.words.length} từ${toReview ? `, ${toReview} từ đang chờ ôn` : ''}.`
                    : 'Chọn chủ đề và kỹ năng để bắt đầu. Từ mới bạn lưu sẽ vào kho từ.'}
                </p>
              </div>
              {toReview > 0 && (
                <button onClick={() => setScreen({ name: 'vocab' })}>
                  <Library size={16} /> Ôn {toReview} từ
                </button>
              )}
            </div>

            <div className="section">
              <div className="eyebrow">Chủ đề</div>
              <div className="topic-grid">
                {TOPICS.map((t) => (
                  <button
                    key={t.id}
                    className={`topic-card ${topic?.id === t.id ? 'selected' : ''}`}
                    onClick={() => setTopic(t)}
                    aria-pressed={topic?.id === t.id}
                  >
                    <span className="topic-icon">
                      <TopicIcon id={t.id} />
                    </span>
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="section">
              <div className="eyebrow">Trình độ</div>
              <div className="segmented" role="radiogroup">
                {LEVELS.map((l) => (
                  <button
                    key={l.id}
                    className={level === l.id ? 'active' : ''}
                    onClick={() => chooseLevel(l.id)}
                    role="radio"
                    aria-checked={level === l.id}
                  >
                    {l.id} <span className="sub">{l.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="section">
              <div className="eyebrow">Kỹ năng</div>
              <div className="skill-grid">
                <button className="skill-card" disabled={!topic} onClick={() => start('reading')}>
                  <span className="skill-icon">
                    <BookOpen size={22} />
                  </span>
                  <span className="skill-body">
                    <span className="skill-title">Đọc hiểu</span>
                    <span className="skill-desc">Đọc một đoạn văn mới, lưu từ chưa biết vào kho</span>
                  </span>
                  <ArrowRight size={18} className="go" />
                </button>
                <button className="skill-card" disabled={!topic} onClick={() => start('writing')}>
                  <span className="skill-icon">
                    <PenLine size={22} />
                  </span>
                  <span className="skill-body">
                    <span className="skill-title">Viết và dịch</span>
                    <span className="skill-desc">Dịch sang tiếng Anh, luyện dùng từ trong kho</span>
                  </span>
                  <ArrowRight size={18} className="go" />
                </button>
              </div>
              {!topic && <p className="hint" style={{ marginTop: 10 }}>Chọn một chủ đề để bắt đầu.</p>}
              {!user && (
                <div className="callout info" style={{ marginTop: 14 }}>
                  Đăng nhập để AI tạo đoạn văn mới theo trình độ và chấm bài viết. Khi chưa đăng nhập, app dùng
                  các bài có sẵn.
                </div>
              )}
            </div>
          </section>
        )}

        {session && (
          <div hidden={screen.name !== 'practice'}>
            {session.skill === 'reading' ? (
              <ReadingView key={session.key} topic={session.topic} vocab={vocab} settings={settings} />
            ) : (
              <WritingView key={session.key} topic={session.topic} vocab={vocab} settings={settings} />
            )}
          </div>
        )}

        {screen.name === 'vocab' && <VocabView vocab={vocab} />}
      </main>
    </div>
  )
}

function SyncBadge({ status, user }: { status: SyncStatus; user: string | null }) {
  const label = {
    loading: 'Đang kết nối...',
    synced: 'Đã đồng bộ',
    local: 'Lưu trên máy này',
    error: 'Lỗi đồng bộ, sẽ thử lại',
  }[status]
  return (
    <span className={`sync ${status}`} title={user ? `${label} (${user})` : label}>
      <span className="dot" />
      <span className="sync-text">{label}</span>
    </span>
  )
}
