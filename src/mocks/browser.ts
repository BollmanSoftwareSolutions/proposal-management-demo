import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

/** Start the MSW worker. Safe to call once during app bootstrap. */
export async function startMockServiceWorker() {
  await worker.start({
    onUnhandledFrame: 'bypass',
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
    },
  })
}
