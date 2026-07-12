import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import QuestionStripVirtual from '@/components/QuestionStripVirtual'
import { useGameStore } from '@/stores/game'
import './ItemContainer.css'

export default function ItemContainer() {
  const navigate = useNavigate()
  const currentTopic = useGameStore((s) => s.currentTopic)
  const itemNum = useGameStore((s) => s.itemNum)
  const questionCount = useGameStore((s) => s.questionCount)
  const isLastQuestion = useGameStore((s) => s.isLastQuestion)
  const userAnswersMap = useGameStore((s) => s.userAnswersMap)
  const submitCurrentQuestion = useGameStore((s) => s.submitCurrentQuestion)
  const nextQuestion = useGameStore((s) => s.nextQuestion)
  const prevQuestion = useGameStore((s) => s.prevQuestion)
  const goToQuestion = useGameStore((s) => s.goToQuestion)
  const stopTimer = useGameStore((s) => s.stopTimer)
  const ensureReviewComputed = useGameStore((s) => s.ensureReviewComputed)

  const [localSelection, setLocalSelection] = useState<string[]>([])

  useEffect(() => {
    const id = currentTopic?.id
    if (!id) {
      setLocalSelection([])
      return
    }
    setLocalSelection([...(userAnswersMap[id] ?? [])])
  }, [currentTopic?.id, userAnswersMap])

  function getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index)
  }

  function isSelected(optionId: string) {
    return localSelection.includes(optionId)
  }

  function toggleOption(optionId: string) {
    if (!currentTopic) return

    if (currentTopic.type === 'MORE') {
      if (isSelected(optionId)) {
        setLocalSelection(localSelection.filter((id) => id !== optionId))
        return
      }
      setLocalSelection([...localSelection, optionId])
      return
    }

    setLocalSelection([optionId])
  }

  function persistCurrentSelection() {
    if (!currentTopic) return
    submitCurrentQuestion(localSelection)
  }

  function handleNextItem() {
    persistCurrentSelection()
    if (isLastQuestion) {
      void handleSubmitAnswer()
      return
    }
    nextQuestion()
  }

  function handlePrevItem() {
    persistCurrentSelection()
    prevQuestion()
  }

  function handleGoToQuestion(index: number) {
    persistCurrentSelection()
    goToQuestion(index)
  }

  async function handleSubmitAnswer() {
    persistCurrentSelection()
    stopTimer()
    ensureReviewComputed()
    await navigate('/score', { state: { freshSubmit: true } })
  }

  const typeLabel =
    currentTopic?.type === 'ONE'
      ? '单选题'
      : currentTopic?.type === 'MORE'
        ? '多选题'
        : '判断题'

  return (
    <section className="item-container">
      <div className="quiz-block">
        {!currentTopic ? (
          <div>
            <p>暂无题目，请先上传文件。</p>
            <Link to="/upload" className="button">
              去上传
            </Link>
          </div>
        ) : (
          <div>
            <QuestionStripVirtual
              count={questionCount}
              activeNum={itemNum}
              onSelect={handleGoToQuestion}
            />

            <header className="topic-title">
              <span>{typeLabel}</span>
              <strong>
                {itemNum}/{questionCount}
              </strong>
            </header>
            <p className="stem">{currentTopic.stem}</p>

            <ul className="option-list">
              {currentTopic.options.map((option, index) => (
                <li
                  key={option.id}
                  className="option-item"
                  onClick={() => toggleOption(option.id)}
                >
                  <span className={`option-tag ${isSelected(option.id) ? 'selected' : ''}`}>
                    {getOptionLabel(index)}
                  </span>
                  <span>{option.text}</span>
                </li>
              ))}
            </ul>

            <div className="nav-actions">
              <button
                type="button"
                className="button ghost"
                disabled={itemNum <= 1}
                onClick={handlePrevItem}
              >
                上一题
              </button>
              <button type="button" className="button" onClick={handleNextItem}>
                {isLastQuestion ? '提交答卷' : '下一题'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
