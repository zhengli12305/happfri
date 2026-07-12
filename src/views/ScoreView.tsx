import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { saveQuizResult } from '@/api/quizHistory'
import { buildQuizResultPayload } from '@/services/quizHistoryTransform'
import { useGameStore } from '@/stores/game'
import { computeQuizInsight } from '@/stores/gameLogic'
import './ScoreView.css'

interface ScoreLocationState {
  freshSubmit?: boolean
}

export default function ScoreView() {
  const navigate = useNavigate()
  const location = useLocation()
  const hasSavedRef = useRef(false)
  const hasQuestions = useGameStore((s) => s.hasQuestions)
  const quizTitle = useGameStore((s) => s.quizTitle)
  const calculateScore = useGameStore((s) => s.calculateScore)
  const questionCount = useGameStore((s) => s.questionCount)
  const elapsedTime = useGameStore((s) => s.elapsedTime)
  const reviewItems = useGameStore((s) => s.reviewItems)
  const ensureReviewComputed = useGameStore((s) => s.ensureReviewComputed)

  const insight = useMemo(() => computeQuizInsight(reviewItems), [reviewItems])

  useLayoutEffect(() => {
    ensureReviewComputed()
  }, [ensureReviewComputed])

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

  useEffect(() => {
    const state = location.state as ScoreLocationState | null
    if (!state?.freshSubmit || hasSavedRef.current || !hasQuestions || reviewItems.length === 0) {
      return
    }

    hasSavedRef.current = true
    const payload = buildQuizResultPayload({
      quizTitle,
      score: calculateScore,
      insight,
      elapsedTime,
    })

    void saveQuizResult(payload)
      .catch(() => {
        // 保存失败不阻断成绩页展示
      })
      .finally(() => {
        void navigate('.', { replace: true, state: {} })
      })
  }, [
    calculateScore,
    elapsedTime,
    hasQuestions,
    insight,
    location.state,
    navigate,
    quizTitle,
    reviewItems.length,
  ])

  return (
    <div className="score-page">
      <h1>答题结果</h1>
      <p className="score">{calculateScore} 分</p>
      <p className="tip">{scoreTips}</p>
      <p className="meta">
        共 {questionCount} 题，用时 {elapsedTime} 秒
      </p>

      <section className="insight-grid" aria-label="答题统计">
        <div className="insight-card">
          <span>正确率</span>
          <strong>{insight.accuracy}%</strong>
        </div>
        <div className="insight-card">
          <span>完成率</span>
          <strong>{insight.completionRate}%</strong>
        </div>
        <div className="insight-card">
          <span>答对题数</span>
          <strong>
            {insight.correct}/{insight.total}
          </strong>
        </div>
        <div className="insight-card warning">
          <span>错题/未答</span>
          <strong>
            {insight.wrong}/{insight.unanswered}
          </strong>
        </div>
      </section>

      <section className="analysis-panel">
        <div className="panel-title">
          <h2>题型掌握度</h2>
          <p>
            {insight.weakestType
              ? `薄弱题型：${insight.weakestType.label}`
              : '完成答题后生成题型分析'}
          </p>
        </div>
        <div className="type-bars">
          {insight.typeAccuracy.map((item) => (
            <div className="type-row" key={item.type}>
              <div className="type-label">
                <span>{item.label}</span>
                <em>
                  {item.correct}/{item.total}
                </em>
              </div>
              <div className="type-track">
                <div className="type-fill" style={{ width: `${item.accuracy}%` }} />
              </div>
              <strong>{item.accuracy}%</strong>
            </div>
          ))}
        </div>
      </section>

      <div className="actions">
        <Link to="/" className="button ghost">
          返回首页
        </Link>
        <Link to="/answer-card" className="button secondary">
          查看答案卡
        </Link>
        <Link to="/history" className="button secondary">
          查看答题历史
        </Link>
        <Link to="/upload" className="button">
          继续上传文件
        </Link>
      </div>
    </div>
  )
}
