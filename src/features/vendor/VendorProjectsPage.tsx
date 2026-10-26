import { useMemo } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
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
  useMarkNotInterestedMutation,
  useMyProposalsQuery,
  useMySolicitationsQuery,
  useNotInterestedProjectsQuery,
  useSignUpMutation,
} from '../../graphql/generated/graphql'
import { QueryState } from '../../components/common/QueryState'
import { AppLink } from '../../components/common/AppLink'
import { formatCurrency, formatDate } from '../../lib/format'
import { errorMessage } from '../../lib/errors'

/**
 * Projects list for vendors (design-docs/04-ui-ux.md §4.9): projects the vendor
 * has not signed up for. Solicited projects are pinned to the top; the rest are
 * ordered by closing date descending. Each row offers Sign up / Not interested.
 */
export function VendorProjectsPage() {
  const queryClient = useQueryClient()
  const projectsQuery = useAvailableProjectsQuery()
  const solicitationsQuery = useMySolicitationsQuery()

  const solicitedIds = useMemo(
    () =>
      new Set(
        (solicitationsQuery.data?.mySolicitations ?? []).map(
          (s) => s.projectId,
        ),
      ),
    [solicitationsQuery.data],
  )

  const projects = useMemo(() => {
    const list = projectsQuery.data?.availableProjects ?? []
    return list.slice().sort((a, b) => {
      const aSolicited = solicitedIds.has(a.id)
      const bSolicited = solicitedIds.has(b.id)
      if (aSolicited !== bSolicited) return aSolicited ? -1 : 1
      return new Date(b.closeDate).getTime() - new Date(a.closeDate).getTime()
    })
  }, [projectsQuery.data, solicitedIds])

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: useAvailableProjectsQuery.getKey(),
    })
    queryClient.invalidateQueries({ queryKey: useMyProposalsQuery.getKey() })
    queryClient.invalidateQueries({
      queryKey: useNotInterestedProjectsQuery.getKey(),
    })
    queryClient.invalidateQueries({
      queryKey: useMySolicitationsQuery.getKey(),
    })
  }

  const signUp = useSignUpMutation({ onSuccess: invalidate })
  const notInterested = useMarkNotInterestedMutation({ onSuccess: invalidate })
  const pending = signUp.isPending || notInterested.isPending
  const actionError = signUp.error ?? notInterested.error

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Projects
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Open solicitations you have not signed up for. Projects you were invited
        to are pinned to the top. Sign up to start a proposal, or mark a project
        not interested to hide it.
      </Typography>

      <QueryState
        isLoading={projectsQuery.isLoading || solicitationsQuery.isLoading}
        error={projectsQuery.error ?? solicitationsQuery.error}
        isEmpty={projects.length === 0}
        emptyMessage="No open solicitations available right now."
      >
        <TableContainer component={Paper} variant="outlined">
          <Table size="small" aria-label="Available projects">
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
                  <TableCell>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: 'center' }}
                    >
                      <AppLink
                        to="/projects/$projectId"
                        params={{ projectId: project.id }}
                        sx={{ fontWeight: 600 }}
                      >
                        {project.name}
                      </AppLink>
                      {solicitedIds.has(project.id) && (
                        <Chip
                          size="small"
                          color="info"
                          variant="outlined"
                          label="Invited"
                        />
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>{project.area?.name ?? '—'}</TableCell>
                  <TableCell align="right">
                    {formatCurrency(project.estimatedValue)}
                  </TableCell>
                  <TableCell>{formatDate(project.closeDate)}</TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ justifyContent: 'flex-end' }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        disabled={pending}
                        onClick={() => signUp.mutate({ projectId: project.id })}
                      >
                        Sign up
                      </Button>
                      <Button
                        size="small"
                        color="inherit"
                        disabled={pending}
                        onClick={() =>
                          notInterested.mutate({ projectId: project.id })
                        }
                      >
                        Not interested
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </QueryState>

      {actionError != null && (
        <Typography color="error" sx={{ mt: 2 }}>
          {errorMessage(actionError, 'Action failed. Please try again.')}
        </Typography>
      )}
    </Box>
  )
}
