import { useMemo, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useQueryClient } from '@tanstack/react-query'
import {
  useActivateProjectMutation,
  useProjectAreasQuery,
  useProjectProposalsQuery,
  useProjectQuery,
  useUpdateProjectMutation,
  type ProjectAreasQuery,
  type ProjectFieldsFragment,
  type UpdateProjectInput,
} from '../../graphql/generated/graphql'
import { QueryState } from '../../components/common/QueryState'
import { ProjectStatusChip } from '../../components/common/StatusChip'
import { formatCurrency, formatDate } from '../../lib/format'
import { LEAD_OPTIONS } from './staff'

type FormState = {
  name: string
  projectAreaId: string
  estimatedValue: string
  outline: string
  scope: string
  openDate: string
  closeDate: string
  assignedLeadId: string
}

function toForm(project: ProjectFieldsFragment): FormState {
  return {
    name: project.name,
    projectAreaId: project.projectAreaId,
    estimatedValue: String(project.estimatedValue),
    outline: project.outline,
    scope: project.scope,
    openDate: project.openDate.slice(0, 10),
    closeDate: project.closeDate.slice(0, 10),
    assignedLeadId: project.assignedLeadId,
  }
}

function isSegmentActive(openDate: string, closeDate: string): boolean {
  const now = Date.now()
  return (
    new Date(openDate).getTime() <= now && now <= new Date(closeDate).getTime()
  )
}

export function SetupTab({ projectId }: { projectId: string }) {
  const projectQuery = useProjectQuery({ id: projectId })
  const areasQuery = useProjectAreasQuery()
  const proposalsQuery = useProjectProposalsQuery({ projectId })

  const project = projectQuery.data?.project ?? null

  const activeSegments = useMemo(
    () =>
      (project?.segments ?? []).filter((s) =>
        isSegmentActive(s.openDate, s.closeDate),
      ),
    [project],
  )

  const vendorCount = proposalsQuery.data?.projectProposals.length ?? 0

  return (
    <QueryState
      isLoading={projectQuery.isLoading}
      error={projectQuery.error}
      isEmpty={!project}
      emptyMessage="Project not found."
    >
      {project && (
        <Stack spacing={3}>
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              sx={{ alignItems: { sm: 'center' } }}
            >
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Status
                </Typography>
                <Box>
                  <ProjectStatusChip status={project.status} />
                </Box>
              </Box>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Vendors signed up
                </Typography>
                <Typography variant="h5">{vendorCount}</Typography>
              </Box>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  Active segments
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{ flexWrap: 'wrap' }}
                >
                  {activeSegments.length === 0 ? (
                    <Typography color="text.secondary">None open</Typography>
                  ) : (
                    activeSegments.map((s) => (
                      <Chip
                        key={s.id}
                        size="small"
                        label={`${s.title} · closes ${formatDate(s.closeDate)}`}
                      />
                    ))
                  )}
                </Stack>
              </Box>
            </Stack>
          </Paper>

          {project.isPublic && (
            <Alert severity="info" icon={<LockOutlinedIcon fontSize="small" />}>
              Setup fields lock once a project is public. Estimated value{' '}
              {formatCurrency(project.estimatedValue)}. Manage artifacts and
              vendors from the other tabs.
            </Alert>
          )}

          <SetupEditForm
            key={project.id}
            project={project}
            areas={areasQuery.data?.projectAreas ?? []}
          />
        </Stack>
      )}
    </QueryState>
  )
}

function SetupEditForm({
  project,
  areas,
}: {
  project: ProjectFieldsFragment
  areas: ProjectAreasQuery['projectAreas']
}) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<FormState>(() => toForm(project))
  const [message, setMessage] = useState<string | null>(null)

  const locked = project.isPublic

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ['Project', { id: project.id }],
    })
    queryClient.invalidateQueries({ queryKey: ['Projects'] })
  }

  const updateProject = useUpdateProjectMutation({
    onSuccess: () => {
      invalidate()
      setMessage('Changes saved.')
    },
  })
  const activateProject = useActivateProjectMutation({
    onSuccess: () => {
      invalidate()
      setMessage('Project activated and published.')
    },
  })

  const set =
    (key: keyof FormState) => (event: { target: { value: string } }) =>
      setForm((prev) => ({ ...prev, [key]: event.target.value }))

  const handleSave = () => {
    setMessage(null)
    const input: UpdateProjectInput = {
      name: form.name.trim(),
      projectAreaId: form.projectAreaId,
      estimatedValue: Number(form.estimatedValue),
      outline: form.outline.trim(),
      scope: form.scope.trim(),
      openDate: new Date(form.openDate).toISOString(),
      closeDate: new Date(form.closeDate).toISOString(),
      assignedLeadId: form.assignedLeadId,
    }
    updateProject.mutate({ id: project.id, input })
  }

  return (
    <Paper variant="outlined" sx={{ p: 3, maxWidth: 720 }}>
      <Stack spacing={2.5}>
        <TextField
          label="Project name"
          value={form.name}
          onChange={set('name')}
          disabled={locked}
          fullWidth
        />
        <TextField
          label="Project area"
          value={form.projectAreaId}
          onChange={set('projectAreaId')}
          select
          disabled={locked}
          fullWidth
        >
          {areas.map((area) => (
            <MenuItem key={area.id} value={area.id}>
              {area.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Assigned lead"
          value={form.assignedLeadId}
          onChange={set('assignedLeadId')}
          select
          disabled={locked}
          fullWidth
        >
          {LEAD_OPTIONS.map((lead) => (
            <MenuItem key={lead.id} value={lead.id}>
              {lead.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Estimated value (USD)"
          value={form.estimatedValue}
          onChange={set('estimatedValue')}
          type="number"
          disabled={locked}
          fullWidth
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
          <TextField
            label="Open date"
            value={form.openDate}
            onChange={set('openDate')}
            type="date"
            disabled={locked}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="Close date"
            value={form.closeDate}
            onChange={set('closeDate')}
            type="date"
            disabled={locked}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Stack>
        <TextField
          label="Outline"
          value={form.outline}
          onChange={set('outline')}
          multiline
          minRows={2}
          disabled={locked}
          fullWidth
        />
        <TextField
          label="Scope"
          value={form.scope}
          onChange={set('scope')}
          multiline
          minRows={2}
          disabled={locked}
          fullWidth
        />

        {Boolean(updateProject.error || activateProject.error) && (
          <Alert severity="error">
            {(updateProject.error ?? activateProject.error) instanceof Error
              ? ((updateProject.error ?? activateProject.error) as Error).message
              : 'Action failed.'}
          </Alert>
        )}
        {message && <Alert severity="success">{message}</Alert>}

        {!locked && (
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={updateProject.isPending}
            >
              {updateProject.isPending ? 'Saving…' : 'Save changes'}
            </Button>
            <Button
              variant="outlined"
              color="success"
              onClick={() => {
                setMessage(null)
                activateProject.mutate({ id: project.id })
              }}
              disabled={activateProject.isPending}
            >
              {activateProject.isPending ? 'Activating…' : 'Activate & publish'}
            </Button>
          </Stack>
        )}
      </Stack>
    </Paper>
  )
}
