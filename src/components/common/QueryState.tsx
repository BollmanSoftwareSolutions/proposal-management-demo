import type { ReactNode } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

/**
 * Standard loading / error / empty wrapper for data-driven sections so every
 * page renders consistent states (design-docs/04-ui-ux.md §8).
 */
export function QueryState({
  isLoading,
  error,
  isEmpty,
  emptyMessage = 'Nothing to show yet.',
  children,
}: {
  isLoading: boolean
  error?: unknown
  isEmpty?: boolean
  emptyMessage?: string
  children: ReactNode
}) {
  if (isLoading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', py: 6 }}
        role="status"
        aria-label="Loading"
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    const message =
      error instanceof Error ? error.message : 'Something went wrong.'
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {message}
      </Alert>
    )
  }

  if (isEmpty) {
    return (
      <Paper
        variant="outlined"
        sx={{
          my: 2,
          p: 4,
          textAlign: 'center',
          borderStyle: 'dashed',
          bgcolor: 'background.default',
        }}
      >
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Paper>
    )
  }

  return <>{children}</>
}
