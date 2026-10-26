/**
 * SurveyJS-compatible schema helpers for the custom MUI survey builder
 * (design-docs/04-ui-ux.md §6). The builder is deliberately limited to the four
 * supported question types and emits a standard SurveyJS schema
 * (`{ title, pages: [{ elements: [...] }] }`) so the runtime renders it unchanged.
 */

export type BuilderQuestionType = 'text' | 'radiogroup' | 'checkbox' | 'dropdown'

export interface BuilderQuestion {
  /** Stable React key for list rendering/reordering. */
  id: string
  /** SurveyJS field name (response key). */
  name: string
  title: string
  type: BuilderQuestionType
  isRequired: boolean
  /** Only used by radiogroup/checkbox/dropdown. */
  choices: string[]
}

export const QUESTION_TYPE_LABELS: Record<BuilderQuestionType, string> = {
  text: 'Text field',
  radiogroup: 'Radio group',
  checkbox: 'Checkbox group',
  dropdown: 'Dropdown',
}

const CHOICE_TYPES: BuilderQuestionType[] = ['radiogroup', 'checkbox', 'dropdown']

export function typeHasChoices(type: BuilderQuestionType): boolean {
  return CHOICE_TYPES.includes(type)
}

function uid(): string {
  return globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)
}

export function createQuestion(type: BuilderQuestionType): BuilderQuestion {
  const id = uid()
  return {
    id,
    name: `question_${id.slice(0, 8)}`,
    title: '',
    type,
    isRequired: false,
    choices: typeHasChoices(type) ? ['Option 1', 'Option 2'] : [],
  }
}

interface SurveyElement {
  type?: string
  name?: string
  title?: string
  isRequired?: boolean
  choices?: unknown[]
}

function collectElements(schema: unknown): SurveyElement[] {
  if (!schema || typeof schema !== 'object') return []
  const obj = schema as { pages?: unknown; elements?: unknown }
  const elements: SurveyElement[] = []
  if (Array.isArray(obj.elements)) {
    elements.push(...(obj.elements as SurveyElement[]))
  }
  if (Array.isArray(obj.pages)) {
    for (const page of obj.pages as Array<{ elements?: unknown }>) {
      if (Array.isArray(page.elements)) {
        elements.push(...(page.elements as SurveyElement[]))
      }
    }
  }
  return elements
}

function choiceToString(choice: unknown): string {
  if (typeof choice === 'string') return choice
  if (choice && typeof choice === 'object') {
    const obj = choice as { text?: unknown; value?: unknown }
    if (typeof obj.text === 'string') return obj.text
    if (typeof obj.value === 'string') return obj.value
    if (obj.value != null) return String(obj.value)
  }
  return String(choice)
}

const SUPPORTED_TYPES: BuilderQuestionType[] = [
  'text',
  'radiogroup',
  'checkbox',
  'dropdown',
]

/** Parse an existing SurveyJS schema into builder questions (for editing). */
export function schemaToQuestions(schema: unknown): BuilderQuestion[] {
  return collectElements(schema)
    .filter((el): el is SurveyElement & { type: BuilderQuestionType } =>
      SUPPORTED_TYPES.includes(el.type as BuilderQuestionType),
    )
    .map((el) => {
      const type = el.type
      const id = uid()
      return {
        id,
        name: typeof el.name === 'string' ? el.name : `question_${id.slice(0, 8)}`,
        title: typeof el.title === 'string' ? el.title : '',
        type,
        isRequired: Boolean(el.isRequired),
        choices: typeHasChoices(type)
          ? (el.choices ?? []).map(choiceToString)
          : [],
      }
    })
}

/** Emit a SurveyJS-compatible schema from builder questions. */
export function questionsToSchema(
  title: string,
  questions: BuilderQuestion[],
): unknown {
  return {
    title: title || undefined,
    pages: [
      {
        name: 'page1',
        elements: questions.map((q) => {
          const element: SurveyElement = {
            type: q.type,
            name: q.name,
            title: q.title || q.name,
            isRequired: q.isRequired,
          }
          if (typeHasChoices(q.type)) {
            element.choices = q.choices.filter((c) => c.trim() !== '')
          }
          return element
        }),
      },
    ],
  }
}

/** True when the schema contains no supported questions. */
export function isEmptySurveySchema(schema: unknown): boolean {
  return schemaToQuestions(schema).length === 0
}
