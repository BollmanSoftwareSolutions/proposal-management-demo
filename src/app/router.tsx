import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router'
import { AppShell } from '../components/layout/AppShell'
import { AboutPage } from '../pages/AboutPage'
import { DashboardPage } from '../pages/DashboardPage'
import { ProjectsPage } from '../pages/ProjectsPage'
import { ProjectDetailPage } from '../pages/ProjectDetailPage'
import { ProjectDetailTab } from '../pages/ProjectDetailTab'
import { VendorsPage } from '../pages/VendorsPage'
import { VendorDetailPage } from '../pages/VendorDetailPage'
import { ArtifactsPage } from '../pages/ArtifactsPage'
import { ProposalsPage } from '../pages/ProposalsPage'
import { NotInterestedPage } from '../pages/NotInterestedPage'
import { SharedArtifactsPage } from '../pages/SharedArtifactsPage'

/** Root route renders the app shell; child routes fill the content outlet. */
const rootRoute = createRootRoute({
  component: AppShell,
})

/** Landing route redirects to the role-aware dashboard. */
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/dashboard' })
  },
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
})

const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects',
  component: ProjectsPage,
})

const projectDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects/$projectId',
  component: ProjectDetailPage,
})

/** Default the project detail to its Setup tab. */
const projectDetailIndexRoute = createRoute({
  getParentRoute: () => projectDetailRoute,
  path: '/',
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/projects/$projectId/$tab',
      params: { projectId: params.projectId, tab: 'setup' },
    })
  },
})

const projectDetailTabRoute = createRoute({
  getParentRoute: () => projectDetailRoute,
  path: '$tab',
  component: ProjectDetailTab,
})

const vendorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vendors',
  component: VendorsPage,
})

const vendorDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vendors/$vendorId',
  component: VendorDetailPage,
})

const artifactsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/artifacts',
  component: ArtifactsPage,
})

const proposalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/proposals',
  component: ProposalsPage,
})

const notInterestedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/not-interested',
  component: NotInterestedPage,
})

const sharedArtifactsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shared-artifacts',
  component: SharedArtifactsPage,
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  dashboardRoute,
  projectsRoute,
  projectDetailRoute.addChildren([
    projectDetailIndexRoute,
    projectDetailTabRoute,
  ]),
  vendorsRoute,
  vendorDetailRoute,
  artifactsRoute,
  proposalsRoute,
  notInterestedRoute,
  sharedArtifactsRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
