import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

// Sobe o Service Worker do MSW antes do app montar.
export async function enableMocking() {
  await worker.start({ onUnhandledRequest: 'bypass' })
}
