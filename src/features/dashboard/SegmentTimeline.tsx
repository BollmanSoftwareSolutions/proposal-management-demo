import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { SegmentEventKind } from '../../graphql/generated/graphql'
import { AppLink } from '../../components/common/AppLink'
import { formatDate } from '../../lib/format'

export interface SegmentEvent {
  projectId: string
  projectName: string
  segmentTitle: string
  date: string
  kind: SegmentEventKind
}

/**
 * Compact chronological timeline of segment open/close events for the
 * procurement dashboard (design-docs/04-ui-ux.md §4.2, card C3).
 */
export function SegmentTimeline({ events }: { events: SegmentEvent[] }) {
  return (
    <Stack spacing={1.5} sx={{ maxHeight: 260, overflowY: 'auto', pr: 0.5 }}>
      {events.map((event, index) => (
        <Stack
          key={`${event.projectId}-${event.segmentTitle}-${event.kind}-${index}`}
          direction="row"
          spacing={1.5}
          sx={{ alignItems: 'flex-start' }}
        >
          <Box sx={{ minWidth: 92, flexShrink: 0 }}>
            <Typography variant="caption" color="text.secondary">
              {formatDate(event.date)}
            </Typography>
          </Box>
          <Chip
            size="small"
            label={event.kind === 'Open' ? 'Opens' : 'Closes'}
            color={event.kind === 'Open' ? 'success' : 'warning'}
            variant="outlined"
            sx={{ flexShrink: 0 }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" noWrap>
              <AppLink
                to="/projects/$projectId"
                params={{ projectId: event.projectId }}
              >
                {event.projectName}
              </AppLink>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {event.segmentTitle}
            </Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
  )
}
