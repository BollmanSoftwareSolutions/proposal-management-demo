import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

export interface Kpi {
  label: string
  value: string
}

/**
 * Full-width KPI strip shown above the dashboard card grid
 * (design-docs/04-ui-ux.md §4.2). Collapses from a row to a single column on
 * small screens.
 */
export function KpiStrip({ items }: { items: Kpi[] }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: '1fr',
          sm: '1fr 1fr',
          md: `repeat(${items.length}, 1fr)`,
        },
      }}
    >
      {items.map((kpi) => (
        <Paper key={kpi.label} variant="outlined" sx={{ p: 2.5 }}>
          <Typography variant="overline" color="text.secondary">
            {kpi.label}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {kpi.value}
          </Typography>
        </Paper>
      ))}
    </Box>
  )
}
