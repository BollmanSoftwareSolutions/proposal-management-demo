import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import { SurveyRuntime } from './SurveyRuntime'
import { isEmptySurveySchema } from '../survey-builder/surveySchema'

/**
 * Read-only artifact preview (design-docs/04-ui-ux.md §6.2). Renders a saved
 * SurveyJS schema through the runtime in display mode so procurement staff see
 * exactly what vendors will complete.
 */
export function SurveyPreviewDialog({
  open,
  title,
  schema,
  onClose,
}: {
  open: boolean
  title: string
  schema: unknown
  onClose: () => void
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {isEmptySurveySchema(schema) ? (
          <Typography color="text.secondary">
            This form has no questions yet.
          </Typography>
        ) : (
          <SurveyRuntime schema={schema} mode="display" />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
