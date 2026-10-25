import { useMemo } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import {
  useAllProposalsQuery,
  useVendorsQuery,
} from '../graphql/generated/graphql'
import { AppLink } from '../components/common/AppLink'
import { QueryState } from '../components/common/QueryState'
import { formatCurrency, formatRelative } from '../lib/format'

const ACTIVE_STATUSES = new Set([
  'SignedUp',
  'Submitted',
  'Filtered',
  'FollowUp',
  'Finalized',
])

/** Vendors list (procurement) — design-docs/04-ui-ux.md §4.5. */
export function VendorsPage() {
  const vendorsQuery = useVendorsQuery()
  const proposalsQuery = useAllProposalsQuery()

  const metrics = useMemo(() => {
    const map = new Map<
      string,
      { won: number; wonValue: number; active: number }
    >()
    for (const proposal of proposalsQuery.data?.allProposals ?? []) {
      const entry = map.get(proposal.vendorId) ?? {
        won: 0,
        wonValue: 0,
        active: 0,
      }
      if (proposal.status === 'Won') {
        entry.won += 1
        entry.wonValue += proposal.project?.estimatedValue ?? 0
      }
      if (ACTIVE_STATUSES.has(proposal.status)) {
        entry.active += 1
      }
      map.set(proposal.vendorId, entry)
    }
    return map
  }, [proposalsQuery.data])

  const vendors = vendorsQuery.data?.vendors ?? []

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Vendors
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        All registered vendors with activity and award history. Select a vendor
        to view their detail.
      </Typography>

      <QueryState
        isLoading={vendorsQuery.isLoading || proposalsQuery.isLoading}
        error={vendorsQuery.error ?? proposalsQuery.error}
        isEmpty={vendors.length === 0}
        emptyMessage="No vendors registered."
      >
        <TableContainer component={Paper} variant="outlined">
          <Table size="small" aria-label="Vendors">
            <TableHead>
              <TableRow>
                <TableCell>Vendor</TableCell>
                <TableCell>Last active</TableCell>
                <TableCell align="right">Projects won</TableCell>
                <TableCell align="right">Est. value won</TableCell>
                <TableCell align="right">Signed up (active)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vendors.map((vendor) => {
                const m = metrics.get(vendor.id) ?? {
                  won: 0,
                  wonValue: 0,
                  active: 0,
                }
                return (
                  <TableRow key={vendor.id} hover>
                    <TableCell>
                      <AppLink
                        to="/vendors/$vendorId"
                        params={{ vendorId: vendor.id }}
                        sx={{ fontWeight: 600 }}
                      >
                        {vendor.companyName ?? vendor.name}
                      </AppLink>
                      <Typography variant="body2" color="text.secondary">
                        {vendor.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatRelative(vendor.lastActive)}</TableCell>
                    <TableCell align="right">{m.won}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(m.wonValue)}
                    </TableCell>
                    <TableCell align="right">{m.active}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </QueryState>
    </Box>
  )
}
