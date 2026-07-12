import type { QuizInsight, QuizResultCreatePayload, TypeAccuracyItem } from '@/stores/gameTypes'
import { getOrCreateClientId } from '@/utils/clientId'

export function buildQuizResultPayload(input: {
  quizTitle: string
  score: number
  insight: QuizInsight
  elapsedTime: number
}): QuizResultCreatePayload {
  return {
    clientId: getOrCreateClientId(),
    quizTitle: input.quizTitle,
    score: input.score,
    total: input.insight.total,
    correct: input.insight.correct,
    accuracy: input.insight.accuracy,
    elapsedTime: input.elapsedTime,
    typeAccuracy: input.insight.typeAccuracy,
    timestamp: Date.now(),
  }
}

export type TypeAccuracyMode = 'latest' | 'average'

const QUESTION_TYPE_ORDER = ['ONE', 'MORE', 'JUDGE'] as const
const QUESTION_TYPE_LABELS: Record<(typeof QUESTION_TYPE_ORDER)[number], string> = {
  ONE: '单选题',
  MORE: '多选题',
  JUDGE: '判断题',
}

export function aggregateTypeAccuracy(records: { typeAccuracy: TypeAccuracyItem[] }[]): TypeAccuracyItem[] {
  const buckets = new Map<string, { total: number; correct: number }>()

  for (const record of records) {
    for (const item of record.typeAccuracy) {
      const current = buckets.get(item.type) ?? { total: 0, correct: 0 }
      current.total += item.total
      current.correct += item.correct
      buckets.set(item.type, current)
    }
  }

  return QUESTION_TYPE_ORDER.map((type) => {
    const bucket = buckets.get(type)
    const total = bucket?.total ?? 0
    const correct = bucket?.correct ?? 0
    return {
      type,
      label: QUESTION_TYPE_LABELS[type],
      total,
      correct,
      accuracy: total ? Math.round((correct / total) * 100) : 0,
    }
  })
}

export function getTypeAccuracyByMode(
  records: { typeAccuracy: TypeAccuracyItem[] }[],
  mode: TypeAccuracyMode,
): TypeAccuracyItem[] {
  if (mode === 'latest') {
    const latest = records[records.length - 1]
    if (!latest) return aggregateTypeAccuracy([])
    return fillMissingTypes(latest.typeAccuracy)
  }
  return aggregateTypeAccuracy(records)
}

function fillMissingTypes(items: TypeAccuracyItem[]): TypeAccuracyItem[] {
  const byType = new Map(items.map((item) => [item.type, item]))
  return QUESTION_TYPE_ORDER.map((type) => {
    const existing = byType.get(type)
    if (existing) return existing
    return {
      type,
      label: QUESTION_TYPE_LABELS[type],
      total: 0,
      correct: 0,
      accuracy: 0,
    }
  })
}

export function formatHistoryTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${month}-${day} ${hours}:${minutes}`
}
