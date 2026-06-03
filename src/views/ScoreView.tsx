import { useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGameStore } from '@/stores/game'
import './ScoreView.css'

export default function ScoreView() {
  const navigate = useNavigate()
  const hasQuestions = useGameStore((s) => s.hasQuestions)
  const calculateScore = useGameStore((s) => s.calculateScore)
  const questionCount = useGameStore((s) => s.questionCount)
  const elapsedTime = useGameStore((s) => s.elapsedTime)

  const scoreTips = useMemo(() => {
    const tipsArr = [
      '继续努力，再做几套题就更稳了。',
      '掌握得不错，保持这个节奏。',
      '表现很好，已经超过大多数人。',
      '优秀，答题准确率很高。',
      '满分表现，太强了。',
    ]
    let index = Math.ceil(calculateScore / 20) - 1
    if (index < 0) index = 0
    if (index > 4) index = 4
    return tipsArr[index]!
  }, [calculateScore])

  useEffect(() => {
    if (!hasQuestions) {
      void navigate('/upload', { replace: true })
    }
  }, [hasQuestions, navigate])

  return (
    <div className="score-page">
      <h1>答题结果</h1>
      <p className="score">{calculateScore} 分</p>
      <p className="tip">{scoreTips}</p>
      <p className="meta">
        共 {questionCount} 题，用时 {elapsedTime} 秒
      </p>

      <div className="actions">
        <Link to="/" className="button ghost">
          返回首页
        </Link>
        <Link to="/answer-card" className="button secondary">
          查看答案卡
        </Link>
        <Link to="/upload" className="button">
          继续上传文件
        </Link>
      </div>
    </div>
  )
}
