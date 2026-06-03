import { describe, expect, it } from 'vitest'
import { computeCalculateScore, isSameAnswerSet, normalizeAnswerIds } from './gameLogic'
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
