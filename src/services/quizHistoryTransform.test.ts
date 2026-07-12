import { describe, expect, it } from 'vitest'
import {
  aggregateTypeAccuracy,
  getTypeAccuracyByMode,
} from '@/services/quizHistoryTransform'
import type { QuizHistoryRecord } from '@/stores/gameTypes'
import { toAccuracyTrendOption } from '@/services/chartOptions'

const sampleRecords: QuizHistoryRecord[] = [
  {
    id: '1',
    timestamp: 1710000000000,
    quizTitle: '测验 A',
    score: 80,
    total: 10,
    correct: 8,
    accuracy: 80,
    elapsedTime: 300,
    typeAccuracy: [
      { type: 'ONE', label: '单选题', total: 5, correct: 4, accuracy: 80 },
      { type: 'JUDGE', label: '判断题', total: 5, correct: 4, accuracy: 80 },
    ],
  },
  {
    id: '2',
    timestamp: 1710003600000,
    quizTitle: '测验 B',
    score: 90,
    total: 10,
    correct: 9,
    accuracy: 90,
    elapsedTime: 240,
    typeAccuracy: [
      { type: 'ONE', label: '单选题', total: 5, correct: 5, accuracy: 100 },
      { type: 'MORE', label: '多选题', total: 5, correct: 4, accuracy: 80 },
    ],
  },
]

describe('aggregateTypeAccuracy', () => {
  it('merges totals and correct counts by type', () => {
    const result = aggregateTypeAccuracy(sampleRecords)
    const single = result.find((item) => item.type === 'ONE')
    const multi = result.find((item) => item.type === 'MORE')

    expect(single).toMatchObject({ total: 10, correct: 9, accuracy: 90 })
    expect(multi).toMatchObject({ total: 5, correct: 4, accuracy: 80 })
  })
})

describe('getTypeAccuracyByMode', () => {
  it('returns latest record type accuracy', () => {
    const result = getTypeAccuracyByMode(sampleRecords, 'latest')
    expect(result.find((item) => item.type === 'MORE')?.accuracy).toBe(80)
  })

  it('returns averaged type accuracy', () => {
    const result = getTypeAccuracyByMode(sampleRecords, 'average')
    expect(result.find((item) => item.type === 'ONE')?.accuracy).toBe(90)
  })
})

describe('toAccuracyTrendOption', () => {
  it('returns null when fewer than two records', () => {
    expect(toAccuracyTrendOption([sampleRecords[0]!])).toBeNull()
  })

  it('returns chart option when at least two records exist', () => {
    expect(toAccuracyTrendOption(sampleRecords)).not.toBeNull()
  })
})
