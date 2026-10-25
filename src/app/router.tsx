import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import Typography from '@mui/material/Typography'
import { AppShell } from '../components/layout/AppShell'

/** Root route renders the app shell; child routes fill the content outlet. */
const rootRoute = createRootRoute({
  component: AppShell,
})

/**
 * Phase 0 placeholder landing route. The full route map
 * (design-docs/04-ui-ux.md §3) is built out in Phase 2.
 */
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function IndexPage() {
    return (
      <>
        <Typography variant="h4" gutterBottom>
          Vendor Proposal Management
        </Typography>
        <Typography color="text.secondary">
          Foundations are in place. Features arrive in later phases.
        </Typography>
      </>
    )
  },
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: function AboutPage() {
    return (
      <>
        <Typography variant="h4" gutterBottom>
          About this demo
        </Typography>
        <Typography color="text.secondary">
          A client-only SPA with an in-memory, mocked backend.
        </Typography>
      </>
    )
  },
})

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
