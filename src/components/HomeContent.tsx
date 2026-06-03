import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '@/stores/game'
import './HomeContent.css'

interface HomeContentProps {
  onOpenDrawer: () => void
}

export default function HomeContent({ onOpenDrawer }: HomeContentProps) {
  const navigate = useNavigate()
  const hasQuestions = useGameStore((s) => s.hasQuestions)
  const [hintMessage, setHintMessage] = useState('')

  async function startQuiz() {
    if (!hasQuestions) {
      setHintMessage('请先在右上角上传题库文件。')
      onOpenDrawer()
      return
    }
    setHintMessage('')
    await navigate('/item')
  }

  return (
    <div className="home-main">
      <button
        type="button"
        className="start-btn"
        disabled={!hasQuestions}
        onClick={startQuiz}
        title={!hasQuestions ? '请先上传题库文件' : undefined}
      >
        开始答题
      </button>
      {hintMessage ? <p className="hint">{hintMessage}</p> : null}
    </div>
  )
}
