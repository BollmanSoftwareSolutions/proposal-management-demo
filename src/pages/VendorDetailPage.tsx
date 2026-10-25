import { useMemo } from 'react'
import Box from '@mui/material/Box'
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
import { useParams } from '@tanstack/react-router'
import {
  useAllProposalsQuery,
  useVendorQuery,
  type ProposalStatus,
} from '../graphql/generated/graphql'
import { AppLink } from '../components/common/AppLink'
import { QueryState } from '../components/common/QueryState'
import { ProposalStatusChip } from '../components/common/StatusChip'
import { formatCurrency, formatDate, formatRelative } from '../lib/format'

const STATUS_ORDER: ProposalStatus[] = [
  'SignedUp',
  'Submitted',
  'Filtered',
  'FollowUp',
  'Finalized',
  'Won',
  'Declined',
]

/** Vendor detail (procurement) — design-docs/04-ui-ux.md §4.6. */
export function VendorDetailPage() {
  const { vendorId } = useParams({ from: '/vendors/$vendorId' })
  const vendorQuery = useVendorQuery({ id: vendorId })
  const proposalsQuery = useAllProposalsQuery()

  const vendor = vendorQuery.data?.vendor ?? null

  const proposals = useMemo(
    () =>
      (proposalsQuery.data?.allProposals ?? []).filter(
        (p) => p.vendorId === vendorId,
      ),
    [proposalsQuery.data, vendorId],
  )

  const statusCounts = useMemo(() => {
    const counts = new Map<ProposalStatus, number>()
    for (const p of proposals) {
      counts.set(p.status, (counts.get(p.status) ?? 0) + 1)
    }
    return counts
  }, [proposals])

  const wonValue = proposals
    .filter((p) => p.status === 'Won')
    .reduce((sum, p) => sum + (p.project?.estimatedValue ?? 0), 0)

  return (
    <Box>
      <Typography variant="overline" color="text.secondary">
        Vendor
      </Typography>
      <QueryState
        isLoading={vendorQuery.isLoading}
        error={vendorQuery.error}
        isEmpty={!vendor}
        emptyMessage="Vendor not found."
      >
        {vendor && (
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4">
                {vendor.companyName ?? vendor.name}
              </Typography>
              <Typography color="text.secondary">{vendor.name}</Typography>
            </Box>

            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              useFlexGap
            >
              <Paper variant="outlined" sx={{ p: 2.5, flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Contact
                </Typography>
                <Stack spacing={0.5}>
                  <Typography variant="body2">
                    <strong>Email:</strong> {vendor.email}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {vendor.phone}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Jurisdiction:</strong> {vendor.jurisdiction ?? '—'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Last active:</strong>{' '}
                    {formatRelative(vendor.lastActive)}
                  </Typography>
                </Stack>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2.5, flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Activity
                </Typography>
                <Stack direction="row" spacing={4} sx={{ mb: 2 }}>
                  <Box>
                    <Typography variant="overline" color="text.secondary">
                      Projects won
                    </Typography>
                    <Typography variant="h5">
                      {statusCounts.get('Won') ?? 0}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="overline" color="text.secondary">
                      Est. value won
                    </Typography>
                    <Typography variant="h5">
                      {formatCurrency(wonValue)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="overline" color="text.secondary">
                      Total proposals
                    </Typography>
                    <Typography variant="h5">{proposals.length}</Typography>
                  </Box>
                </Stack>
                <Typography variant="overline" color="text.secondary">
                  By status
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{ flexWrap: 'wrap' }}
                >
                  {STATUS_ORDER.filter((s) => statusCounts.has(s)).map((s) => (
                    <Chip
                      key={s}
                      size="small"
                      label={`${s}: ${statusCounts.get(s)}`}
                    />
                  ))}
                  {statusCounts.size === 0 && (
                    <Typography color="text.secondary" variant="body2">
                      No proposals yet.
                    </Typography>
                  )}
                </Stack>
              </Paper>
            </Stack>

            <Box>
              <Typography variant="h6" gutterBottom>
                Projects signed up for
              </Typography>
              <QueryState
                isLoading={proposalsQuery.isLoading}
                error={proposalsQuery.error}
                isEmpty={proposals.length === 0}
                emptyMessage="This vendor has not signed up for any projects."
              >
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small" aria-label="Vendor projects">
                    <TableHead>
                      <TableRow>
                        <TableCell>Project</TableCell>
                        <TableCell>Proposal status</TableCell>
                        <TableCell align="right">Est. value</TableCell>
                        <TableCell>Signed up</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {proposals.map((proposal) => (
                        <TableRow key={proposal.id} hover>
                          <TableCell>
                            {proposal.project ? (
                              <AppLink
                                to="/projects/$projectId"
                                params={{ projectId: proposal.project.id }}
                              >
                                {proposal.project.name}
                              </AppLink>
                            ) : (
                              '—'
                            )}
                          </TableCell>
                          <TableCell>
                            <ProposalStatusChip status={proposal.status} />
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(
                              proposal.project?.estimatedValue ?? null,
                            )}
                          </TableCell>
                          <TableCell>
                            {formatDate(proposal.signedUpAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </QueryState>
            </Box>
          </Stack>
        )}
      </QueryState>
    </Box>
  )
}
