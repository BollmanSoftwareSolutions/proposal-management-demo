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
import Typography from '@mui/material/Typography'
import { useQueryClient } from '@tanstack/react-query'
import {
  useMySharedArtifactResponsesQuery,
  useSaveSharedArtifactResponseMutation,
  useSharedArtifactsQuery,
  type SharedArtifactsQuery,
} from '../../graphql/generated/graphql'
import { QueryState } from '../../components/common/QueryState'
import { errorMessage } from '../../lib/errors'
import { formatDate } from '../../lib/format'
import { SurveyRuntime, type SurveyResponses } from '../survey-runtime/SurveyRuntime'

type SharedArtifact = SharedArtifactsQuery['sharedArtifacts'][number]

/**
 * Shared Artifacts for vendors (design-docs/04-ui-ux.md §4.13): templates reused
 * across projects. Vendors pre-complete them once with the SurveyJS runtime and
 * the responses pre-fill matching project artifacts on any project they sign up
 * for (copied into the proposal's submissions).
 */
export function SharedArtifactsList() {
  const queryClient = useQueryClient()
  const artifactsQuery = useSharedArtifactsQuery()
  const responsesQuery = useMySharedArtifactResponsesQuery()
  const artifacts = artifactsQuery.data?.sharedArtifacts ?? []

  const [active, setActive] = useState<SharedArtifact | null>(null)

  const sharedResponses = responsesQuery.data?.mySharedArtifactResponses

  const responseByTemplate = useMemo(() => {
    const map = new Map<string, NonNullable<typeof sharedResponses>[number]>()
    for (const r of sharedResponses ?? []) {
      map.set(r.templateId, r)
    }
    return map
  }, [sharedResponses])

  const saveResponse = useSaveSharedArtifactResponseMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: useMySharedArtifactResponsesQuery.getKey(),
      })
      setActive(null)
    },
  })

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Shared Artifacts
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Artifacts reused across projects. Pre-complete them once and your
        responses apply to any project you later sign up for.
      </Typography>

      <QueryState
        isLoading={artifactsQuery.isLoading}
        error={artifactsQuery.error}
        isEmpty={artifacts.length === 0}
        emptyMessage="No shared artifacts are available yet."
      >
        <Stack spacing={2}>
          {artifacts.map((artifact) => {
            const response = responseByTemplate.get(artifact.id)
            const isForm = artifact.type === 'Form'
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
                      {response && (
                        <Chip size="small" color="success" label="Completed" />
                      )}
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {artifact.description}
                    </Typography>
                    {response && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mt: 1 }}
                      >
                        Saved {formatDate(response.updatedAt)}
                      </Typography>
                    )}
                  </Box>
                  <Button
                    variant={response ? 'outlined' : 'contained'}
                    sx={{ flexShrink: 0 }}
                    disabled={!isForm}
                    onClick={() => setActive(artifact)}
                  >
                    {response ? 'Edit responses' : 'Pre-complete'}
                  </Button>
                </Stack>
              </Paper>
            )
          })}
        </Stack>
      </QueryState>

      <Alert severity="info" sx={{ mt: 3 }}>
        Pre-completed shared artifacts pre-fill matching artifacts on any project
        you sign up for; existing proposals are updated immediately. Document
        shared artifacts are provided per project.
      </Alert>

      <Dialog
        open={Boolean(active)}
        onClose={() => setActive(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{active?.title}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Complete this form once. Your responses pre-fill matching project
            artifacts.
          </Typography>
          {active && (
            <SurveyRuntime
              schema={active.surveyJsSchema}
              mode="edit"
              initialData={
                (responseByTemplate.get(active.id)
                  ?.surveyJsResponses as SurveyResponses | undefined) ?? null
              }
              onComplete={(responses) => {
                if (!active) return
                saveResponse.mutate({
                  templateId: active.id,
                  surveyJsResponses: responses,
                })
              }}
            />
          )}
          {saveResponse.error != null && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage(saveResponse.error, 'Could not save responses.')}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActive(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
