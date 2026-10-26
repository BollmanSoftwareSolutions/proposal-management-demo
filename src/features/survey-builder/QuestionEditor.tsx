import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import { ChoicesEditor } from './ChoicesEditor'
import {
  QUESTION_TYPE_LABELS,
  typeHasChoices,
  type BuilderQuestion,
} from './surveySchema'

/**
 * Per-question editor (design-docs/04-ui-ux.md §6.3): title input, required
 * toggle, type indicator, reorder (up/down) and delete controls, plus a
 * ChoicesEditor for choice-based question types.
 */
export function QuestionEditor({
  question,
  index,
  total,
  onChange,
  onMove,
  onRemove,
}: {
  question: BuilderQuestion
  index: number
  total: number
  onChange: (next: BuilderQuestion) => void
  onMove: (index: number, direction: -1 | 1) => void
  onRemove: (index: number) => void
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Chip size="small" label={QUESTION_TYPE_LABELS[question.type]} />
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Move up">
              <span>
                <IconButton
                  size="small"
                  aria-label={`Move question ${index + 1} up`}
                  onClick={() => onMove(index, -1)}
                  disabled={index === 0}
                >
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Move down">
              <span>
                <IconButton
                  size="small"
                  aria-label={`Move question ${index + 1} down`}
                  onClick={() => onMove(index, 1)}
                  disabled={index === total - 1}
                >
                  <ArrowDownwardIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Remove question">
              <IconButton
                size="small"
                color="error"
                aria-label={`Remove question ${index + 1}`}
                onClick={() => onRemove(index)}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <TextField
          size="small"
          fullWidth
          label="Question title"
          value={question.title}
          onChange={(e) => onChange({ ...question, title: e.target.value })}
        />

        <FormControlLabel
          control={
            <Switch
              checked={question.isRequired}
              onChange={(e) =>
                onChange({ ...question, isRequired: e.target.checked })
              }
            />
          }
          label="Required"
        />

        {typeHasChoices(question.type) && (
          <Box>
            <ChoicesEditor
              choices={question.choices}
              onChange={(choices) => onChange({ ...question, choices })}
            />
          </Box>
        )}
      </Stack>
    </Paper>
  )
}
