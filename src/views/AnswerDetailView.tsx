import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useGameStore } from '@/stores/game'
import './AnswerDetailView.css'

export default function AnswerDetailView() {
  const navigate = useNavigate()
  const { index } = useParams()
  const hasQuestions = useGameStore((s) => s.hasQuestions)
  const reviewItems = useGameStore((s) => s.reviewItems)
  const questions = useGameStore((s) => s.questions)

  const questionIndex = Number(index) || 1
  const reviewItem = reviewItems[questionIndex - 1]
  const question = questions[questionIndex - 1]

  function getOptionClass(optionId: string) {
    const isCorrect = reviewItem?.correctAnswerIds.includes(optionId)
    const isUserSelected = reviewItem?.userAnswerIds.includes(optionId)
    const classes = []
    if (isCorrect) classes.push('correct')
    if (isUserSelected) classes.push('selected')
    if (isUserSelected && !isCorrect) classes.push('wrong')
    return classes.join(' ')
  }

  function goPrev() {
    if (questionIndex <= 1) return
    void navigate(`/answer-card/${questionIndex - 1}`)
  }

  function goNext() {
    if (questionIndex >= reviewItems.length) return
    void navigate(`/answer-card/${questionIndex + 1}`)
  }

  useEffect(() => {
    if (!hasQuestions) {
      void navigate('/upload', { replace: true })
      return
    }
    if (!question || !reviewItem) {
      void navigate('/answer-card', { replace: true })
    }
  }, [hasQuestions, question, reviewItem, navigate])

  if (!reviewItem || !question) {
    return null
  }

  return (
    <section className="answer-detail-page">
      <header className="top">
        <h1>第 {reviewItem.index} 题</h1>
        <Link to={`/answer-card?current=${reviewItem.index}`} className="back">
          返回答题卡
        </Link>
      </header>

      <p className="type">{question.type}</p>
      <p className="stem">{question.stem}</p>

      <ul className="options">
        {question.options.map((option) => (
          <li key={option.id} className={getOptionClass(option.id)}>
            <span className="label">{option.id}</span>
            <span>{option.text}</span>
          </li>
        ))}
      </ul>

      <p className="result-line">
        正确答案：
        <strong className="correct-text">{reviewItem.correctAnswerIds.join(', ') || '无'}</strong>
        &nbsp;&nbsp;您的选择：
        <strong className="wrong-text">{reviewItem.userAnswerIds.join(', ') || '未作答'}</strong>
      </p>

      <div className="pager">
        <button type="button" className="pager-btn ghost" disabled={questionIndex <= 1} onClick={goPrev}>
          上一题
        </button>
        <button
          type="button"
          className="pager-btn"
          disabled={questionIndex >= reviewItems.length}
          onClick={goNext}
        >
          下一题
        </button>
      </div>
    </section>
  )
}
