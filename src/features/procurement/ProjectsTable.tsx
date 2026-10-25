import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import type { ProjectFieldsFragment } from '../../graphql/generated/graphql'
import { AppLink } from '../../components/common/AppLink'
import { ProjectStatusChip } from '../../components/common/StatusChip'
import { formatCurrency } from '../../lib/format'

export function ProjectsTable({
  projects,
  dateColumnLabel,
  dateColumnValue,
}: {
  projects: ProjectFieldsFragment[]
  dateColumnLabel: string
  dateColumnValue: (project: ProjectFieldsFragment) => string
}) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="Projects">
        <TableHead>
          <TableRow>
            <TableCell>Project</TableCell>
            <TableCell>Area</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Estimated value</TableCell>
            <TableCell>{dateColumnLabel}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id} hover>
              <TableCell>
                <AppLink
                  to="/projects/$projectId"
                  params={{ projectId: project.id }}
                  sx={{ fontWeight: 600 }}
                >
                  {project.name}
                </AppLink>
              </TableCell>
              <TableCell>{project.area?.name ?? '—'}</TableCell>
              <TableCell>
                <ProjectStatusChip status={project.status} />
              </TableCell>
              <TableCell align="right">
                {formatCurrency(project.estimatedValue)}
              </TableCell>
              <TableCell>{dateColumnValue(project)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
