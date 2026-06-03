import { lazy, Suspense, type ReactNode } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'

const HomeView = lazy(() => import('../views/HomeView'))
const UploadView = lazy(() => import('../views/UploadView'))
const ItemView = lazy(() => import('../views/ItemView'))
const ScoreView = lazy(() => import('../views/ScoreView'))
const AnswerCardView = lazy(() => import('../views/AnswerCardView'))
const AnswerDetailView = lazy(() => import('../views/AnswerDetailView'))

function withSuspense(element: ReactNode) {
  return <Suspense fallback={null}>{element}</Suspense>
}

export const routes: RouteObject[] = [
  {
    path: '/',
    element: withSuspense(<HomeView />),
  },
  {
    path: '/upload',
    element: withSuspense(<UploadView />),
  },
  {
    path: '/home',
    element: <Navigate to="/" replace />,
  },
  {
    path: '/item',
    element: withSuspense(<ItemView />),
  },
  {
    path: '/score',
    element: withSuspense(<ScoreView />),
  },
  {
    path: '/answer-card',
    element: withSuspense(<AnswerCardView />),
  },
  {
    path: '/answer-card/:index',
    element: withSuspense(<AnswerDetailView />),
  },
]
