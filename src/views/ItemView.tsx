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
  const persistSession = useGameStore((s) => s.persistSession)

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

  useEffect(() => {
    const saveSession = () => persistSession()
    window.addEventListener('beforeunload', saveSession)
    window.addEventListener('pagehide', saveSession)
    return () => {
      window.removeEventListener('beforeunload', saveSession)
      window.removeEventListener('pagehide', saveSession)
      saveSession()
    }
  }, [persistSession])

  return (
    <div className="item-view-container">
      <ItemContainer />
    </div>
  )
}
