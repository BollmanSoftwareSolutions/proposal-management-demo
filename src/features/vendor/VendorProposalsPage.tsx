import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { useMyProposalsQuery } from '../../graphql/generated/graphql'
import { QueryState } from '../../components/common/QueryState'
import { AppLink } from '../../components/common/AppLink'
import { ProposalStatusChip } from '../../components/common/StatusChip'
import { formatCurrency, formatDate } from '../../lib/format'

/**
 * Proposals list for vendors (design-docs/04-ui-ux.md §4.10): projects the
 * vendor signed up for. Each row links to the project detail (vendor view) where
 * artifacts are completed.
 */
export function VendorProposalsPage() {
  const proposalsQuery = useMyProposalsQuery()
  const proposals = proposalsQuery.data?.myProposals ?? []

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Proposals
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Projects you signed up for. Open a proposal to complete its artifacts and
        add supporting items.
      </Typography>

      <QueryState
        isLoading={proposalsQuery.isLoading}
        error={proposalsQuery.error}
        isEmpty={proposals.length === 0}
        emptyMessage="You have not signed up for any projects yet."
      >
        <TableContainer component={Paper} variant="outlined">
          <Table size="small" aria-label="My proposals">
            <TableHead>
              <TableRow>
                <TableCell>Project</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Estimated value</TableCell>
                <TableCell>Closes</TableCell>
                <TableCell>Signed up</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proposals.map((proposal) => (
                <TableRow key={proposal.id} hover>
                  <TableCell>
                    <AppLink
                      to="/projects/$projectId"
                      params={{ projectId: proposal.projectId }}
                      sx={{ fontWeight: 600 }}
                    >
                      {proposal.project?.name ?? 'Project'}
                    </AppLink>
                  </TableCell>
                  <TableCell>
                    <ProposalStatusChip status={proposal.status} />
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(proposal.project?.estimatedValue)}
                  </TableCell>
                  <TableCell>
                    {formatDate(proposal.project?.closeDate)}
                  </TableCell>
                  <TableCell>{formatDate(proposal.signedUpAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </QueryState>
    </Box>
  )
}
