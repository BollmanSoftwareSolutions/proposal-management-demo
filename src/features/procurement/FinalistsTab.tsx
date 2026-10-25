import { useMemo } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { useQueryClient } from '@tanstack/react-query'
import {
  useApproveFinalMutation,
  useProjectFinalistsQuery,
  useProjectProposalsQuery,
  useRankFinalistMutation,
} from '../../graphql/generated/graphql'
import { QueryState } from '../../components/common/QueryState'
import {
  FinalistStatusChip,
  ProposalStatusChip,
} from '../../components/common/StatusChip'
import { useRole } from '../../roles/roleContext'

export function FinalistsTab({ projectId }: { projectId: string }) {
  const { hasRole } = useRole()
  const queryClient = useQueryClient()
  const finalistsQuery = useProjectFinalistsQuery({ projectId })
  const proposalsQuery = useProjectProposalsQuery({ projectId })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['ProjectFinalists', { projectId }] })
    queryClient.invalidateQueries({ queryKey: ['ProjectProposals', { projectId }] })
    queryClient.invalidateQueries({ queryKey: ['AllProposals'] })
    queryClient.invalidateQueries({ queryKey: ['Dashboard'] })
  }

  const rankFinalist = useRankFinalistMutation({ onSuccess: invalidate })
  const approveFinal = useApproveFinalMutation({ onSuccess: invalidate })

  const finalists = finalistsQuery.data?.projectFinalists ?? []

  const proposalByVendor = useMemo(() => {
    const map = new Map<string, { id: string; status: string }>()
    for (const p of proposalsQuery.data?.projectProposals ?? []) {
      map.set(p.vendorId, { id: p.id, status: p.status })
    }
    return map
  }, [proposalsQuery.data])

  const actionError = rankFinalist.error ?? approveFinal.error

  return (
    <QueryState
      isLoading={finalistsQuery.isLoading}
      error={finalistsQuery.error}
      isEmpty={finalists.length === 0}
      emptyMessage="No finalists yet. Rank follow-up vendors from the Vendors tab."
    >
      <Stack spacing={2}>
        <Typography color="text.secondary">
          Ranked finalists for this project. Officers adjust ranking; the Lead
          approves the top vendor to send to legal.
        </Typography>

        {Boolean(actionError) && (
          <Alert severity="error">
            {actionError instanceof Error
              ? actionError.message
              : 'Action failed.'}
          </Alert>
        )}

        <TableContainer component={Paper} variant="outlined">
          <Table size="small" aria-label="Finalists">
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Finalist status</TableCell>
                <TableCell>Proposal</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {finalists.map((finalist, index) => {
                const proposal = proposalByVendor.get(finalist.vendorId)
                const vendorName =
                  finalist.vendor?.companyName ??
                  finalist.vendor?.name ??
                  finalist.vendorId
                return (
                  <TableRow key={finalist.id}>
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{ alignItems: 'center' }}
                      >
                        <span>{finalist.rank}</span>
                        {hasRole('Officer') && (
                          <Box>
                            <IconButton
                              size="small"
                              aria-label="Move up"
                              disabled={index === 0 || rankFinalist.isPending}
                              onClick={() =>
                                rankFinalist.mutate({
                                  projectId,
                                  vendorId: finalist.vendorId,
                                  rank: Math.max(1, finalist.rank - 1),
                                })
                              }
                            >
                              <ArrowUpwardIcon fontSize="inherit" />
                            </IconButton>
                            <IconButton
                              size="small"
                              aria-label="Move down"
                              disabled={rankFinalist.isPending}
                              onClick={() =>
                                rankFinalist.mutate({
                                  projectId,
                                  vendorId: finalist.vendorId,
                                  rank: finalist.rank + 1,
                                })
                              }
                            >
                              <ArrowDownwardIcon fontSize="inherit" />
                            </IconButton>
                          </Box>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{vendorName}</TableCell>
                    <TableCell>
                      <FinalistStatusChip status={finalist.status} />
                    </TableCell>
                    <TableCell>
                      {proposal ? (
                        <ProposalStatusChip
                          status={
                            proposal.status as Parameters<
                              typeof ProposalStatusChip
                            >[0]['status']
                          }
                        />
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {proposal?.status === 'Finalized' && hasRole('Lead') && (
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ justifyContent: 'flex-end' }}
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            onClick={() =>
                              approveFinal.mutate({
                                proposalId: proposal.id,
                                approve: true,
                              })
                            }
                          >
                            Send to legal
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() =>
                              approveFinal.mutate({
                                proposalId: proposal.id,
                                approve: false,
                              })
                            }
                          >
                            Decline
                          </Button>
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </QueryState>
  )
}
