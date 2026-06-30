import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppProviders } from './app/providers'
import { enableMocking } from './mocks/browser'

// Esperamos o MSW iniciar antes de renderizar, senão as primeiras
// chamadas (ex: /health) podem escapar sem ser interceptadas.
enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AppProviders />
    </StrictMode>,
  )
})
