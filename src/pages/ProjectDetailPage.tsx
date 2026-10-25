import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { Outlet, useParams, useRouterState } from '@tanstack/react-router'
import { LinkTab } from '../components/common/LinkTab'
import { ProjectStatusChip } from '../components/common/StatusChip'
import { useProjectQuery } from '../graphql/generated/graphql'
import { useRole } from '../roles/roleContext'

const TABS = [
  { label: 'Setup', segment: 'setup' },
  { label: 'Artifacts', segment: 'artifacts' },
  { label: 'Vendors', segment: 'vendors' },
  { label: 'Finalists', segment: 'finalists' },
] as const

/**
 * Project detail layout (`/projects/$projectId`). A deep-linkable tab strip
 * (Setup / Artifacts / Vendors / Finalists, §4.4) drives nested routes rendered
 * through the <Outlet />. The vendor view (§4.11) shares this structure; vendor
 * content is filled in Phase 4.
 */
export function ProjectDetailPage() {
  const { projectId } = useParams({ from: '/projects/$projectId' })
  const { hasRole } = useRole()
  const projectQuery = useProjectQuery({ id: projectId })
  const project = projectQuery.data?.project ?? null
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const base = `/projects/${projectId}`
  const active =
    TABS.map((t) => `${base}/${t.segment}`).find(
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
        {hasRole('Vendor') ? 'Proposal' : 'Project'}
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
        {TABS.map((t) => (
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
