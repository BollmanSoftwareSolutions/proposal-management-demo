import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { Outlet, useParams, useRouterState } from '@tanstack/react-router'
import { LinkTab } from '../components/common/LinkTab'
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
 * through the <Outlet />. The vendor view (§4.11) shares this structure; content
 * is filled in Phases 3 and 4.
 */
export function ProjectDetailPage() {
  const { projectId } = useParams({ from: '/projects/$projectId' })
  const { hasRole } = useRole()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const base = `/projects/${projectId}`
  const active =
    TABS.map((t) => `${base}/${t.segment}`).find(
      (to) => pathname === to || pathname.startsWith(`${to}/`),
    ) ?? false

  return (
    <Box>
      <Typography variant="overline" color="text.secondary">
        {hasRole('Vendor') ? 'Proposal' : 'Project'}
      </Typography>
      <Typography variant="h4" gutterBottom>
        Project {projectId}
      </Typography>
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
