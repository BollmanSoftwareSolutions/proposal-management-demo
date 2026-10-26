import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useQueryClient } from '@tanstack/react-query'
import {
  useArtifactTemplatesQuery,
  useCreateArtifactTemplateMutation,
  useDeleteArtifactTemplateMutation,
  useUpdateArtifactTemplateMutation,
  type ArtifactTemplateFieldsFragment,
  type ArtifactType,
} from '../../graphql/generated/graphql'
import { QueryState } from '../../components/common/QueryState'
import { useRole } from '../../roles/roleContext'
import { errorMessage } from '../../lib/errors'
import { SurveyPreviewDialog } from '../survey-runtime/SurveyPreviewDialog'
import { SurveyBuilder } from '../survey-builder/SurveyBuilder'
import {
  questionsToSchema,
  schemaToQuestions,
  type BuilderQuestion,
} from '../survey-builder/surveySchema'

/**
 * Shared artifact templates (procurement) — design-docs/04-ui-ux.md §4.7.
 * Leads author/edit/remove reusable templates (Form schemas built with the MUI
 * survey builder); Officers view the list read-only. Form templates open a
 * read-only SurveyJS preview.
 */
export function ArtifactTemplatesList() {
  const queryClient = useQueryClient()
  const { hasRole } = useRole()
  const canManage = hasRole('Lead')

  const templatesQuery = useArtifactTemplatesQuery()
  const templates = templatesQuery.data?.artifactTemplates ?? []

  const [preview, setPreview] =
    useState<ArtifactTemplateFieldsFragment | null>(null)
  const [editing, setEditing] = useState<
    { mode: 'create' } | { mode: 'edit'; template: ArtifactTemplateFieldsFragment } | null
  >(null)

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: useArtifactTemplatesQuery.getKey(),
    })

  const createTemplate = useCreateArtifactTemplateMutation({
    onSuccess: () => {
      invalidate()
      setEditing(null)
    },
  })
  const updateTemplate = useUpdateArtifactTemplateMutation({
    onSuccess: () => {
      invalidate()
      setEditing(null)
    },
  })
  const deleteTemplate = useDeleteArtifactTemplateMutation({
    onSuccess: invalidate,
  })

  const saving = createTemplate.isPending || updateTemplate.isPending

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Artifacts
          </Typography>
          <Typography color="text.secondary">
            Reusable artifact templates added to projects. Form templates are
            authored with the survey builder and open in a preview.
            {canManage
              ? ' You can add, edit, and remove templates.'
              : ' Officers can view; Leads manage templates.'}
          </Typography>
        </Box>
        {canManage && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ flexShrink: 0 }}
            onClick={() => setEditing({ mode: 'create' })}
          >
            Add template
          </Button>
        )}
      </Box>

      {Boolean(deleteTemplate.error) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage(deleteTemplate.error, 'Failed to remove template.')}
        </Alert>
      )}

      <QueryState
        isLoading={templatesQuery.isLoading}
        error={templatesQuery.error}
        isEmpty={templates.length === 0}
        emptyMessage="No artifact templates yet."
      >
        <Stack spacing={2}>
          {templates.map((template) => (
            <Paper key={template.id} variant="outlined" sx={{ p: 2 }}>
              <Stack
                direction="row"
                spacing={2}
                useFlexGap
                sx={{
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                }}
              >
                <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 240 } }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    useFlexGap
                    sx={{ alignItems: 'center', flexWrap: 'wrap', mb: 0.5 }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>
                      {template.title}
                    </Typography>
                    <Chip size="small" label={template.type} />
                    {template.shared && (
                      <Chip
                        size="small"
                        color="primary"
                        variant="outlined"
                        label="Shared"
                      />
                    )}
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {template.description}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
                  {template.type === 'Form' && (
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => setPreview(template)}
                    >
                      Preview
                    </Button>
                  )}
                  {canManage && (
                    <>
                      <Button
                        size="small"
                        onClick={() =>
                          setEditing({ mode: 'edit', template })
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        disabled={deleteTemplate.isPending}
                        onClick={() =>
                          deleteTemplate.mutate({ id: template.id })
                        }
                      >
                        Remove
                      </Button>
                    </>
                  )}
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </QueryState>

      <SurveyPreviewDialog
        open={preview !== null}
        title={preview?.title ?? ''}
        schema={preview?.surveyJsSchema}
        onClose={() => setPreview(null)}
      />

      {editing && (
        <TemplateDialog
          key={editing.mode === 'edit' ? editing.template.id : 'create'}
          template={editing.mode === 'edit' ? editing.template : null}
          saving={saving}
          error={createTemplate.error ?? updateTemplate.error}
          onClose={() => setEditing(null)}
          onSubmit={(input) => {
            if (editing.mode === 'edit') {
              updateTemplate.mutate({ id: editing.template.id, input })
            } else {
              createTemplate.mutate({ input })
            }
          }}
        />
      )}
    </Box>
  )
}

interface TemplateInput {
  title: string
  description: string
  type: ArtifactType
  shared: boolean
  surveyJsSchema?: unknown
}

function TemplateDialog({
  template,
  saving,
  error,
  onClose,
  onSubmit,
}: {
  template: ArtifactTemplateFieldsFragment | null
  saving: boolean
  error: unknown
  onClose: () => void
  onSubmit: (input: TemplateInput) => void
}) {
  const [title, setTitle] = useState(template?.title ?? '')
  const [description, setDescription] = useState(template?.description ?? '')
  const [type, setType] = useState<ArtifactType>(template?.type ?? 'Form')
  const [shared, setShared] = useState(template?.shared ?? true)
  const [questions, setQuestions] = useState<BuilderQuestion[]>(() =>
    template?.type === 'Form' ? schemaToQuestions(template.surveyJsSchema) : [],
  )

  const handleSubmit = () => {
    if (!title.trim()) return
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      type,
      shared,
      surveyJsSchema:
        type === 'Form' ? questionsToSchema(title.trim(), questions) : undefined,
    })
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {template ? 'Edit artifact template' : 'Add artifact template'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
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
          >
            <MenuItem value="Form">Form</MenuItem>
            <MenuItem value="Document">Document</MenuItem>
          </TextField>
          <FormControlLabel
            control={
              <Switch
                checked={shared}
                onChange={(e) => setShared(e.target.checked)}
              />
            }
            label="Shared (vendors can pre-complete across projects)"
          />
          {type === 'Form' && (
            <SurveyBuilder
              questions={questions}
              onChange={setQuestions}
              surveyTitle={title}
            />
          )}
          {Boolean(error) && (
            <Alert severity="error">
              {errorMessage(error, 'Failed to save template.')}
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={saving || !title.trim()}
        >
          {saving ? 'Saving…' : template ? 'Save changes' : 'Add template'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
