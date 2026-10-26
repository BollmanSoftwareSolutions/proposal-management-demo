import { useMemo, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useQueryClient } from '@tanstack/react-query'
import { AppLink } from '../../components/common/AppLink'
import { QueryState } from '../../components/common/QueryState'
import {
  useMyProposalsQuery,
  useProjectQuery,
  useSubmitArtifactMutation,
  type ProjectArtifactFieldsFragment,
} from '../../graphql/generated/graphql'
import { formatDate } from '../../lib/format'
import { errorMessage } from '../../lib/errors'
import { SurveyRuntime, type SurveyResponses } from '../survey-runtime/SurveyRuntime'

/**
 * Vendor artifact completion (design-docs/04-ui-ux.md §4.11). Lists the active
 * project artifacts and the vendor's submission status. Document artifacts are
 * completed by naming the uploaded document; Form artifacts open the SurveyJS
 * runtime so the vendor can fill and submit responses.
 */
export function VendorArtifactsTab({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient()
  const projectQuery = useProjectQuery({ id: projectId })
  const proposalsQuery = useMyProposalsQuery()

  const project = projectQuery.data?.project ?? null
  const proposal =
    proposalsQuery.data?.myProposals.find((p) => p.projectId === projectId) ??
    null

  const artifacts = useMemo(
    () => (project?.artifacts ?? []).filter((a) => a.isActive),
    [project],
  )

  const submissionByArtifact = useMemo(() => {
    const map = new Map<
      string,
      NonNullable<typeof proposal>['submissions'][number]
    >()
    for (const submission of proposal?.submissions ?? []) {
      map.set(submission.projectArtifactId, submission)
    }
    return map
  }, [proposal])

  const [dialogArtifact, setDialogArtifact] =
    useState<ProjectArtifactFieldsFragment | null>(null)
  const [documentName, setDocumentName] = useState('')
  const [formArtifact, setFormArtifact] =
    useState<ProjectArtifactFieldsFragment | null>(null)

  const submitArtifact = useSubmitArtifactMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: useMyProposalsQuery.getKey() })
      setDialogArtifact(null)
      setDocumentName('')
      setFormArtifact(null)
    },
  })

  const openDocumentDialog = (artifact: ProjectArtifactFieldsFragment) => {
    setDocumentName(
      submissionByArtifact.get(artifact.id)?.documentName ?? '',
    )
    setDialogArtifact(artifact)
  }

  return (
    <QueryState
      isLoading={projectQuery.isLoading || proposalsQuery.isLoading}
      error={projectQuery.error ?? proposalsQuery.error}
      isEmpty={!project}
      emptyMessage="Project not found or not available."
    >
      {!proposal ? (
        <Alert severity="info">
          Sign up for this project on the{' '}
          <AppLink to="/projects/$projectId/$tab" params={{ projectId, tab: 'setup' }}>
            Overview
          </AppLink>{' '}
          tab to complete its artifacts.
        </Alert>
      ) : artifacts.length === 0 ? (
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
            This project has no required artifacts yet.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          <Typography color="text.secondary">
            Complete each required artifact. Your responses are saved to this
            proposal.
          </Typography>
          {artifacts.map((artifact) => {
            const submission = submissionByArtifact.get(artifact.id)
            return (
              <Paper key={artifact.id} variant="outlined" sx={{ p: 2 }}>
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
                  <Box sx={{ flex: 1, minWidth: 240 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: 'center', mb: 0.5 }}
                    >
                      <Typography sx={{ fontWeight: 600 }}>
                        {artifact.title}
                      </Typography>
                      <Chip
                        size="small"
                        variant="outlined"
                        label={artifact.type}
                      />
                      {submission ? (
                        <Chip
                          size="small"
                          color="success"
                          label="Completed"
                        />
                      ) : (
                        <Chip size="small" color="warning" label="Incomplete" />
                      )}
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {artifact.description}
                    </Typography>
                    {submission && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mt: 1 }}
                      >
                        {submission.type === 'Document'
                          ? `Document: ${submission.documentName ?? '—'}`
                          : 'Form responses saved'}{' '}
                        · {formatDate(submission.submittedAt)}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ flexShrink: 0 }}>
                    {artifact.type === 'Document' ? (
                      <Button
                        variant={submission ? 'outlined' : 'contained'}
                        onClick={() => openDocumentDialog(artifact)}
                      >
                        {submission ? 'Update document' : 'Add document'}
                      </Button>
                    ) : (
                      <Button
                        variant={submission ? 'outlined' : 'contained'}
                        onClick={() => setFormArtifact(artifact)}
                      >
                        {submission ? 'Edit responses' : 'Complete form'}
                      </Button>
                    )}
                  </Box>
                </Stack>
              </Paper>
            )
          })}
        </Stack>
      )}

      <Dialog
        open={Boolean(dialogArtifact)}
        onClose={() => setDialogArtifact(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{dialogArtifact?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Name the document you are providing for this artifact.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Document name"
            value={documentName}
            onChange={(event) => setDocumentName(event.target.value)}
          />
          {submitArtifact.error != null && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage(
                submitArtifact.error,
                'Could not save the submission.',
              )}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogArtifact(null)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!documentName.trim() || submitArtifact.isPending}
            onClick={() => {
              if (!dialogArtifact || !proposal) return
              submitArtifact.mutate({
                input: {
                  proposalId: proposal.id,
                  projectArtifactId: dialogArtifact.id,
                  type: 'Document',
                  documentName: documentName.trim(),
                },
              })
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(formArtifact)}
        onClose={() => setFormArtifact(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{formArtifact?.title}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Complete this form and submit. Your responses are saved to this
            proposal.
          </Typography>
          {formArtifact && (
            <SurveyRuntime
              schema={formArtifact.surveyJsSchema}
              mode="edit"
              initialData={
                (submissionByArtifact.get(formArtifact.id)
                  ?.surveyJsResponses as SurveyResponses | undefined) ?? null
              }
              onComplete={(responses) => {
                if (!formArtifact || !proposal) return
                submitArtifact.mutate({
                  input: {
                    proposalId: proposal.id,
                    projectArtifactId: formArtifact.id,
                    type: 'Form',
                    surveyJsResponses: responses,
                  },
                })
              }}
            />
          )}
          {submitArtifact.error != null && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage(
                submitArtifact.error,
                'Could not save the submission.',
              )}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormArtifact(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </QueryState>
  )
}
