import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useGameStore, type QuestionReviewItem } from '@/stores/game'
import './AnswerCardView.css'

export default function AnswerCardView() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const hasQuestions = useGameStore((s) => s.hasQuestions)
  const reviewItems = useGameStore((s) => s.reviewItems)
  const currentIndex = Number(searchParams.get('current') || 1)

  function getCellClass(item: QuestionReviewItem) {
    if (!item.userAnswerIds.length) return 'pending'
    return item.isCorrect ? 'correct' : 'wrong'
  }

  function goDetail(index: number) {
    void navigate(`/answer-card/${index}`)
  }

  useEffect(() => {
    if (!hasQuestions) {
      void navigate('/upload', { replace: true })
    }
  }, [hasQuestions, navigate])

  return (
    <section className="answer-card-page">
      <header className="header">
        <h1>答题卡</h1>
        <p>点击题号查看详情（当前题会显示角标）</p>
      </header>

      <div className="legend">
        <span className="legend-item">
          <i className="dot pending" />未作答
        </span>
        <span className="legend-item">
          <i className="dot correct" />答对
        </span>
        <span className="legend-item">
          <i className="dot wrong" />答错
        </span>
      </div>

      <div className="grid">
        {reviewItems.map((item) => (
          <div key={item.id} className="cell-wrap">
            <button
              type="button"
              className={`cell ${getCellClass(item)}`}
              onClick={() => goDetail(item.index)}
            >
              {item.index}
            </button>
            {currentIndex === item.index ? <span className="current-flag">当前</span> : null}
          </div>
        ))}
      </div>

      <div className="bottom-actions">
        <Link to="/item" state={{ reset: true }} className="bottom-btn ghost">
          重新练习
        </Link>
        <Link to="/score" className="bottom-btn primary">
          查看练习结果
        </Link>
      </div>
    </section>
  )
}
