import type { QuestionReviewItem, QuizQuestion } from './gameTypes'

export function normalizeAnswerIds(answerIds: string[]) {
  return [...new Set(answerIds.map(String))].sort()
}

export function isSameAnswerSet(left: string[], right: string[]) {
  const a = normalizeAnswerIds(left)
  const b = normalizeAnswerIds(right)
  if (a.length !== b.length) return false
  return a.every((id, index) => id === b[index])
}

export function computeCalculateScore(
  questions: QuizQuestion[],
  userAnswersMap: Record<string, string[]>,
) {
  if (!questions.length) return 0

  const questionCount = questions.length
  const explicitTotal = questions.reduce((sum, question) => sum + (question.score ?? 0), 0)
  const fallbackPerQuestion = questionCount > 0 ? 100 / questionCount : 0
  const hasCustomScore = explicitTotal > 0

  return Math.round(
    questions.reduce((score, question) => {
      const userAnswers = normalizeAnswerIds(userAnswersMap[question.id] ?? [])
      const standardAnswers = normalizeAnswerIds(question.correctAnswerIds ?? [])
      if (!isSameAnswerSet(userAnswers, standardAnswers)) return score
      return score + (hasCustomScore ? (question.score ?? 0) : fallbackPerQuestion)
    }, 0),
  )
}

export function computeReviewItems(
  questions: QuizQuestion[],
  userAnswersMap: Record<string, string[]>,
): QuestionReviewItem[] {
  return questions.map((question, index) => {
    const userAnswerIds = normalizeAnswerIds(userAnswersMap[question.id] ?? [])
    const correctAnswerIds = normalizeAnswerIds(question.correctAnswerIds ?? [])
    return {
      index: index + 1,
      id: question.id,
      type: question.type,
      stem: question.stem,
      userAnswerIds,
      correctAnswerIds,
      isCorrect: isSameAnswerSet(userAnswerIds, correctAnswerIds),
    }
  })
}
