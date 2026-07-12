import { describe, expect, it } from 'vitest'
import {
  computeCalculateScore,
  computeQuizInsight,
  computeReviewItems,
  isSameAnswerSet,
  normalizeAnswerIds,
} from './gameLogic'
import type { QuizQuestion } from './gameTypes'

describe('normalizeAnswerIds', () => {
  it('dedupes and sorts', () => {
    expect(normalizeAnswerIds(['B', 'A', 'B'])).toEqual(['A', 'B'])
  })
})

describe('isSameAnswerSet', () => {
  it('treats order as irrelevant after normalize', () => {
    expect(isSameAnswerSet(['B', 'A'], ['A', 'B'])).toBe(true)
  })

  it('fails when length differs', () => {
    expect(isSameAnswerSet(['A'], ['A', 'B'])).toBe(false)
  })
})

describe('computeCalculateScore', () => {
  const questions: QuizQuestion[] = [
    {
      id: 'q1',
      type: 'ONE',
      stem: 'Q1',
      options: [
        { id: 'A', text: 'a' },
        { id: 'B', text: 'b' },
      ],
      correctAnswerIds: ['A'],
    },
    {
      id: 'q2',
      type: 'ONE',
      stem: 'Q2',
      options: [
        { id: 'A', text: 'a' },
        { id: 'B', text: 'b' },
      ],
      correctAnswerIds: ['B'],
    },
  ]

  it('scores 50 when one of two is correct (even split)', () => {
    const map = { q1: ['A'], q2: ['A'] }
    expect(computeCalculateScore(questions, map)).toBe(50)
  })

  it('scores 100 when all correct', () => {
    const map = { q1: ['A'], q2: ['B'] }
    expect(computeCalculateScore(questions, map)).toBe(100)
  })
})

describe('computeQuizInsight', () => {
  const questions: QuizQuestion[] = [
    {
      id: 'q1',
      type: 'ONE',
      stem: 'Q1',
      options: [
        { id: 'A', text: 'a' },
        { id: 'B', text: 'b' },
      ],
      correctAnswerIds: ['A'],
    },
    {
      id: 'q2',
      type: 'MORE',
      stem: 'Q2',
      options: [
        { id: 'A', text: 'a' },
        { id: 'B', text: 'b' },
      ],
      correctAnswerIds: ['A', 'B'],
    },
    {
      id: 'q3',
      type: 'JUDGE',
      stem: 'Q3',
      options: [
        { id: 'A', text: 'right' },
        { id: 'B', text: 'wrong' },
      ],
      correctAnswerIds: ['B'],
    },
  ]

  it('summarizes accuracy, completion and weakest question type', () => {
    const reviewItems = computeReviewItems(questions, {
      q1: ['A'],
      q2: ['A'],
    })

    const insight = computeQuizInsight(reviewItems)

    expect(insight.correct).toBe(1)
    expect(insight.wrong).toBe(1)
    expect(insight.unanswered).toBe(1)
    expect(insight.accuracy).toBe(33)
    expect(insight.completionRate).toBe(67)
    expect(insight.weakestType?.type).toBe('MORE')
  })
})
