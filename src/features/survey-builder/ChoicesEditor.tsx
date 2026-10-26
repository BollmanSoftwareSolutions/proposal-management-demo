import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'

/**
 * Edits the `choices` list for radio/checkbox/select questions
 * (design-docs/04-ui-ux.md §6.3). Presentational: values + callbacks in.
 */
export function ChoicesEditor({
  choices,
  onChange,
}: {
  choices: string[]
  onChange: (choices: string[]) => void
}) {
  const update = (index: number, value: string) => {
    onChange(choices.map((c, i) => (i === index ? value : c)))
  }
  const remove = (index: number) => {
    onChange(choices.filter((_, i) => i !== index))
  }
  const add = () => {
    onChange([...choices, `Option ${choices.length + 1}`])
  }

  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        Choices
      </Typography>
      <Stack spacing={1} sx={{ mt: 0.5 }}>
        {choices.map((choice, index) => (
          <Stack
            key={index}
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center' }}
          >
            <TextField
              size="small"
              fullWidth
              value={choice}
              onChange={(e) => update(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              slotProps={{ htmlInput: { 'aria-label': `Choice ${index + 1}` } }}
            />
            <IconButton
              size="small"
              aria-label={`Remove choice ${index + 1}`}
              onClick={() => remove(index)}
              disabled={choices.length <= 1}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
        <Box>
          <Button size="small" startIcon={<AddIcon />} onClick={add}>
            Add choice
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}
