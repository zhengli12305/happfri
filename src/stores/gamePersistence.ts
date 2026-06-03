import type { QuizQuestion } from './gameTypes'

const SESSION_KEY = 'happyfri-game-session'

export interface PersistedGameSession {
  quizTitle: string
  questions: QuizQuestion[]
  itemNum: number
  elapsedTime: number
  userAnswersMap: Record<string, string[]>
}

export function saveGameSession(snapshot: PersistedGameSession) {
  if (!snapshot.questions.length) {
    sessionStorage.removeItem(SESSION_KEY)
    return
  }
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(snapshot))
  } catch {
    // quota or private mode — ignore
  }
}

export function loadGameSession(): PersistedGameSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as PersistedGameSession
    if (!data?.questions?.length) return null
    return data
  } catch {
    return null
  }
}

export function clearGameSession() {
  sessionStorage.removeItem(SESSION_KEY)
}
