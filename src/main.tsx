import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@/config/rem'
import '@/style/common.css'
import '@/style/app.css'
import App from './App'
import { hydrateGameStoreFromSession } from './stores/game'

hydrateGameStoreFromSession()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
