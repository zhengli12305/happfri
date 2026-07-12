import type { ComponentType, CSSProperties } from 'react'
import * as EChartsCoreModule from 'echarts-for-react/lib/core'

export interface EChartsCoreProps {
  echarts: unknown
  option: unknown
  notMerge?: boolean
  lazyUpdate?: boolean
  style?: CSSProperties
}

function resolveEChartsCore(mod: typeof EChartsCoreModule): ComponentType<EChartsCoreProps> {
  const candidate = mod.default ?? mod
  if (typeof candidate === 'function') {
    return candidate as ComponentType<EChartsCoreProps>
  }

  const nested = (candidate as { default?: unknown }).default
  if (typeof nested === 'function') {
    return nested as ComponentType<EChartsCoreProps>
  }

  throw new Error('Failed to load echarts-for-react core component')
}

const EChartsReactCore = resolveEChartsCore(EChartsCoreModule)

export default EChartsReactCore
