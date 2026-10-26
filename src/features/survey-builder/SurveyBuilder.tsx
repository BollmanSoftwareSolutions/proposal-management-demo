import { useMemo } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import { QuestionEditor } from './QuestionEditor'
import { SurveyRuntime } from '../survey-runtime/SurveyRuntime'
import {
  QUESTION_TYPE_LABELS,
  createQuestion,
  questionsToSchema,
  type BuilderQuestion,
  type BuilderQuestionType,
} from './surveySchema'

const ADD_ORDER: BuilderQuestionType[] = [
  'text',
  'radiogroup',
  'checkbox',
  'dropdown',
]

/**
 * Lightweight MUI survey builder (design-docs/04-ui-ux.md §6). Controlled
 * component: authors add/reorder/remove questions limited to the four supported
 * types and edit title/required/choices. A live preview renders the emitted
 * SurveyJS schema through the runtime. The SurveyJS Creator/Designer is not used.
 */
export function SurveyBuilder({
  questions,
  onChange,
  surveyTitle,
}: {
  questions: BuilderQuestion[]
  onChange: (questions: BuilderQuestion[]) => void
  surveyTitle?: string
}) {
  const previewSchema = useMemo(
    () => questionsToSchema(surveyTitle ?? '', questions),
    [surveyTitle, questions],
  )

  const addQuestion = (type: BuilderQuestionType) => {
    onChange([...questions, createQuestion(type)])
  }

  const updateQuestion = (index: number, next: BuilderQuestion) => {
    onChange(questions.map((q, i) => (i === index ? next : q)))
  }

  const moveQuestion = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= questions.length) return
    const next = [...questions]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  const removeQuestion = (index: number) => {
    onChange(questions.filter((_, i) => i !== index))
  }

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Questions
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ flexWrap: 'wrap' }}
        >
          {ADD_ORDER.map((type) => (
            <Button
              key={type}
              size="small"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => addQuestion(type)}
            >
              {QUESTION_TYPE_LABELS[type]}
            </Button>
          ))}
        </Stack>
      </Box>

      {questions.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            textAlign: 'center',
            borderStyle: 'dashed',
            bgcolor: 'background.default',
          }}
        >
          <Typography color="text.secondary" variant="body2">
            No questions yet. Add one of the supported types above.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={1.5}>
          {questions.map((question, index) => (
            <QuestionEditor
              key={question.id}
              question={question}
              index={index}
              total={questions.length}
              onChange={(next) => updateQuestion(index, next)}
              onMove={moveQuestion}
              onRemove={removeQuestion}
            />
          ))}
        </Stack>
      )}

      {questions.length > 0 && (
        <>
          <Divider textAlign="left">
            <Typography variant="caption" color="text.secondary">
              Live preview
            </Typography>
          </Divider>
          <Paper variant="outlined" sx={{ p: 1 }}>
            <SurveyRuntime schema={previewSchema} mode="display" />
          </Paper>
        </>
      )}
    </Stack>
  )
}
