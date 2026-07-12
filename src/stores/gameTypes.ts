export type QuestionType = 'ONE' | 'MORE' | 'JUDGE'

export interface QuizOption {
  id: string
  text: string
}

export interface QuizQuestion {
  id: string
  type: QuestionType
  stem: string
  options: QuizOption[]
  correctAnswerIds: string[]
  score?: number
}

export interface QuizParseResult {
  quizTitle: string
  questions: QuizQuestion[]
}

export interface QuestionReviewItem {
  index: number
  id: string
  type: QuestionType
  stem: string
  userAnswerIds: string[]
  correctAnswerIds: string[]
  isCorrect: boolean
}

export interface TypeAccuracyItem {
  type: QuestionType
  label: string
  total: number
  correct: number
  accuracy: number
}

export interface QuizInsight {
  total: number
  answered: number
  correct: number
  wrong: number
  unanswered: number
  accuracy: number
  completionRate: number
  typeAccuracy: TypeAccuracyItem[]
  weakestType: TypeAccuracyItem | null
}

export interface QuizHistoryRecord {
  id: string
  timestamp: number
  quizTitle: string
  score: number
  total: number
  correct: number
  accuracy: number
  elapsedTime: number
  typeAccuracy: TypeAccuracyItem[]
}

export interface QuizResultCreatePayload {
  clientId: string
  quizTitle: string
  score: number
  total: number
  correct: number
  accuracy: number
  elapsedTime: number
  typeAccuracy: TypeAccuracyItem[]
  timestamp?: number
}
