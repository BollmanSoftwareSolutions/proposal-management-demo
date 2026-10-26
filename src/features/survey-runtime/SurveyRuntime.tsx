import { Suspense, lazy } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import type { SurveyRuntimeProps } from './SurveyRuntimeImpl'

export type { SurveyResponses, SurveyRuntimeProps } from './SurveyRuntimeImpl'

/**
 * Lazy entry point for the SurveyJS runtime. The `survey-core` / `survey-react-ui`
 * bundle (and its CSS) is code-split into its own chunk so it loads only when a
 * form is previewed or completed (design-docs/06-execution-plan.md §6 risk).
 */
const SurveyRuntimeImpl = lazy(() => import('./SurveyRuntimeImpl'))

export function SurveyRuntime(props: SurveyRuntimeProps) {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      }
    >
      <SurveyRuntimeImpl {...props} />
    </Suspense>
  )
}
