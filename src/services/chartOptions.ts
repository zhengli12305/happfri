import type { EChartsOption } from 'echarts'
import type { QuizHistoryRecord, TypeAccuracyItem } from '@/stores/gameTypes'
import {
  formatHistoryTimestamp,
  getTypeAccuracyByMode,
  type TypeAccuracyMode,
} from '@/services/quizHistoryTransform'

export function toAccuracyTrendOption(records: QuizHistoryRecord[]): EChartsOption | null {
  if (records.length < 2) return null

  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const item = Array.isArray(params) ? params[0] : params
        if (!item || typeof item.dataIndex !== 'number') return ''
        const record = records[item.dataIndex]
        if (!record) return ''
        return `${formatHistoryTimestamp(record.timestamp)}<br/>正确率：${record.accuracy}%`
      },
    },
    grid: { left: 48, right: 24, top: 32, bottom: 48 },
    xAxis: {
      type: 'category',
      data: records.map((record) => formatHistoryTimestamp(record.timestamp)),
      axisLabel: { rotate: records.length > 6 ? 30 : 0 },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: { formatter: '{value}%' },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        data: records.map((record) => record.accuracy),
        symbolSize: 8,
        lineStyle: { width: 3, color: '#2563eb' },
        itemStyle: { color: '#2563eb' },
        areaStyle: { color: 'rgba(37, 99, 235, 0.12)' },
      },
    ],
  }
}

export function toDurationBarOption(records: QuizHistoryRecord[]): EChartsOption | null {
  if (records.length < 1) return null

  return {
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const item = Array.isArray(params) ? params[0] : params
        if (!item || typeof item.dataIndex !== 'number') return ''
        const record = records[item.dataIndex]
        if (!record) return ''
        return `第 ${item.dataIndex + 1} 次<br/>耗时：${record.elapsedTime} 秒`
      },
    },
    grid: { left: 48, right: 24, top: 32, bottom: 48 },
    xAxis: {
      type: 'category',
      data: records.map((_, index) => `第 ${index + 1} 次`),
    },
    yAxis: {
      type: 'value',
      name: '秒',
      min: 0,
    },
    series: [
      {
        type: 'bar',
        data: records.map((record) => record.elapsedTime),
        barMaxWidth: 48,
        itemStyle: {
          color: '#0ea5e9',
          borderRadius: [6, 6, 0, 0],
        },
      },
    ],
  }
}

export function toTypeRadarOption(
  records: QuizHistoryRecord[],
  mode: TypeAccuracyMode,
): EChartsOption | null {
  if (records.length < 1) return null

  const typeAccuracy = getTypeAccuracyByMode(records, mode)
  const activeTypes = typeAccuracy.filter((item) => item.total > 0)
  const displayItems = activeTypes.length > 0 ? activeTypes : typeAccuracy

  return {
    tooltip: { trigger: 'item' },
    radar: {
      indicator: displayItems.map((item: TypeAccuracyItem) => ({
        name: item.label,
        max: 100,
      })),
      radius: '62%',
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: displayItems.map((item) => item.accuracy),
            name: mode === 'latest' ? '最近一次' : '历史平均',
            areaStyle: { color: 'rgba(14, 165, 233, 0.25)' },
            lineStyle: { color: '#0284c7', width: 2 },
            itemStyle: { color: '#0284c7' },
          },
        ],
      },
    ],
  }
}
