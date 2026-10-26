import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { Outlet, useParams, useRouterState } from '@tanstack/react-router'
import { LinkTab } from '../components/common/LinkTab'
import { ProjectStatusChip } from '../components/common/StatusChip'
import { useProjectQuery } from '../graphql/generated/graphql'
import { useRole } from '../roles/roleContext'

const PROCUREMENT_TABS = [
  { label: 'Setup', segment: 'setup' },
  { label: 'Artifacts', segment: 'artifacts' },
  { label: 'Vendors', segment: 'vendors' },
  { label: 'Finalists', segment: 'finalists' },
] as const

const VENDOR_TABS = [
  { label: 'Overview', segment: 'setup' },
  { label: 'Artifacts', segment: 'artifacts' },
  { label: 'Additional items', segment: 'items' },
] as const

/**
 * Project detail layout (`/projects/$projectId`). A deep-linkable tab strip
 * drives nested routes rendered through the <Outlet />. Procurement sees Setup /
 * Artifacts / Vendors / Finalists (§4.4); vendors see Overview / Artifacts /
 * Additional items (§4.11).
 */
export function ProjectDetailPage() {
  const { projectId } = useParams({ from: '/projects/$projectId' })
  const { hasRole } = useRole()
  const isVendor = hasRole('Vendor')
  const tabs = isVendor ? VENDOR_TABS : PROCUREMENT_TABS
  const projectQuery = useProjectQuery({ id: projectId })
  const project = projectQuery.data?.project ?? null
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const base = `/projects/${projectId}`
  const active =
    tabs.map((t) => `${base}/${t.segment}`).find(
      (to) => pathname === to || pathname.startsWith(`${to}/`),
    ) ?? false

  const heading = project
    ? project.name
    : projectQuery.isLoading
      ? 'Loading…'
      : `Project ${projectId}`

  return (
    <Box>
      <Typography variant="overline" color="text.secondary">
        {isVendor ? 'Proposal' : 'Project'}
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        sx={{ alignItems: 'center', flexWrap: 'wrap', mb: 1 }}
      >
        <Typography variant="h4">{heading}</Typography>
        {project && <ProjectStatusChip status={project.status} />}
      </Stack>
      {project && (
        <Typography color="text.secondary" sx={{ mb: 1 }}>
          {project.area?.name}
        </Typography>
      )}
      <Tabs
        value={active}
        variant="scrollable"
        allowScrollButtonsMobile
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        {tabs.map((t) => (
          <LinkTab
            key={t.segment}
            label={t.label}
            value={`${base}/${t.segment}`}
            to="/projects/$projectId/$tab"
            params={{ projectId, tab: t.segment }}
          />
        ))}
      </Tabs>
      <Outlet />
    </Box>
  )
}
