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
