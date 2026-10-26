import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useSharedArtifactsQuery } from '../../graphql/generated/graphql'
import { QueryState } from '../../components/common/QueryState'

/**
 * Shared Artifacts for vendors (design-docs/04-ui-ux.md §4.13): templates reused
 * across projects. Vendors pre-complete them once and the responses apply to any
 * project they later sign up for. The interactive completion runtime (SurveyJS)
 * and response copy-forward land in Phase 6.
 */
export function SharedArtifactsList() {
  const artifactsQuery = useSharedArtifactsQuery()
  const artifacts = artifactsQuery.data?.sharedArtifacts ?? []

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
          {artifacts.map((artifact) => (
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
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {artifact.description}
                  </Typography>
                </Box>
                <Button variant="outlined" disabled sx={{ flexShrink: 0 }}>
                  Pre-complete
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </QueryState>

      <Alert severity="info" sx={{ mt: 3 }}>
        Pre-completing shared artifacts opens with the SurveyJS runtime in
        Phase 6; saved responses will then pre-fill matching artifacts on any
        project you sign up for.
      </Alert>
    </Box>
  )
}
