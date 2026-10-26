import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export interface MetricListItem {
  id: string
  label: string
  value: number
  display: string
}

/**
 * Ranked horizontal-bar list used by the "top vendors / officers" cards. Each
 * row shows a label, a proportional bar, and a formatted value.
 */
export function MetricList({ items }: { items: MetricListItem[] }) {
  const max = Math.max(1, ...items.map((i) => i.value))

  return (
    <Stack spacing={1.25}>
      {items.map((item, index) => (
        <Box key={item.id}>
          <Stack
            direction="row"
            sx={{
              justifyContent: 'space-between',
              alignItems: 'baseline',
              mb: 0.25,
            }}
          >
            <Typography variant="body2" noWrap sx={{ pr: 1 }}>
              <Box
                component="span"
                sx={{ color: 'text.secondary', mr: 0.75 }}
              >
                {index + 1}.
              </Box>
              {item.label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, flexShrink: 0 }}>
              {item.display}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={(item.value / max) * 100}
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>
      ))}
    </Stack>
  )
}
