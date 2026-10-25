import { setupServer } from 'msw/node'
import { handlers } from './handlers'

/** MSW server used by the Node/jsdom test environment. */
export const server = setupServer(...handlers)
