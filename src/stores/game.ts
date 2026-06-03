import { create } from 'zustand'
import {
  computeCalculateScore,
  computeReviewItems,
  normalizeAnswerIds,
} from './gameLogic'
import { clearGameSession, loadGameSession, saveGameSession } from './gamePersistence'
import type {
  QuestionReviewItem,
  QuizParseResult,
  QuizQuestion,
} from './gameTypes'
import { useUiStore } from './ui'

export type {
  QuestionReviewItem,
  QuestionType,
  QuizOption,
  QuizParseResult,
  QuizQuestion,
} from './gameTypes'

function computeQuestionCount(questions: QuizQuestion[]) {
  return questions.length
}

function computeCurrentTopic(questions: QuizQuestion[], itemNum: number): QuizQuestion | null {
  const index = itemNum - 1
  return index >= 0 && index < questions.length ? (questions[index] ?? null) : null
}

function syncDerived(
  questions: QuizQuestion[],
  itemNum: number,
  userAnswersMap: Record<string, string[]>,
) {
  const questionCount = computeQuestionCount(questions)
  return {
    questionCount,
    currentTopic: computeCurrentTopic(questions, itemNum),
    isLastQuestion: questionCount > 0 && itemNum >= questionCount,
    hasQuestions: questionCount > 0,
    answeredCount: Object.keys(userAnswersMap).length,
    calculateScore: computeCalculateScore(questions, userAnswersMap),
    reviewItems: computeReviewItems(questions, userAnswersMap),
  }
}

function snapshotFromState(state: {
  quizTitle: string
  questions: QuizQuestion[]
  itemNum: number
  elapsedTime: number
  userAnswersMap: Record<string, string[]>
}) {
  saveGameSession({
    quizTitle: state.quizTitle,
    questions: state.questions,
    itemNum: state.itemNum,
    elapsedTime: state.elapsedTime,
    userAnswersMap: state.userAnswersMap,
  })
}

interface GameState {
  level: string
  quizTitle: string
  questions: QuizQuestion[]
  itemNum: number
  elapsedTime: number
  timerId: number | null
  userAnswersMap: Record<string, string[]>
  questionCount: number
  currentTopic: QuizQuestion | null
  isLastQuestion: boolean
  hasQuestions: boolean
  answeredCount: number
  calculateScore: number
  reviewItems: QuestionReviewItem[]
  setParseResult: (payload: QuizParseResult) => void
  setQuestionAnswer: (questionId: string, answerIds: string[]) => void
  submitCurrentQuestion: (answerIds: string[]) => void
  nextQuestion: () => void
  prevQuestion: () => void
  goToQuestion: (targetIndex: number) => void
  initializeData: () => void
  clearAllData: () => void
  startTimer: () => void
  stopTimer: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  level: '第一周',
  quizTitle: '',
  questions: [],
  itemNum: 1,
  elapsedTime: 0,
  timerId: null,
  userAnswersMap: {},
  questionCount: 0,
  currentTopic: null,
  isLastQuestion: false,
  hasQuestions: false,
  answeredCount: 0,
  calculateScore: 0,
  reviewItems: [],

  setParseResult: (payload) => {
    const questions = payload.questions
    set({
      quizTitle: payload.quizTitle || '智能题库',
      questions,
      ...syncDerived(questions, 1, {}),
    })
    get().initializeData()
    useUiStore.getState().clearError()
    snapshotFromState(get())
  },

  setQuestionAnswer: (questionId, answerIds) => {
    const userAnswersMap = {
      ...get().userAnswersMap,
      [questionId]: normalizeAnswerIds(answerIds),
    }
    set({
      userAnswersMap,
      ...syncDerived(get().questions, get().itemNum, userAnswersMap),
    })
    snapshotFromState(get())
  },

  submitCurrentQuestion: (answerIds) => {
    const topic = get().currentTopic
    if (!topic) return
    get().setQuestionAnswer(topic.id, answerIds)
  },

  nextQuestion: () => {
    const { itemNum, questionCount, timerId } = get()
    if (itemNum < questionCount) {
      const nextNum = itemNum + 1
      set({
        itemNum: nextNum,
        ...syncDerived(get().questions, nextNum, get().userAnswersMap),
      })
      snapshotFromState(get())
      return
    }
    if (timerId !== null) {
      clearInterval(timerId)
      set({ timerId: null })
    }
  },

  prevQuestion: () => {
    if (get().itemNum > 1) {
      const nextNum = get().itemNum - 1
      set({
        itemNum: nextNum,
        ...syncDerived(get().questions, nextNum, get().userAnswersMap),
      })
      snapshotFromState(get())
    }
  },

  goToQuestion: (targetIndex) => {
    const questionCount = get().questionCount
    if (questionCount === 0) return
    const safeIndex = Math.min(Math.max(targetIndex, 1), questionCount)
    set({
      itemNum: safeIndex,
      ...syncDerived(get().questions, safeIndex, get().userAnswersMap),
    })
    snapshotFromState(get())
  },

  initializeData: () => {
    get().stopTimer()
    const userAnswersMap = {}
    set({
      itemNum: 1,
      elapsedTime: 0,
      userAnswersMap,
      ...syncDerived(get().questions, 1, userAnswersMap),
    })
    useUiStore.getState().clearError()
    snapshotFromState(get())
  },

  clearAllData: () => {
    get().stopTimer()
    const questions: QuizQuestion[] = []
    set({
      quizTitle: '',
      questions,
      itemNum: 1,
      elapsedTime: 0,
      userAnswersMap: {},
      timerId: null,
      ...syncDerived(questions, 1, {}),
    })
    clearGameSession()
  },

  startTimer: () => {
    if (get().timerId !== null) return
    const timerId = window.setInterval(() => {
      set({ elapsedTime: get().elapsedTime + 1 })
      snapshotFromState(get())
    }, 1000)
    set({ timerId })
  },

  stopTimer: () => {
    const { timerId } = get()
    if (timerId !== null) {
      clearInterval(timerId)
      set({ timerId: null })
    }
  },
}))

/** 应用启动时从 sessionStorage 恢复题库与答题进度 */
export function hydrateGameStoreFromSession() {
  const data = loadGameSession()
  if (!data) return

  useGameStore.setState({
    quizTitle: data.quizTitle,
    questions: data.questions,
    itemNum: data.itemNum,
    elapsedTime: data.elapsedTime,
    userAnswersMap: data.userAnswersMap,
    timerId: null,
    ...syncDerived(data.questions, data.itemNum, data.userAnswersMap),
  })
}
