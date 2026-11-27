import { useEffect, useMemo, useRef, useState } from 'react'
import { checkSession, saveLanguage, signOut, type AuthState } from './auth'
import { ArrowRight, BookOpen, Library, LogIn, LogOut, PenLine } from 'lucide-react'
import { AuthScreen } from './components/AuthScreen'
import { LanguagePicker, LanguageSelect } from './components/LanguagePicker'
import { LogoMark, TopicIcon } from './components/icons'
import { ReadingView } from './components/ReadingView'
import { ShareButton } from './components/ShareButton'
import { VocabView } from './components/VocabView'
import { WritingView } from './components/WritingView'
import { TOPICS } from './data/passages'
import { toneClass } from './topicIcons'
import { useI18n, type LangCode } from './i18n'
import { clearDrafts, useDraft } from './persist'
import { useVocab, type SyncStatus } from './storage'
import type { Level, PracticeSettings, Skill, Topic } from './types'

const LEVEL_KEY = 'english-fun:level'
const LEVELS: Level[] = ['A2', 'B1', 'B2', 'C1']

function readLevel(): Level {
  try {
    const v = localStorage.getItem(LEVEL_KEY)
    if (LEVELS.includes(v as Level)) return v as Level
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
  const { lang, t, setLang } = useI18n()
  const [auth, setAuth] = useState<AuthState>({ kind: 'checking' })
  const user = auth.kind === 'signed-in' ? auth.user : null
  const vocab = useVocab(user)
  const [session, setSession] = useDraft<Session | null>('session', null)
  const [screen, setScreen] = useState<Screen>(() => ({ name: session ? 'practice' : 'home' }))
  const [topic, setTopic] = useState<Topic | null>(null)
  const [level, setLevel] = useState<Level>(readLevel)
  const settings = useMemo<PracticeSettings>(
    () => ({ aiEnabled: !!user, level, lang: lang ?? 'vi' }),
    [user, level, lang],
  )

  /**
   * After signing in, the language saved on the account wins. Accounts from before the app
   * had other languages have none saved: they keep Vietnamese (or the language chosen here).
   */
  const signedIn = (u: string, accountLang: LangCode | null) => {
    if (accountLang) {
      if (accountLang !== lang) setLang(accountLang)
    } else {
      const l = lang ?? 'vi'
      if (!lang) setLang(l)
      saveLanguage(l)
    }
    setAuth({ kind: 'signed-in', user: u, lang: accountLang })
  }

  /** A new language restarts the exercise, since its translation is in the old language. */
  const changeLanguage = (l: LangCode) => {
    if (user) saveLanguage(l)
    if (session) {
      clearDrafts()
      setSession(null)
      setScreen((s) => (s.name === 'practice' ? { name: 'home' } : s))
    }
  }

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
    checkSession().then((a) => {
      if (a.kind === 'signed-in') signedIn(a.user, a.lang)
      else setAuth(a.kind === 'signed-out' && entry.current?.guest ? { kind: 'guest' } : a)
    })
    // Runs once on start; signedIn only reads the language chosen so far.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  if (!lang) {
    return (
      <div className="app auth-wrap">
        <LanguagePicker />
      </div>
    )
  }
  if (auth.kind === 'signed-out') {
    return (
      <div className="app auth-wrap">
        <AuthScreen onSignedIn={signedIn} onGuest={() => setAuth({ kind: 'guest' })} />
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
              {t.nav.practice}
            </button>
            {session && (
              <button
                className={`tab ${screen.name === 'practice' ? 'active' : ''}`}
                onClick={() => setScreen({ name: 'practice' })}
              >
                {session.skill === 'reading' ? <BookOpen size={15} /> : <PenLine size={15} />}
                {t.nav.current}
              </button>
            )}
            <button
              className={`tab ${screen.name === 'vocab' ? 'active' : ''}`}
              onClick={() => setScreen({ name: 'vocab' })}
            >
              {t.nav.vocab} <span className="count">{vocab.words.length}</span>
            </button>
          </nav>
          <div className="topbar-right">
            <LanguageSelect onChange={changeLanguage} />
            <ShareButton />
            <SyncBadge status={vocab.status} user={user} />
            {user && (
              <div className="user-menu">
                <span className="avatar" title={user}>
                  {user.slice(0, 1)}
                </span>
                <span className="user-name">{user}</span>
                <button className="icon" onClick={logout} title={t.nav.signOut} aria-label={t.nav.signOut}>
                  <LogOut size={16} />
                </button>
              </div>
            )}
            {auth.kind === 'guest' && (
              <button className="small" onClick={() => setAuth({ kind: 'signed-out' })}>
                <LogIn size={15} /> {t.nav.signIn}
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
                <h1>{user ? t.home.greeting(user) : t.home.title}</h1>
                <p>{vocab.words.length > 0 ? t.home.bankSummary(vocab.words.length, toReview) : t.home.empty}</p>
              </div>
              {toReview > 0 && (
                <button onClick={() => setScreen({ name: 'vocab' })}>
                  <Library size={16} /> {t.home.reviewButton(toReview)}
                </button>
              )}
            </div>

            <div className="section">
              <div className="eyebrow">{t.home.topic}</div>
              <div className="topic-grid">
                {TOPICS.map((tp) => (
                  <button
                    key={tp.id}
                    className={`topic-card ${toneClass(tp.id)} ${topic?.id === tp.id ? 'selected' : ''}`}
                    onClick={() => setTopic(tp)}
                    aria-pressed={topic?.id === tp.id}
                  >
                    <span className="topic-icon">
                      <TopicIcon id={tp.id} />
                    </span>
                    {t.topics[tp.id] ?? tp.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="section">
              <div className="eyebrow">{t.home.level}</div>
              <div className="segmented" role="radiogroup">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    className={level === l ? 'active' : ''}
                    onClick={() => chooseLevel(l)}
                    role="radio"
                    aria-checked={level === l}
                  >
                    {l} <span className="sub">{t.levels[l]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="section">
              <div className="eyebrow">{t.home.skill}</div>
              <div className="skill-grid">
                <button className="skill-card" disabled={!topic} onClick={() => start('reading')}>
                  <span className="skill-icon">
                    <BookOpen size={22} />
                  </span>
                  <span className="skill-body">
                    <span className="skill-title">{t.home.readingTitle}</span>
                    <span className="skill-desc">{t.home.readingText}</span>
                  </span>
                  <ArrowRight size={18} className="go" />
                </button>
                <button className="skill-card" disabled={!topic} onClick={() => start('writing')}>
                  <span className="skill-icon">
                    <PenLine size={22} />
                  </span>
                  <span className="skill-body">
                    <span className="skill-title">{t.home.writingTitle}</span>
                    <span className="skill-desc">{t.home.writingText}</span>
                  </span>
                  <ArrowRight size={18} className="go" />
                </button>
              </div>
              {!topic && <p className="hint" style={{ marginTop: 10 }}>{t.home.pickTopic}</p>}
              {!user && (
                <div className="callout info" style={{ marginTop: 14 }}>
                  {t.home.signInForAi}
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
  const { t } = useI18n()
  const label = t.sync[status]
  return (
    <span className={`sync ${status}`} title={user ? `${label} (${user})` : label}>
      <span className="dot" />
      <span className="sync-text">{label}</span>
    </span>
  )
}
