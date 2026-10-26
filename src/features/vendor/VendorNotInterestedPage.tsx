import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { useQueryClient } from '@tanstack/react-query'
import {
  useAvailableProjectsQuery,
  useNotInterestedProjectsQuery,
  useReconsiderProjectMutation,
} from '../../graphql/generated/graphql'
import { QueryState } from '../../components/common/QueryState'
import { formatCurrency, formatDate } from '../../lib/format'
import { errorMessage } from '../../lib/errors'

/**
 * Not Interested list for vendors (design-docs/04-ui-ux.md §4.12): projects the
 * vendor reviewed and skipped. They are hidden from Projects and Proposals; the
 * vendor can reconsider to move a project back into the available list.
 */
export function VendorNotInterestedPage() {
  const queryClient = useQueryClient()
  const projectsQuery = useNotInterestedProjectsQuery()
  const projects = projectsQuery.data?.notInterestedProjects ?? []

  const reconsider = useReconsiderProjectMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: useNotInterestedProjectsQuery.getKey(),
      })
      queryClient.invalidateQueries({
        queryKey: useAvailableProjectsQuery.getKey(),
      })
    },
  })

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Not Interested
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Projects you skipped. They are hidden from Projects and Proposals.
        Reconsider to move one back into your available projects.
      </Typography>

      <QueryState
        isLoading={projectsQuery.isLoading}
        error={projectsQuery.error}
        isEmpty={projects.length === 0}
        emptyMessage="You have not marked any projects as not interested."
      >
        <TableContainer component={Paper} variant="outlined">
          <Table size="small" aria-label="Not interested projects">
            <TableHead>
              <TableRow>
                <TableCell>Project</TableCell>
                <TableCell>Area</TableCell>
                <TableCell align="right">Estimated value</TableCell>
                <TableCell>Closes</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {project.name}
                  </TableCell>
                  <TableCell>{project.area?.name ?? '—'}</TableCell>
                  <TableCell align="right">
                    {formatCurrency(project.estimatedValue)}
                  </TableCell>
                  <TableCell>{formatDate(project.closeDate)}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={reconsider.isPending}
                      onClick={() =>
                        reconsider.mutate({ projectId: project.id })
                      }
                    >
                      Reconsider
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </QueryState>

      {reconsider.error != null && (
        <Typography color="error" sx={{ mt: 2 }}>
          {errorMessage(reconsider.error, 'Could not reconsider the project.')}
        </Typography>
      )}
    </Box>
  )
}
