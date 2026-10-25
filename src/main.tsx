import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { AppProviders } from './app/providers'
import { router } from './app/router'
import './index.css'

async function enableMocking() {
  const { startMockServiceWorker } = await import('./mocks/browser')
  await startMockServiceWorker()
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </StrictMode>,
  )
})
