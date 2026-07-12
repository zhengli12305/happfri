import { useEffect, useRef, useState, type ReactNode } from 'react'

interface LazyWhenVisibleProps {
  children: ReactNode
  minHeight?: number
  className?: string
}

export default function LazyWhenVisible({
  children,
  minHeight = 320,
  className,
}: LazyWhenVisibleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '120px 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className={className} style={{ minHeight }}>
      {isVisible ? children : null}
    </div>
  )
}
