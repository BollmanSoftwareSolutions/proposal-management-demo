import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useQueryClient } from '@tanstack/react-query'
import { AppLink } from '../../components/common/AppLink'
import { QueryState } from '../../components/common/QueryState'
import { ProposalStatusChip } from '../../components/common/StatusChip'
import {
  useAvailableProjectsQuery,
  useMyProposalsQuery,
  useMySolicitationsQuery,
  useProjectQuery,
  useSignUpMutation,
  useSubmitProposalMutation,
} from '../../graphql/generated/graphql'
import { formatCurrency, formatDate } from '../../lib/format'
import { errorMessage } from '../../lib/errors'

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography>{value}</Typography>
    </Box>
  )
}

/**
 * Vendor project overview (design-docs/04-ui-ux.md §4.11). Shows read-only
 * project details plus the vendor's proposal status, with sign-up when the
 * vendor is only browsing and submit once artifacts are complete.
 */
export function VendorOverviewTab({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient()
  const projectQuery = useProjectQuery({ id: projectId })
  const proposalsQuery = useMyProposalsQuery()

  const project = projectQuery.data?.project ?? null
  const proposal =
    proposalsQuery.data?.myProposals.find((p) => p.projectId === projectId) ??
    null

  const signUp = useSignUpMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: useMyProposalsQuery.getKey() })
      queryClient.invalidateQueries({
        queryKey: useAvailableProjectsQuery.getKey(),
      })
      queryClient.invalidateQueries({
        queryKey: useMySolicitationsQuery.getKey(),
      })
    },
  })

  const submitProposal = useSubmitProposalMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: useMyProposalsQuery.getKey() })
    },
  })

  return (
    <QueryState
      isLoading={projectQuery.isLoading || proposalsQuery.isLoading}
      error={projectQuery.error ?? proposalsQuery.error}
      isEmpty={!project}
      emptyMessage="Project not found or not available."
    >
      {project && (
        <Stack spacing={3}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack
              direction="row"
              spacing={2}
              useFlexGap
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}
            >
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Your proposal
                </Typography>
                {proposal ? (
                  <Box sx={{ mt: 0.5 }}>
                    <ProposalStatusChip status={proposal.status} />
                  </Box>
                ) : (
                  <Typography color="text.secondary">
                    You have not signed up for this project yet.
                  </Typography>
                )}
              </Box>
              {proposal ? (
                <Button
                  variant="contained"
                  disabled={
                    proposal.status !== 'SignedUp' || submitProposal.isPending
                  }
                  onClick={() =>
                    submitProposal.mutate({ proposalId: proposal.id })
                  }
                >
                  {proposal.status === 'SignedUp'
                    ? 'Submit proposal'
                    : 'Proposal submitted'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  disabled={signUp.isPending}
                  onClick={() => signUp.mutate({ projectId })}
                >
                  Sign up
                </Button>
              )}
            </Stack>
            {proposal && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Complete the required artifacts on the Artifacts tab, then submit
                your proposal for review.
              </Typography>
            )}
          </Paper>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Project details
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
              }}
            >
              <Field label="Area" value={project.area?.name ?? '—'} />
              <Field
                label="Estimated value"
                value={formatCurrency(project.estimatedValue)}
              />
              <Field label="Opens" value={formatDate(project.openDate)} />
              <Field label="Closes" value={formatDate(project.closeDate)} />
            </Box>
            <Divider sx={{ my: 2 }} />
            <Field label="Outline" value={project.outline} />
            <Box sx={{ mt: 2 }}>
              <Field label="Scope" value={project.scope} />
            </Box>
          </Paper>

          {project.segments.length > 0 && (
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Timeline
              </Typography>
              <Stack spacing={1}>
                {project.segments
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((segment) => (
                    <Stack
                      key={segment.id}
                      direction="row"
                      spacing={2}
                      sx={{ justifyContent: 'space-between' }}
                    >
                      <Typography>{segment.title}</Typography>
                      <Typography color="text.secondary">
                        {formatDate(segment.openDate)} –{' '}
                        {formatDate(segment.closeDate)}
                      </Typography>
                    </Stack>
                  ))}
              </Stack>
            </Paper>
          )}

          {proposal && (
            <Typography variant="body2" color="text.secondary">
              Browse more open solicitations on the{' '}
              <AppLink to="/projects">Projects</AppLink> page.
            </Typography>
          )}

          {(signUp.error != null || submitProposal.error != null) && (
            <Typography color="error">
              {errorMessage(
                signUp.error ?? submitProposal.error,
                'Action failed. Please try again.',
              )}
            </Typography>
          )}
        </Stack>
      )}
    </QueryState>
  )
}
