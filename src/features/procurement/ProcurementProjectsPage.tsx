import { useState } from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { useProjectsQuery } from '../../graphql/generated/graphql'
import { QueryState } from '../../components/common/QueryState'
import { CreateProjectForm } from './CreateProjectForm'
import { ProjectsTable } from './ProjectsTable'
import { nextSegmentEnd, solicitationOpen } from './projectSort'
import { formatDate } from '../../lib/format'

/**
 * Projects list for procurement (design-docs/04-ui-ux.md §4.3): Active (every
 * project that is neither Draft nor Closed), In development (Draft only), Closed
 * (Closed only), and Create new project tabs.
 */
export function ProcurementProjectsPage() {
  const [tab, setTab] = useState(0)
  const projectsQuery = useProjectsQuery({})

  const all = projectsQuery.data?.projects ?? []
  const active = all
    .filter((p) => p.status !== 'Draft' && p.status !== 'Closed')
    .slice()
    .sort((a, b) => nextSegmentEnd(a) - nextSegmentEnd(b))
  const inDevelopment = all
    .filter((p) => p.status === 'Draft')
    .slice()
    .sort((a, b) => solicitationOpen(a) - solicitationOpen(b))
  const closed = all
    .filter((p) => p.status === 'Closed')
    .slice()
    .sort((a, b) => solicitationOpen(a) - solicitationOpen(b))

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Projects
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Manage procurement projects: review active and in-legal solicitations,
        in-development drafts, closed projects, and create new projects.
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        <Tab label={`Active (${active.length})`} />
        <Tab label={`In development (${inDevelopment.length})`} />
        <Tab label={`Closed (${closed.length})`} />
        <Tab label="Create new project" />
      </Tabs>

      {tab === 0 && (
        <QueryState
          isLoading={projectsQuery.isLoading}
          error={projectsQuery.error}
          isEmpty={active.length === 0}
          emptyMessage="No active projects. Activate a draft to publish it."
        >
          <ProjectsTable
            projects={active}
            dateColumnLabel="Next segment ends"
            dateColumnValue={(p) => {
              const end = nextSegmentEnd(p)
              return Number.isFinite(end)
                ? formatDate(new Date(end).toISOString())
                : '—'
            }}
          />
        </QueryState>
      )}

      {tab === 1 && (
        <QueryState
          isLoading={projectsQuery.isLoading}
          error={projectsQuery.error}
          isEmpty={inDevelopment.length === 0}
          emptyMessage="No in-development projects."
        >
          <ProjectsTable
            projects={inDevelopment}
            dateColumnLabel="Solicitation opens"
            dateColumnValue={(p) =>
              formatDate(new Date(solicitationOpen(p)).toISOString())
            }
          />
        </QueryState>
      )}

      {tab === 2 && (
        <QueryState
          isLoading={projectsQuery.isLoading}
          error={projectsQuery.error}
          isEmpty={closed.length === 0}
          emptyMessage="No closed projects."
        >
          <ProjectsTable
            projects={closed}
            dateColumnLabel="Solicitation opens"
            dateColumnValue={(p) =>
              formatDate(new Date(solicitationOpen(p)).toISOString())
            }
          />
        </QueryState>
      )}

      {tab === 3 && <CreateProjectForm />}
    </Box>
  )
}
