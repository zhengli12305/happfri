import type { ReactNode } from 'react'
import './ChartPanel.css'

interface ChartPanelProps {
  title: string
  description?: string
  actions?: ReactNode
  emptyMessage?: string
  isEmpty?: boolean
  children: ReactNode
}

export default function ChartPanel({
  title,
  description,
  actions,
  emptyMessage,
  isEmpty = false,
  children,
}: ChartPanelProps) {
  return (
    <section className="chart-panel">
      <div className="chart-panel-header">
        <div>
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {actions ? <div className="chart-panel-actions">{actions}</div> : null}
      </div>
      {isEmpty ? (
        <div className="chart-empty">{emptyMessage ?? '暂无数据'}</div>
      ) : (
        <div className="chart-canvas">{children}</div>
      )}
    </section>
  )
}
