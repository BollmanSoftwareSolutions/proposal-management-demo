import { useMemo, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { PieChart } from '@mui/x-charts/PieChart'
import { useQueryClient } from '@tanstack/react-query'
import {
  useMeQuery,
  useMyProposalsQuery,
  useUpdateDemographicsMutation,
  type ProposalStatus,
  type UserFieldsFragment,
} from '../../graphql/generated/graphql'
import { QueryState } from '../../components/common/QueryState'
import { ProposalStatusChip } from '../../components/common/StatusChip'
import { chartPalette } from '../../app/theme'
import { formatCurrency, formatRelative } from '../../lib/format'
import { KpiStrip } from './KpiStrip'
import { DashboardCard } from './DashboardCard'

const chartColors = [...chartPalette]

const STATUS_ORDER: ProposalStatus[] = [
  'SignedUp',
  'Submitted',
  'Filtered',
  'FollowUp',
  'Finalized',
  'Won',
  'Declined',
]

/**
 * Vendor dashboard (design-docs/04-ui-ux.md §4.8): the procurement
 * vendor-detail view scoped to the signed-in vendor, plus an editable
 * demographics panel.
 */
export function VendorDashboard() {
  const meQuery = useMeQuery()
  const proposalsQuery = useMyProposalsQuery()

  const me = meQuery.data?.me ?? null
  const proposals = useMemo(
    () => proposalsQuery.data?.myProposals ?? [],
    [proposalsQuery.data],
  )

  const statusCounts = useMemo(() => {
    const counts = new Map<ProposalStatus, number>()
    for (const proposal of proposals) {
      counts.set(proposal.status, (counts.get(proposal.status) ?? 0) + 1)
    }
    return counts
  }, [proposals])

  const wonValue = proposals
    .filter((p) => p.status === 'Won')
    .reduce((sum, p) => sum + (p.project?.estimatedValue ?? 0), 0)

  const activeValue = proposals
    .filter((p) => p.status !== 'Declined')
    .reduce((sum, p) => sum + (p.project?.estimatedValue ?? 0), 0)

  const statusPie = useMemo(
    () =>
      STATUS_ORDER.filter((status) => statusCounts.has(status)).map(
        (status, index) => ({
          id: status,
          value: statusCounts.get(status) ?? 0,
          label: status,
          color: chartColors[index % chartColors.length],
        }),
      ),
    [statusCounts],
  )

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Your dashboard
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        A snapshot of your proposals, estimated value, and current standing.
      </Typography>

      <QueryState
        isLoading={meQuery.isLoading || proposalsQuery.isLoading}
        error={meQuery.error ?? proposalsQuery.error}
        isEmpty={!me}
        emptyMessage="Unable to load your profile."
      >
        {me && (
          <Stack spacing={3}>
            <KpiStrip
              items={[
                {
                  label: 'Proposals',
                  value: String(proposals.length),
                },
                {
                  label: 'Projects won',
                  value: String(statusCounts.get('Won') ?? 0),
                },
                {
                  label: 'Est. value won',
                  value: formatCurrency(wonValue),
                },
                {
                  label: 'Est. value in play',
                  value: formatCurrency(activeValue),
                },
              ]}
            />

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              }}
            >
              <DashboardCard
                title="Proposals by status"
                subheader="Where your proposals stand"
              >
                {statusPie.length > 0 ? (
                  <Stack spacing={2}>
                    <PieChart
                      height={220}
                      series={[
                        {
                          data: statusPie,
                          innerRadius: 44,
                          paddingAngle: 2,
                          cornerRadius: 4,
                          highlightScope: {
                            fade: 'global',
                            highlight: 'item',
                          },
                        },
                      ]}
                    />
                    <Stack
                      direction="row"
                      spacing={1}
                      useFlexGap
                      sx={{ flexWrap: 'wrap' }}
                    >
                      {STATUS_ORDER.filter((s) => statusCounts.has(s)).map(
                        (status) => (
                          <Stack
                            key={status}
                            direction="row"
                            spacing={0.75}
                            sx={{ alignItems: 'center' }}
                          >
                            <ProposalStatusChip status={status} />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {statusCounts.get(status)}
                            </Typography>
                          </Stack>
                        ),
                      )}
                    </Stack>
                  </Stack>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 160,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      You have not signed up for any projects yet.
                    </Typography>
                  </Box>
                )}
              </DashboardCard>

              <DemographicsCard key={me.id} me={me} />
            </Box>
          </Stack>
        )}
      </QueryState>
    </Box>
  )
}

interface DemographicsForm {
  companyName: string
  jurisdiction: string
  phone: string
  email: string
}

function toForm(me: UserFieldsFragment): DemographicsForm {
  return {
    companyName: me.companyName ?? '',
    jurisdiction: me.jurisdiction ?? '',
    phone: me.phone ?? '',
    email: me.email ?? '',
  }
}

/** Editable demographic / contact details for the signed-in vendor. */
function DemographicsCard({ me }: { me: UserFieldsFragment }) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<DemographicsForm>(() => toForm(me))
  const [message, setMessage] = useState<string | null>(null)

  const mutation = useUpdateDemographicsMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Me'] })
      setMessage('Your details have been updated.')
    },
  })

  const set =
    (key: keyof DemographicsForm) =>
    (event: { target: { value: string } }) =>
      setForm((prev) => ({ ...prev, [key]: event.target.value }))

  const handleSave = () => {
    setMessage(null)
    mutation.mutate({
      input: {
        companyName: form.companyName.trim(),
        jurisdiction: form.jurisdiction.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
      },
    })
  }

  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }} gutterBottom>
        Your details
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Last active {formatRelative(me.lastActive)}
      </Typography>
      <Stack spacing={2} sx={{ mt: 2 }}>
        <TextField
          label="Company name"
          value={form.companyName}
          onChange={set('companyName')}
          size="small"
          fullWidth
        />
        <TextField
          label="Jurisdiction"
          value={form.jurisdiction}
          onChange={set('jurisdiction')}
          size="small"
          fullWidth
        />
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={set('email')}
          size="small"
          fullWidth
        />
        <TextField
          label="Phone"
          value={form.phone}
          onChange={set('phone')}
          size="small"
          fullWidth
        />
        {message && <Alert severity="success">{message}</Alert>}
        {mutation.error ? (
          <Alert severity="error">
            {mutation.error instanceof Error
              ? mutation.error.message
              : 'Could not save your details.'}
          </Alert>
        ) : null}
        <Box>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Saving…' : 'Save details'}
          </Button>
        </Box>
      </Stack>
    </Paper>
  )
}
