import { lazy, Suspense, useCallback, useEffect, useState, type ReactNode } from 'react'

import { Link } from 'react-router-dom'

import { fetchQuizHistory } from '@/api/quizHistory'

import LazyWhenVisible from '@/components/charts/LazyWhenVisible'

import type { QuizHistoryRecord } from '@/stores/gameTypes'

import { getOrCreateClientId } from '@/utils/clientId'

import './HistoryView.css'



const AccuracyTrendChart = lazy(() => import('@/components/charts/AccuracyTrendChart'))

const TypeAccuracyRadarChart = lazy(() => import('@/components/charts/TypeAccuracyRadarChart'))

const DurationBarChart = lazy(() => import('@/components/charts/DurationBarChart'))



type LoadState = 'loading' | 'ready' | 'error'



function ChartSuspense({ children }: { children: ReactNode }) {

  return <Suspense fallback={<div className="chart-loading">图表加载中…</div>}>{children}</Suspense>

}



export default function HistoryView() {

  const [records, setRecords] = useState<QuizHistoryRecord[]>([])

  const [loadState, setLoadState] = useState<LoadState>('loading')

  const [errorMessage, setErrorMessage] = useState('')



  const loadHistory = useCallback(async () => {

    setLoadState('loading')

    setErrorMessage('')

    try {

      const clientId = getOrCreateClientId()

      const nextRecords = await fetchQuizHistory(clientId)

      setRecords(nextRecords)

      setLoadState('ready')

    } catch {

      setLoadState('error')

      setErrorMessage('加载答题历史失败，请稍后重试。')

    }

  }, [])



  useEffect(() => {

    void loadHistory()

  }, [loadHistory])



  if (loadState === 'loading') {

    return (

      <div className="history-page">

        <h1>答题历史</h1>

        <p className="history-meta">加载中…</p>

      </div>

    )

  }



  if (loadState === 'error') {

    return (

      <div className="history-page">

        <h1>答题历史</h1>

        <div className="history-empty">

          <p>{errorMessage}</p>

          <button type="button" className="button" onClick={() => void loadHistory()}>

            重试

          </button>

        </div>

      </div>

    )

  }



  if (records.length === 0) {

    return (

      <div className="history-page">

        <h1>答题历史</h1>

        <div className="history-empty">

          <p>还没有答题记录，完成一次答题后会自动保存统计结果。</p>

          <Link to="/upload" className="button">

            去答题

          </Link>

        </div>

      </div>

    )

  }



  return (

    <div className="history-page">

      <header className="history-header">

        <div>

          <h1>答题历史</h1>

          <p className="history-meta">共 {records.length} 次答题记录</p>

        </div>

        <Link to="/upload" className="button ghost">

          继续答题

        </Link>

      </header>



      <LazyWhenVisible>

        <ChartSuspense>

          <AccuracyTrendChart records={records} />

        </ChartSuspense>

      </LazyWhenVisible>



      <LazyWhenVisible>

        <ChartSuspense>

          <TypeAccuracyRadarChart records={records} />

        </ChartSuspense>

      </LazyWhenVisible>



      <LazyWhenVisible>

        <ChartSuspense>

          <DurationBarChart records={records} />

        </ChartSuspense>

      </LazyWhenVisible>

    </div>

  )

}


