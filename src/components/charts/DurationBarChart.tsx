import { useMemo } from 'react'
import echarts from '@/lib/echarts'
import type { QuizHistoryRecord } from '@/stores/gameTypes'
import { toDurationBarOption } from '@/services/chartOptions'
import ChartPanel from './ChartPanel'
import EChartsReactCore from './EChartsCore'

interface DurationBarChartProps {
  records: QuizHistoryRecord[]
}

export default function DurationBarChart({ records }: DurationBarChartProps) {
  const option = useMemo(() => toDurationBarOption(records), [records])
  const isEmpty = !option

  return (
    <ChartPanel
      title="答题耗时"
      description="观察每次答题的总用时变化"
      isEmpty={isEmpty}
      emptyMessage="完成答题后可查看耗时统计"
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
