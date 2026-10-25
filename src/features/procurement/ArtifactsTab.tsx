import { useMemo, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
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
  useAddProjectArtifactMutation,
  useArtifactTemplatesQuery,
  useProjectProposalsQuery,
  useProjectQuery,
  useRemoveProjectArtifactMutation,
  type ArtifactType,
} from '../../graphql/generated/graphql'
import { QueryState } from '../../components/common/QueryState'
import { formatDate } from '../../lib/format'

type SubmissionRow = {
  vendorName: string
  label: string
  submittedAt: string
}

export function ArtifactsTab({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient()
  const projectQuery = useProjectQuery({ id: projectId })
  const proposalsQuery = useProjectProposalsQuery({ projectId })
  const templatesQuery = useArtifactTemplatesQuery()

  const [dialogOpen, setDialogOpen] = useState(false)

  const project = projectQuery.data?.project ?? null
  const artifacts = project?.artifacts ?? []

  const submissionsByArtifact = useMemo(() => {
    const map = new Map<string, SubmissionRow[]>()
    for (const proposal of proposalsQuery.data?.projectProposals ?? []) {
      const vendorName =
        proposal.vendor?.companyName ?? proposal.vendor?.name ?? 'Vendor'
      for (const submission of proposal.submissions) {
        const rows = map.get(submission.projectArtifactId) ?? []
        rows.push({
          vendorName,
          label:
            submission.type === 'Document'
              ? (submission.documentName ?? 'Document')
              : 'Form responses',
          submittedAt: submission.submittedAt,
        })
        map.set(submission.projectArtifactId, rows)
      }
    }
    return map
  }, [proposalsQuery.data])

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['Project', { id: projectId }] })
  }

  const addArtifact = useAddProjectArtifactMutation({
    onSuccess: () => {
      invalidate()
      setDialogOpen(false)
    },
  })
  const removeArtifact = useRemoveProjectArtifactMutation({
    onSuccess: invalidate,
  })

  return (
    <QueryState
      isLoading={projectQuery.isLoading}
      error={projectQuery.error}
      isEmpty={!project}
      emptyMessage="Project not found."
    >
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Typography color="text.secondary">
            Required artifacts for this project. Add from templates or define a
            custom one; removed artifacts are kept for history (soft delete).
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{ flexShrink: 0 }}
          >
            Add artifact
          </Button>
        </Box>

        {Boolean(removeArtifact.error) && (
          <Alert severity="error">
            {removeArtifact.error instanceof Error
              ? removeArtifact.error.message
              : 'Failed to remove artifact.'}
          </Alert>
        )}

        {artifacts.length === 0 ? (
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
              No artifacts yet. Add one to collect vendor submissions.
            </Typography>
          </Paper>
        ) : (
          artifacts.map((artifact) => {
            const rows = submissionsByArtifact.get(artifact.id) ?? []
            return (
              <Paper key={artifact.id} variant="outlined" sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 2,
                  }}
                >
                  <Box>
                    <Stack
                      direction="row"
                      spacing={1}
                      useFlexGap
                      sx={{ alignItems: 'center', flexWrap: 'wrap' }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          textDecoration: artifact.isActive
                            ? 'none'
                            : 'line-through',
                          color: artifact.isActive
                            ? 'text.primary'
                            : 'text.disabled',
                        }}
                      >
                        {artifact.title}
                      </Typography>
                      <Chip size="small" label={artifact.type} />
                      {!artifact.isActive && (
                        <Chip
                          size="small"
                          color="default"
                          variant="outlined"
                          label="Removed"
                        />
                      )}
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {artifact.description}
                    </Typography>
                  </Box>
                  {artifact.isActive && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => removeArtifact.mutate({ id: artifact.id })}
                      disabled={removeArtifact.isPending}
                    >
                      Remove
                    </Button>
                  )}
                </Box>

                {rows.length > 0 && (
                  <Table size="small" sx={{ mt: 1.5 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Vendor</TableCell>
                        <TableCell>Submission</TableCell>
                        <TableCell>Submitted</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row, i) => (
                        <TableRow key={`${artifact.id}-${i}`}>
                          <TableCell>{row.vendorName}</TableCell>
                          <TableCell>{row.label}</TableCell>
                          <TableCell>{formatDate(row.submittedAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Paper>
            )
          })
        )}
      </Stack>

      <AddArtifactDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        templates={templatesQuery.data?.artifactTemplates ?? []}
        pending={addArtifact.isPending}
        error={addArtifact.error}
        onSubmit={(input) => addArtifact.mutate({ projectId, input })}
      />
    </QueryState>
  )
}

type TemplateOption = {
  id: string
  title: string
  description: string
  type: ArtifactType
  surveyJsSchema?: unknown
}

function AddArtifactDialog({
  open,
  onClose,
  templates,
  pending,
  error,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  templates: TemplateOption[]
  pending: boolean
  error: unknown
  onSubmit: (input: {
    templateId?: string | null
    title: string
    description: string
    type: ArtifactType
    surveyJsSchema?: unknown
  }) => void
}) {
  const [templateId, setTemplateId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<ArtifactType>('Form')

  const selected = templates.find((t) => t.id === templateId)

  const handleTemplate = (value: string) => {
    setTemplateId(value)
    const tmpl = templates.find((t) => t.id === value)
    if (tmpl) {
      setTitle(tmpl.title)
      setDescription(tmpl.description)
      setType(tmpl.type)
    }
  }

  const handleSubmit = () => {
    if (!title.trim()) return
    onSubmit({
      templateId: templateId || null,
      title: title.trim(),
      description: description.trim(),
      type,
      surveyJsSchema: selected?.surveyJsSchema,
    })
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add project artifact</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="From template"
            value={templateId}
            onChange={(e) => handleTemplate(e.target.value)}
            select
            fullWidth
            helperText="Optional — start from a shared template or leave blank for a custom artifact."
          >
            <MenuItem value="">Custom (no template)</MenuItem>
            {templates.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.title} ({t.type})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            minRows={2}
            fullWidth
          />
          <TextField
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value as ArtifactType)}
            select
            fullWidth
            disabled={Boolean(selected)}
          >
            <MenuItem value="Form">Form</MenuItem>
            <MenuItem value="Document">Document</MenuItem>
          </TextField>
          {Boolean(error) && (
            <Alert severity="error">
              {error instanceof Error ? error.message : 'Failed to add artifact.'}
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={pending || !title.trim()}
        >
          {pending ? 'Adding…' : 'Add artifact'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
