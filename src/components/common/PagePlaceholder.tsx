import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

/**
 * Shared scaffold for Phase 2 route pages: a page title, a short description,
 * and an optional note. Feature content replaces the body in later phases, so
 * pages render a consistent empty-state until then.
 */
export function PagePlaceholder({
  title,
  description,
  note,
  children,
}: {
  title: string
  description?: string
  note?: string
  children?: ReactNode
}) {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 720 }}>
          {description}
        </Typography>
      )}
      {children}
      {note && (
        <Paper
          variant="outlined"
          sx={{
            mt: 3,
            p: 3,
            borderStyle: 'dashed',
            bgcolor: 'background.default',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {note}
          </Typography>
        </Paper>
      )}
    </Box>
  )
}
