/**
 * AI features, backed by DeepSeek's chat completions API (JSON output mode).
 *
 *   POST /api/ai/passage  { topicId, topicName, mode: 'reading'|'writing', level, targetWords? }
 *                         -> { passage: { id, topicId, title, en, vi, source: 'ai' }, remaining }
 *   POST /api/ai/grade    { vi, reference, answer, targetWords? }
 *                         -> { feedback: Feedback, remaining }
 *
 * Both need a signed-in user and count towards a per-user daily limit.
 */
import { currentUser } from './auth'
import { ensureSchema, json, type Env } from './http'

const DEFAULT_BASE_URL = 'https://api.deepseek.com'
const DEFAULT_MODEL = 'deepseek-chat'
const DEFAULT_DAILY_LIMIT = 50
const LEVELS = ['A2', 'B1', 'B2', 'C1'] as const
const LENGTH_BY_LEVEL: Record<string, string> = {
  A2: '60-80 words, short simple sentences, everyday vocabulary',
  B1: '80-110 words, mostly simple and compound sentences',
  B2: '110-150 words, varied sentence structures and some idioms',
  C1: '150-190 words, natural and nuanced, advanced vocabulary',
}

interface TargetWord {
  word: string
  meaning?: string
}

interface ChatMessage {
  role: 'system' | 'user'
  content: string
}

class AiError extends Error {
  constructor(
    public code: string,
    public status = 502,
  ) {
    super(code)
  }
}

async function chatJson<T>(env: Env, messages: ChatMessage[], maxTokens: number): Promise<T> {
  if (!env.DEEPSEEK_API_KEY) throw new AiError('ai_not_configured', 503)
  const res = await fetch(`${env.DEEPSEEK_BASE_URL ?? DEFAULT_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.DEEPSEEK_MODEL ?? DEFAULT_MODEL,
      messages,
      response_format: { type: 'json_object' },
      max_tokens: maxTokens,
      temperature: 1.0,
    }),
  })
  if (res.status === 401) throw new AiError('ai_bad_key', 503)
  if (res.status === 402) throw new AiError('ai_no_balance', 503)
  if (res.status === 429) throw new AiError('ai_busy', 503)
  if (!res.ok) throw new AiError('ai_failed')
  const data = (await res.json()) as {
    choices?: { message?: { content?: string }; finish_reason?: string }[]
  }
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new AiError('ai_empty')
  try {
    return JSON.parse(content) as T
  } catch {
    throw new AiError('ai_bad_json')
  }
}

const today = () => new Date().toISOString().slice(0, 10)

/** Reserves one AI call for the user; returns how many remain today, or throws when over the limit. */
async function takeQuota(env: Env, user: string): Promise<number> {
  const limit = Number(env.AI_DAILY_LIMIT) || DEFAULT_DAILY_LIMIT
  const row = await env.DB.prepare(
    `INSERT INTO ai_usage (username, day, count) VALUES (?, ?, 1)
     ON CONFLICT (username, day) DO UPDATE SET count = count + 1
     RETURNING count`,
  )
    .bind(user, today())
    .first<{ count: number }>()
  const used = row?.count ?? 1
  if (used > limit) throw new AiError('daily_limit', 429)
  return limit - used
}

function cleanTargets(value: unknown): TargetWord[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((w): w is TargetWord => !!w && typeof w.word === 'string' && w.word.length <= 64)
    .slice(0, 6)
    .map((w) => ({
      word: w.word,
      meaning: typeof w.meaning === 'string' ? w.meaning.slice(0, 100) : undefined,
    }))
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : '')

async function generatePassage(request: Request, env: Env, user: string): Promise<Response> {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
  const topicId = str(body.topicId, 40)
  const topicName = str(body.topicName, 60) || topicId
  const mode = body.mode === 'writing' ? 'writing' : 'reading'
  const level = LEVELS.includes(body.level as (typeof LEVELS)[number]) ? (body.level as string) : 'B1'
  const targets = cleanTargets(body.targetWords)
  if (!topicId) return json({ error: 'missing_topic' }, 400)

  const recent = await env.DB.prepare(
    'SELECT data FROM passages WHERE username = ? AND topic_id = ? ORDER BY created_at DESC LIMIT 8',
  )
    .bind(user, topicId)
    .all<{ data: string }>()
  const recentTitles = [...new Set(recent.results.map((r) => (JSON.parse(r.data) as { title: string }).title))]

  const remaining = await takeQuota(env, user)

  const targetLine = targets.length
    ? `The English passage MUST naturally use each of these words (any inflection is fine): ${targets
        .map((t) => (t.meaning ? `"${t.word}" (${t.meaning})` : `"${t.word}"`))
        .join(', ')}. List the ones you used in "usedWords".`
    : 'Set "usedWords" to an empty array.'

  const purpose =
    mode === 'writing'
      ? 'The learner will see only the Vietnamese version and must translate it into English, so the Vietnamese must be natural and its meaning must map clearly onto the English passage.'
      : 'The learner will read the English passage and may try to translate it.'

  const result = await chatJson<{ title?: string; en?: string; vi?: string; usedWords?: string[] }>(
    env,
    [
      {
        role: 'system',
        content:
          'You write short, engaging English practice passages for an adult Vietnamese learner. ' +
          'Write about realistic adult life (work, travel, technology, health, money, relationships...). ' +
          'Avoid lists and dialogues; write one coherent paragraph. ' +
          'Reply with a json object only: {"title": string, "en": string, "vi": string, "usedWords": string[]}. ' +
          '"vi" is a faithful, natural Vietnamese translation of "en".',
      },
      {
        role: 'user',
        content: [
          `Topic: ${topicName}.`,
          `CEFR level: ${level} (${LENGTH_BY_LEVEL[level]}).`,
          purpose,
          targetLine,
          recentTitles.length
            ? `Choose a different angle from these recent passages: ${recentTitles.map((t) => `"${t}"`).join(', ')}.`
            : '',
        ]
          .filter(Boolean)
          .join('\n'),
      },
    ],
    1500,
  )

  const en = str(result.en, 3000).trim()
  const vi = str(result.vi, 4000).trim()
  if (!en || !vi) throw new AiError('ai_bad_json')
  const passage = {
    id: crypto.randomUUID(),
    topicId,
    title: str(result.title, 120).trim() || topicName,
    en,
    vi,
    level,
    usedWords: Array.isArray(result.usedWords) ? result.usedWords.filter((w) => typeof w === 'string') : [],
    source: 'ai' as const,
  }
  await env.DB.prepare(
    'INSERT INTO passages (id, username, topic_id, mode, data, created_at) VALUES (?, ?, ?, ?, ?, ?)',
  )
    .bind(passage.id, user, topicId, mode, JSON.stringify(passage), Date.now())
    .run()
  return json({ passage, remaining })
}

export interface Feedback {
  score: number
  summary: string
  corrections: { original: string; suggestion: string; explanation: string }[]
  improved: string
  wordNotes: { word: string; used: boolean; note: string }[]
}

async function grade(request: Request, env: Env, user: string): Promise<Response> {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
  const vi = str(body.vi, 4000)
  const reference = str(body.reference, 3000)
  const answer = str(body.answer, 4000).trim()
  const targets = cleanTargets(body.targetWords)
  if (!vi || !answer) return json({ error: 'missing_fields' }, 400)

  const remaining = await takeQuota(env, user)
  const raw = await chatJson<Partial<Feedback>>(
    env,
    [
      {
        role: 'system',
        content:
          'You are a kind but precise English teacher for an adult Vietnamese learner. ' +
          'Grade the learner\'s English translation of a Vietnamese passage. Judge meaning, grammar, word choice and naturalness; ' +
          'a different but correct wording is fine and must not be penalised. ' +
          'Write "summary", "explanation" and "note" in Vietnamese; quote English as English. ' +
          'Reply with a json object only: {"score": number 0-10, "summary": string, ' +
          '"corrections": [{"original": string, "suggestion": string, "explanation": string}], ' +
          '"improved": string, "wordNotes": [{"word": string, "used": boolean, "note": string}]}. ' +
          'List at most 6 corrections, most important first. "improved" is the learner\'s text with your fixes applied, keeping their style. ' +
          '"wordNotes" has one entry per target word: whether it was used and whether it was used correctly.',
      },
      {
        role: 'user',
        content: [
          `Vietnamese passage:\n${vi}`,
          reference ? `A reference translation (one possible answer):\n${reference}` : '',
          targets.length ? `Target words: ${targets.map((t) => t.word).join(', ')}` : 'Target words: none',
          `Learner's translation:\n${answer}`,
        ]
          .filter(Boolean)
          .join('\n\n'),
      },
    ],
    1800,
  )

  const feedback: Feedback = {
    score: Math.max(0, Math.min(10, Number(raw.score) || 0)),
    summary: str(raw.summary, 1000),
    corrections: (Array.isArray(raw.corrections) ? raw.corrections : []).slice(0, 8).map((c) => ({
      original: str(c?.original, 400),
      suggestion: str(c?.suggestion, 400),
      explanation: str(c?.explanation, 600),
    })),
    improved: str(raw.improved, 4000),
    wordNotes: (Array.isArray(raw.wordNotes) ? raw.wordNotes : []).slice(0, 8).map((n) => ({
      word: str(n?.word, 64),
      used: !!n?.used,
      note: str(n?.note, 400),
    })),
  }
  return json({ feedback, remaining })
}

export async function handleAi(request: Request, env: Env, action: string): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)
  const user = await currentUser(request, env)
  if (!user) return json({ error: 'not_signed_in' }, 401)
  await ensureSchema(env)
  try {
    if (action === 'passage') return await generatePassage(request, env, user)
    if (action === 'grade') return await grade(request, env, user)
    return json({ error: 'not_found' }, 404)
  } catch (err) {
    if (err instanceof AiError) return json({ error: err.code }, err.status)
    throw err
  }
}
