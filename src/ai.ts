import type { Level, Passage, Topic, VocabWord } from './types'

export interface Feedback {
  score: number
  summary: string
  corrections: { original: string; suggestion: string; explanation: string }[]
  improved: string
  wordNotes: { word: string; used: boolean; note: string }[]
}

const ERRORS: Record<string, string> = {
  ai_not_configured: 'Chưa cài API key cho AI, đang dùng bài có sẵn.',
  ai_bad_key: 'API key của AI không hợp lệ, đang dùng bài có sẵn.',
  ai_no_balance: 'Tài khoản AI đã hết tiền, đang dùng bài có sẵn.',
  ai_busy: 'AI đang quá tải, đang dùng bài có sẵn. Thử lại sau ít phút.',
  daily_limit: 'Đã hết lượt dùng AI hôm nay, đang dùng bài có sẵn.',
  not_signed_in: 'Đăng nhập để dùng bài do AI tạo.',
}

export class AiUnavailable extends Error {}

async function post<T>(path: string, body: unknown): Promise<T> {
  let res: Response
  try {
    res = await fetch(`/api/ai/${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'same-origin',
    })
  } catch {
    throw new AiUnavailable('Không kết nối được máy chủ, đang dùng bài có sẵn.')
  }
  const isJson = res.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await res.json() : null
  if (!res.ok || !data) {
    throw new AiUnavailable(ERRORS[data?.error] ?? 'AI gặp lỗi, đang dùng bài có sẵn.')
  }
  return data as T
}

const toTargets = (words: VocabWord[]) => words.map((w) => ({ word: w.word, meaning: w.meaning }))

export async function generatePassage(
  topic: Topic,
  mode: 'reading' | 'writing',
  level: Level,
  targets: VocabWord[] = [],
): Promise<Passage> {
  const { passage } = await post<{ passage: Passage }>('passage', {
    topicId: topic.id,
    topicName: topic.name,
    mode,
    level,
    targetWords: toTargets(targets),
  })
  return passage
}

export async function gradeTranslation(
  passage: Passage,
  answer: string,
  targets: VocabWord[],
): Promise<Feedback> {
  const { feedback } = await post<{ feedback: Feedback }>('grade', {
    vi: passage.vi,
    reference: passage.en,
    answer,
    targetWords: toTargets(targets),
  })
  return feedback
}
