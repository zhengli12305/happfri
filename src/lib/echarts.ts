import * as echarts from 'echarts/core'
import { BarChart, LineChart, RadarChart } from 'echarts/charts'
import {
  GridComponent,
  RadarComponent,
  TooltipComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  LineChart,
  BarChart,
  RadarChart,
  GridComponent,
  RadarComponent,
  TooltipComponent,
  CanvasRenderer,
])

export default echarts
