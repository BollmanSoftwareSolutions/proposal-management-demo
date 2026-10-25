import type { RequestHandler } from 'msw'

/**
 * Request handlers for the mocked backend. Populated in Phase 1 with the
 * GraphQL query/mutation handlers (design-docs/05-mock-api.md).
 */
export const handlers: RequestHandler[] = []
