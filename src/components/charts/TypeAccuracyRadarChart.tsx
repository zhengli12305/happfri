import { useMemo, useState } from 'react'
import echarts from '@/lib/echarts'
import type { QuizHistoryRecord } from '@/stores/gameTypes'
import type { TypeAccuracyMode } from '@/services/quizHistoryTransform'
import { toTypeRadarOption } from '@/services/chartOptions'
import ChartPanel from './ChartPanel'
import EChartsReactCore from './EChartsCore'

interface TypeAccuracyRadarChartProps {
  records: QuizHistoryRecord[]
}

export default function TypeAccuracyRadarChart({ records }: TypeAccuracyRadarChartProps) {
  const [mode, setMode] = useState<TypeAccuracyMode>('latest')
  const option = useMemo(() => toTypeRadarOption(records, mode), [records, mode])
  const isEmpty = !option

  return (
    <ChartPanel
      title="题型正确率对比"
      description="单选 / 多选 / 判断三类题型的掌握情况"
      isEmpty={isEmpty}
      emptyMessage="完成答题后可查看题型分析"
      actions={
        <>
          <button
            type="button"
            className={`chart-tab ${mode === 'latest' ? 'active' : ''}`}
            onClick={() => setMode('latest')}
          >
            最近一次
          </button>
          <button
            type="button"
            className={`chart-tab ${mode === 'average' ? 'active' : ''}`}
            onClick={() => setMode('average')}
          >
            历史平均
          </button>
        </>
      }
    >
      {option ? (
        <EChartsReactCore
          echarts={echarts}
          option={option}
          notMerge
          lazyUpdate
          style={{ height: 320, width: '100%' }}
        />
      ) : null}
    </ChartPanel>
  )
}
