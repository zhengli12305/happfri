import { useMemo } from 'react'
import echarts from '@/lib/echarts'
import type { QuizHistoryRecord } from '@/stores/gameTypes'
import { toAccuracyTrendOption } from '@/services/chartOptions'
import ChartPanel from './ChartPanel'
import EChartsReactCore from './EChartsCore'

interface AccuracyTrendChartProps {
  records: QuizHistoryRecord[]
}

export default function AccuracyTrendChart({ records }: AccuracyTrendChartProps) {
  const option = useMemo(() => toAccuracyTrendOption(records), [records])
  const isEmpty = !option

  return (
    <ChartPanel
      title="正确率趋势"
      description="按答题时间查看正确率变化"
      isEmpty={isEmpty}
      emptyMessage="再完成一次答题即可查看趋势"
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
