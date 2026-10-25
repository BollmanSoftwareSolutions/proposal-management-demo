import '@testing-library/jest-dom/vitest'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import { server } from '../mocks/server'
import { resetStore } from '../mocks/store/store'
import { setLatencyEnabled } from '../mocks/resolvers/access'
import { setCurrentUserId, setGraphQLEndpoint } from '../graphql/identity'

// Deterministic, fast tests: no artificial latency and an absolute endpoint so
// the Node fetch used in jsdom resolves against the MSW server.
setLatencyEnabled(false)
setGraphQLEndpoint('http://localhost/graphql')

beforeAll(() => server.listen({ onUnhandledFrame: 'bypass' }))

afterEach(() => {
  cleanup()
  server.resetHandlers()
  resetStore()
  setCurrentUserId(null)
})

afterAll(() => server.close())
