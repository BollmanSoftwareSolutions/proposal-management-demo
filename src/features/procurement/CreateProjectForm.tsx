import { useState, type FormEvent } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import {
  useCreateProjectMutation,
  useProjectAreasQuery,
  type CreateProjectInput,
} from '../../graphql/generated/graphql'
import { QueryState } from '../../components/common/QueryState'
import { LEAD_OPTIONS } from './staff'

function todayPlus(days: number): string {
  return new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10)
}

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

const EMPTY: FormState = {
  name: '',
  projectAreaId: '',
  estimatedValue: '',
  outline: '',
  scope: '',
  openDate: todayPlus(0),
  closeDate: todayPlus(30),
  assignedLeadId: '',
}

/**
 * Create-project form (Create tab, design-docs/04-ui-ux.md §4.3). Projects start
 * in Draft; the Officer later activates them from the project Setup tab.
 */
export function CreateProjectForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const areasQuery = useProjectAreasQuery()

  const [form, setForm] = useState<FormState>(EMPTY)
  const [validationError, setValidationError] = useState<string | null>(null)

  const createProject = useCreateProjectMutation({
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['Projects'] })
      navigate({
        to: '/projects/$projectId',
        params: { projectId: data.createProject.id },
      })
    },
  })

  const set =
    (key: keyof FormState) =>
    (event: { target: { value: string } }) =>
      setForm((prev) => ({ ...prev, [key]: event.target.value }))

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setValidationError(null)

    if (!form.name.trim()) {
      setValidationError('Project name is required.')
      return
    }
    if (!form.projectAreaId) {
      setValidationError('Select a project area.')
      return
    }
    if (!form.assignedLeadId) {
      setValidationError('Assign a procurement lead.')
      return
    }
    const estimatedValue = Number(form.estimatedValue)
    if (!Number.isFinite(estimatedValue) || estimatedValue <= 0) {
      setValidationError('Estimated value must be a positive number.')
      return
    }
    if (new Date(form.closeDate) <= new Date(form.openDate)) {
      setValidationError('Close date must be after the open date.')
      return
    }

    const input: CreateProjectInput = {
      name: form.name.trim(),
      projectAreaId: form.projectAreaId,
      estimatedValue,
      outline: form.outline.trim(),
      scope: form.scope.trim(),
      openDate: new Date(form.openDate).toISOString(),
      closeDate: new Date(form.closeDate).toISOString(),
      assignedLeadId: form.assignedLeadId,
    }
    createProject.mutate({ input })
  }

  return (
    <Paper variant="outlined" sx={{ p: 3, maxWidth: 720 }}>
      <Typography variant="h6" gutterBottom>
        Create a new project
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        New projects start in development (Draft) and private. Activate them from
        the Setup tab to make them public and solicit vendors.
      </Typography>

      <QueryState
        isLoading={areasQuery.isLoading}
        error={areasQuery.error}
      >
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2.5}>
            <TextField
              label="Project name"
              value={form.name}
              onChange={set('name')}
              required
              fullWidth
            />
            <TextField
              label="Project area"
              value={form.projectAreaId}
              onChange={set('projectAreaId')}
              select
              required
              fullWidth
            >
              {(areasQuery.data?.projectAreas ?? []).map((area) => (
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
              required
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
              required
              fullWidth
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
              <TextField
                label="Open date"
                value={form.openDate}
                onChange={set('openDate')}
                type="date"
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="Close date"
                value={form.closeDate}
                onChange={set('closeDate')}
                type="date"
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
              fullWidth
            />
            <TextField
              label="Scope"
              value={form.scope}
              onChange={set('scope')}
              multiline
              minRows={2}
              fullWidth
            />

            {validationError && (
              <Alert severity="warning">{validationError}</Alert>
            )}
            {Boolean(createProject.error) && (
              <Alert severity="error">
                {createProject.error instanceof Error
                  ? createProject.error.message
                  : 'Failed to create project.'}
              </Alert>
            )}

            <Box>
              <Button
                type="submit"
                variant="contained"
                disabled={createProject.isPending}
              >
                {createProject.isPending ? 'Creating…' : 'Create project'}
              </Button>
            </Box>
          </Stack>
        </Box>
      </QueryState>
    </Paper>
  )
}
