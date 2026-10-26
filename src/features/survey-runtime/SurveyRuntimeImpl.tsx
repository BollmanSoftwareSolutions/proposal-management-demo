import { useEffect, useMemo } from 'react'
import { Model } from 'survey-core'
import { Survey } from 'survey-react-ui'
import 'survey-core/survey-core.css'

export type SurveyResponses = Record<string, unknown>

export interface SurveyRuntimeProps {
  schema: unknown
  mode?: 'edit' | 'display'
  initialData?: SurveyResponses | null
  onComplete?: (responses: SurveyResponses) => void
}

/**
 * Thin wrapper around the SurveyJS runtime (`survey-react-ui`). Renders a stored
 * SurveyJS-compatible schema for read-only preview (`mode="display"`) or vendor
 * completion (`mode="edit"`). The authoring surface is the custom MUI survey
 * builder — the SurveyJS Creator/Designer is intentionally not used.
 */
export function SurveyRuntime({
  schema,
  mode = 'edit',
  initialData,
  onComplete,
}: SurveyRuntimeProps) {
  const model = useMemo(() => {
    const survey = new Model(schema ?? {})
    survey.showCompleteButton = mode === 'edit'
    survey.showProgressBar = 'off'
    if (mode === 'display') {
      survey.mode = 'display'
    }
    if (initialData) {
      survey.data = { ...initialData }
    }
    return survey
  }, [schema, mode, initialData])

  useEffect(() => {
    if (!onComplete) return
    const handler = (sender: Model) => {
      onComplete(sender.data as SurveyResponses)
    }
    model.onComplete.add(handler)
    return () => {
      model.onComplete.remove(handler)
    }
  }, [model, onComplete])

  return <Survey model={model} />
}

export default SurveyRuntime
