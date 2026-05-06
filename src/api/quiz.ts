import axios from 'axios'
import { apiUrl } from '@/config/api'
import type { QuizParseResult } from '@/stores/game'

export async function parseQuizFile(file: File): Promise<QuizParseResult> {
  const formData = new FormData()
  formData.append('file', file)

  // 不要手动设 Content-Type：multipart 需带 boundary，由浏览器自动补全
  const response = await axios.post<QuizParseResult>(apiUrl('/api/parse-questions'), formData, {
    timeout: 60000
  })

  return response.data
}
