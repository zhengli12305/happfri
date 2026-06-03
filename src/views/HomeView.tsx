import { lazy, Suspense, useState } from 'react'
import HomeContent from '../components/HomeContent'
import './HomeView.css'

const UploadDrawer = lazy(() => import('../components/UploadDrawer'))

export default function HomeView() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <section className="home-page">
      <button type="button" className="upload-trigger" onClick={() => setIsDrawerOpen(true)}>
        传输文件
      </button>

      <HomeContent onOpenDrawer={() => setIsDrawerOpen(true)} />

      {isDrawerOpen && (
        <div
          className="drawer-mask"
          onClick={() => setIsDrawerOpen(false)}
          aria-hidden
        />
      )}
      {isDrawerOpen && (
        <Suspense fallback={null}>
          <UploadDrawer onClose={() => setIsDrawerOpen(false)} />
        </Suspense>
      )}
    </section>
  )
}
