import axios from 'axios'
import { apiUrl } from '@/config/api'
import type { QuizHistoryRecord, QuizResultCreatePayload } from '@/stores/gameTypes'

interface QuizResultCreatedResponse {
  id: string
  timestamp: number
}

interface QuizResultListResponse {
  results: QuizHistoryRecord[]
}

export async function saveQuizResult(payload: QuizResultCreatePayload): Promise<QuizResultCreatedResponse> {
  const response = await axios.post<QuizResultCreatedResponse>(apiUrl('/api/quiz-results'), payload, {
    timeout: 15000,
  })
  return response.data
}

export async function fetchQuizHistory(clientId: string): Promise<QuizHistoryRecord[]> {
  const response = await axios.get<QuizResultListResponse>(apiUrl('/api/quiz-results'), {
    params: { clientId },
    timeout: 15000,
  })
  return response.data.results
}
