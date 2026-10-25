import { useMemo, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import { useQueryClient } from '@tanstack/react-query'
import {
  useApproveRoundMutation,
  useFilterProposalMutation,
  useProjectNotInterestedVendorsQuery,
  useProjectProposalsQuery,
  useProjectSolicitationsQuery,
  useRankFinalistMutation,
  useSolicitVendorMutation,
  useVendorsQuery,
  type ProposalFieldsFragment,
} from '../../graphql/generated/graphql'
import { QueryState } from '../../components/common/QueryState'
import {
  ProposalStatusChip,
  VendorParticipationChip,
} from '../../components/common/StatusChip'
import { formatDate } from '../../lib/format'
import { useRole } from '../../roles/roleContext'

type Participant = {
  key: string
  vendorId: string
  vendorName: string
  participation: 'Solicited' | 'SignedUp' | 'Declined'
  solicitedAt?: string
  proposal?: ProposalFieldsFragment
}

export function VendorsTab({ projectId }: { projectId: string }) {
  const { hasRole } = useRole()
  const queryClient = useQueryClient()
  const proposalsQuery = useProjectProposalsQuery({ projectId })
  const solicitationsQuery = useProjectSolicitationsQuery({ projectId })
  const declinedQuery = useProjectNotInterestedVendorsQuery({ projectId })
  const vendorsQuery = useVendorsQuery()

  const vendorName = useMemo(() => {
    const map = new Map<string, string>()
    for (const v of vendorsQuery.data?.vendors ?? []) {
      map.set(v.id, v.companyName ?? v.name)
    }
    return map
  }, [vendorsQuery.data])

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['ProjectProposals', { projectId }] })
    queryClient.invalidateQueries({ queryKey: ['ProjectFinalists', { projectId }] })
    queryClient.invalidateQueries({ queryKey: ['AllProposals'] })
    queryClient.invalidateQueries({ queryKey: ['Dashboard'] })
  }

  const filterProposal = useFilterProposalMutation({ onSuccess: invalidate })
  const approveRound = useApproveRoundMutation({ onSuccess: invalidate })
  const rankFinalist = useRankFinalistMutation({ onSuccess: invalidate })
  const solicitVendor = useSolicitVendorMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ProjectSolicitations', { projectId }],
      })
      setSolicitOpen(false)
      setSolicitVendorId('')
    },
  })

  const [solicitOpen, setSolicitOpen] = useState(false)
  const [solicitVendorId, setSolicitVendorId] = useState('')

  const participants = useMemo<Participant[]>(() => {
    const proposals = proposalsQuery.data?.projectProposals ?? []
    const solicitations = solicitationsQuery.data?.projectSolicitations ?? []
    const declined = declinedQuery.data?.projectNotInterestedVendors ?? []

    const signedUpVendorIds = new Set(proposals.map((p) => p.vendorId))
    const declinedVendorIds = new Set(declined.map((v) => v.id))

    const result: Participant[] = proposals.map((proposal) => ({
      key: proposal.id,
      vendorId: proposal.vendorId,
      vendorName:
        proposal.vendor?.companyName ?? proposal.vendor?.name ?? 'Vendor',
      participation: 'SignedUp',
      proposal,
    }))

    for (const vendor of declined) {
      if (!signedUpVendorIds.has(vendor.id)) {
        result.push({
          key: `declined-${vendor.id}`,
          vendorId: vendor.id,
          vendorName: vendor.companyName ?? vendor.name,
          participation: 'Declined',
        })
      }
    }

    for (const solicitation of solicitations) {
      if (
        !signedUpVendorIds.has(solicitation.vendorId) &&
        !declinedVendorIds.has(solicitation.vendorId)
      ) {
        result.push({
          key: `solicited-${solicitation.id}`,
          vendorId: solicitation.vendorId,
          vendorName:
            vendorName.get(solicitation.vendorId) ?? solicitation.vendorId,
          participation: 'Solicited',
          solicitedAt: solicitation.invitedAt,
        })
      }
    }

    return result
  }, [
    proposalsQuery.data,
    solicitationsQuery.data,
    declinedQuery.data,
    vendorName,
  ])

  const nextFinalistRank = () =>
    (proposalsQuery.data?.projectProposals.filter(
      (p) => p.status === 'Finalized',
    ).length ?? 0) + 1

  const eligibleToSolicit = useMemo(() => {
    const participantIds = new Set(participants.map((p) => p.vendorId))
    return (vendorsQuery.data?.vendors ?? []).filter(
      (v) => !participantIds.has(v.id),
    )
  }, [participants, vendorsQuery.data])

  const isLoading =
    proposalsQuery.isLoading ||
    solicitationsQuery.isLoading ||
    declinedQuery.isLoading

  const actionError =
    filterProposal.error ??
    approveRound.error ??
    rankFinalist.error ??
    solicitVendor.error

  return (
    <QueryState isLoading={isLoading} error={proposalsQuery.error}>
      <Stack spacing={2}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            alignItems: 'flex-start',
          }}
        >
          <Typography color="text.secondary">
            Vendors associated with this project, their proposal status, artifact
            submissions, and any additional uploaded items.
          </Typography>
          {hasRole('Officer') && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setSolicitOpen(true)}
              disabled={eligibleToSolicit.length === 0}
              sx={{ flexShrink: 0 }}
            >
              Solicit vendor
            </Button>
          )}
        </Box>

        {Boolean(actionError) && (
          <Alert severity="error">
            {actionError instanceof Error
              ? actionError.message
              : 'Action failed.'}
          </Alert>
        )}

        {participants.length === 0 && (
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              textAlign: 'center',
              borderStyle: 'dashed',
              bgcolor: 'background.default',
            }}
          >
            <Typography color="text.secondary">
              No vendors have been solicited or signed up yet.
            </Typography>
          </Paper>
        )}

        {participants.map((participant) => {
          const proposal = participant.proposal
          const status = proposal?.status
          return (
            <Paper key={participant.key} variant="outlined" sx={{ p: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 2,
                  flexWrap: 'wrap',
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{ alignItems: 'center', flexWrap: 'wrap' }}
                >
                  <Typography sx={{ fontWeight: 600 }}>
                    {participant.vendorName}
                  </Typography>
                  <VendorParticipationChip status={participant.participation} />
                  {status && <ProposalStatusChip status={status} />}
                  {participant.solicitedAt && (
                    <Typography variant="body2" color="text.secondary">
                      Invited {formatDate(participant.solicitedAt)}
                    </Typography>
                  )}
                </Stack>

                {proposal && (
                  <Stack
                    direction="row"
                    spacing={1}
                    useFlexGap
                    sx={{ flexWrap: 'wrap' }}
                  >
                    {status === 'Submitted' && hasRole('Officer') && (
                      <>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            filterProposal.mutate({
                              proposalId: proposal.id,
                              pass: true,
                            })
                          }
                        >
                          Pass filter
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() =>
                            filterProposal.mutate({
                              proposalId: proposal.id,
                              pass: false,
                            })
                          }
                        >
                          Decline
                        </Button>
                      </>
                    )}
                    {status === 'Filtered' && hasRole('Lead') && (
                      <>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            approveRound.mutate({
                              proposalId: proposal.id,
                              approve: true,
                            })
                          }
                        >
                          Approve round 1
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() =>
                            approveRound.mutate({
                              proposalId: proposal.id,
                              approve: false,
                            })
                          }
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {status === 'FollowUp' && hasRole('Officer') && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          rankFinalist.mutate({
                            projectId,
                            vendorId: participant.vendorId,
                            rank: nextFinalistRank(),
                          })
                        }
                      >
                        Rank as finalist
                      </Button>
                    )}
                  </Stack>
                )}
              </Box>

              {proposal && proposal.submissions.length > 0 && (
                <Table size="small" sx={{ mt: 1.5 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Artifact submission</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Submitted</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {proposal.submissions.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>
                          {s.type === 'Document'
                            ? (s.documentName ?? 'Document')
                            : 'Form responses'}
                        </TableCell>
                        <TableCell>{s.type}</TableCell>
                        <TableCell>{formatDate(s.submittedAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {proposal && proposal.additionalItems.length > 0 && (
                <Box sx={{ mt: 1.5 }}>
                  <Typography variant="overline" color="text.secondary">
                    Additional items
                  </Typography>
                  <Stack component="ul" sx={{ m: 0, pl: 3 }} spacing={0.5}>
                    {proposal.additionalItems.map((item) => (
                      <li key={item.id}>
                        <Typography variant="body2">
                          <strong>{item.name}</strong>
                          {item.note ? ` — ${item.note}` : ''}
                        </Typography>
                      </li>
                    ))}
                  </Stack>
                </Box>
              )}
            </Paper>
          )
        })}
      </Stack>

      <Dialog
        open={solicitOpen}
        onClose={() => setSolicitOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Solicit a vendor</DialogTitle>
        <DialogContent>
          <TextField
            label="Vendor"
            value={solicitVendorId}
            onChange={(e) => setSolicitVendorId(e.target.value)}
            select
            fullWidth
            sx={{ mt: 1 }}
            helperText="Invite a vendor who is not yet associated with this project."
          >
            {eligibleToSolicit.map((vendor) => (
              <MenuItem key={vendor.id} value={vendor.id}>
                {vendor.companyName ?? vendor.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSolicitOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!solicitVendorId || solicitVendor.isPending}
            onClick={() =>
              solicitVendor.mutate({ projectId, vendorId: solicitVendorId })
            }
          >
            {solicitVendor.isPending ? 'Soliciting…' : 'Send solicitation'}
          </Button>
        </DialogActions>
      </Dialog>
    </QueryState>
  )
}
