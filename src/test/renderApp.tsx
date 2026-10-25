import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from '@tanstack/react-router'
import { AppProviders } from '../app/providers'
import { routeTree } from '../app/router'

/**
 * Render the full app (providers + shell + routes) against an in-memory history
 * so tests can target any initial route and act as any seeded identity.
 */
export function renderApp({
  initialPath = '/',
  initialIdentityId,
}: {
  initialPath?: string
  initialIdentityId?: string
} = {}) {
  const history = createMemoryHistory({ initialEntries: [initialPath] })
  const router = createRouter({ routeTree, history })
  return render(
    <AppProviders initialIdentityId={initialIdentityId}>
      <RouterProvider router={router} />
    </AppProviders>,
  )
}

/** Render an arbitrary element inside the app providers (no router). */
export function renderWithProviders(ui: ReactElement, initialIdentityId?: string) {
  return render(
    <AppProviders initialIdentityId={initialIdentityId}>{ui}</AppProviders>,
  )
}
