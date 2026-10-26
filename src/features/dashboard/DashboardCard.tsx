import type { ReactNode } from 'react'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

/**
 * Shared card chrome for a dashboard metric card: a titled, outlined surface
 * that fills its grid cell. Keeps every card visually consistent
 * (design-docs/04-ui-ux.md §4.2 card grid).
 */
export function DashboardCard({
  title,
  subheader,
  children,
}: {
  title: string
  subheader?: string
  children: ReactNode
}) {
  return (
    <Paper
      variant="outlined"
      sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Stack spacing={0.25} sx={{ mb: 1.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        {subheader && (
          <Typography variant="caption" color="text.secondary">
            {subheader}
          </Typography>
        )}
      </Stack>
      <div style={{ flexGrow: 1 }}>{children}</div>
    </Paper>
  )
}
