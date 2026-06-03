import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGameStore } from '@/stores/game'
import ItemContainer from '@/components/ItemContainer'
import './ItemView.css'

export default function ItemView() {
  const navigate = useNavigate()
  const location = useLocation()
  const hasQuestions = useGameStore((s) => s.hasQuestions)
  const initializeData = useGameStore((s) => s.initializeData)
  const startTimer = useGameStore((s) => s.startTimer)

  const shouldReset = (location.state as { reset?: boolean } | null)?.reset === true

  useEffect(() => {
    if (!hasQuestions) {
      void navigate('/upload', { replace: true })
      return
    }
    if (shouldReset) {
      initializeData()
    }
    startTimer()
  }, [hasQuestions, shouldReset, initializeData, startTimer, navigate])

  return (
    <div className="item-view-container">
      <ItemContainer />
    </div>
  )
}
