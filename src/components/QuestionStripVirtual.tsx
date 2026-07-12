import { useCallback, useEffect, useRef, useState } from 'react'

const STRIP_ITEM_WIDTH = 46
const STRIP_GAP = 10
const STRIP_UNIT = STRIP_ITEM_WIDTH + STRIP_GAP

interface QuestionStripVirtualProps {
  count: number
  activeNum: number
  onSelect: (num: number) => void
}

export default function QuestionStripVirtual({
  count,
  activeNum,
  onSelect,
}: QuestionStripVirtualProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [viewportWidth, setViewportWidth] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    const updateViewport = () => setViewportWidth(element.clientWidth)
    updateViewport()

    const observer = new ResizeObserver(updateViewport)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const element = scrollRef.current
    if (!element || count <= 0) return

    const targetLeft = (activeNum - 1) * STRIP_UNIT
    const maxScroll = Math.max(0, count * STRIP_UNIT - viewportWidth)
    const centerOffset = viewportWidth / 2 - STRIP_ITEM_WIDTH / 2
    const nextScroll = Math.min(maxScroll, Math.max(0, targetLeft - centerOffset))

    element.scrollTo({ left: nextScroll, behavior: 'smooth' })
  }, [activeNum, count, viewportWidth])

  const handleScroll = useCallback(() => {
    const element = scrollRef.current
    if (element) setScrollLeft(element.scrollLeft)
  }, [])

  if (count <= 0) return null

  const totalWidth = count * STRIP_UNIT - STRIP_GAP
  const startIndex = Math.max(0, Math.floor(scrollLeft / STRIP_UNIT) - 1)
  const visibleCount = Math.ceil(viewportWidth / STRIP_UNIT) + 3
  const endIndex = Math.min(count, startIndex + visibleCount)

  return (
    <div
      ref={scrollRef}
      className="question-strip question-strip-virtual"
      onScroll={handleScroll}
    >
      <div className="question-strip-inner" style={{ width: totalWidth }}>
        {Array.from({ length: endIndex - startIndex }, (_, offset) => {
          const index = startIndex + offset
          const num = index + 1
          return (
            <button
              key={num}
              type="button"
              className={`strip-item ${num === activeNum ? 'active' : ''}`}
              style={{ left: index * STRIP_UNIT }}
              onClick={() => onSelect(num)}
            >
              {num}
            </button>
          )
        })}
      </div>
    </div>
  )
}
