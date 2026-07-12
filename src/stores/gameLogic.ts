import type { QuestionReviewItem, QuestionType, QuizInsight, QuizQuestion } from './gameTypes'

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  ONE: '单选题',
  MORE: '多选题',
  JUDGE: '判断题',
}

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

export function computeQuizInsight(reviewItems: QuestionReviewItem[]): QuizInsight {
  const total = reviewItems.length
  const answered = reviewItems.filter((item) => item.userAnswerIds.length > 0).length
  const correct = reviewItems.filter((item) => item.isCorrect).length
  const wrong = Math.max(answered - correct, 0)
  const unanswered = Math.max(total - answered, 0)

  const typeAccuracy = (Object.keys(QUESTION_TYPE_LABELS) as QuestionType[])
    .map((type) => {
      const items = reviewItems.filter((item) => item.type === type)
      const typeCorrect = items.filter((item) => item.isCorrect).length
      return {
        type,
        label: QUESTION_TYPE_LABELS[type],
        total: items.length,
        correct: typeCorrect,
        accuracy: items.length ? Math.round((typeCorrect / items.length) * 100) : 0,
      }
    })
    .filter((item) => item.total > 0)

  const weakestType =
    typeAccuracy.length > 0
      ? [...typeAccuracy].sort((a, b) => a.accuracy - b.accuracy || b.total - a.total)[0]!
      : null

  return {
    total,
    answered,
    correct,
    wrong,
    unanswered,
    accuracy: total ? Math.round((correct / total) * 100) : 0,
    completionRate: total ? Math.round((answered / total) * 100) : 0,
    typeAccuracy,
    weakestType,
  }
}
