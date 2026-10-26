import { describe, expect, it } from 'vitest'
import {
  createQuestion,
  isEmptySurveySchema,
  questionsToSchema,
  schemaToQuestions,
  typeHasChoices,
  type BuilderQuestion,
} from '../surveySchema'

describe('survey builder schema helpers', () => {
  it('creates questions with sensible defaults per type', () => {
    const text = createQuestion('text')
    expect(text.type).toBe('text')
    expect(text.isRequired).toBe(false)
    expect(text.choices).toEqual([])

    const radio = createQuestion('radiogroup')
    expect(typeHasChoices(radio.type)).toBe(true)
    expect(radio.choices.length).toBeGreaterThan(0)
  })

  it('emits a SurveyJS-compatible schema from questions', () => {
    const questions: BuilderQuestion[] = [
      {
        id: '1',
        name: 'q_name',
        title: 'Your name',
        type: 'text',
        isRequired: true,
        choices: [],
      },
      {
        id: '2',
        name: 'q_pick',
        title: 'Pick one',
        type: 'radiogroup',
        isRequired: false,
        choices: ['A', 'B', ''],
      },
    ]
    const schema = questionsToSchema('Demo', questions) as {
      title: string
      pages: Array<{ elements: Array<Record<string, unknown>> }>
    }
    expect(schema.title).toBe('Demo')
    const elements = schema.pages[0].elements
    expect(elements).toHaveLength(2)
    expect(elements[0]).toMatchObject({
      type: 'text',
      name: 'q_name',
      title: 'Your name',
      isRequired: true,
    })
    expect(elements[0].choices).toBeUndefined()
    // Blank choices are stripped.
    expect(elements[1].choices).toEqual(['A', 'B'])
  })

  it('parses an existing schema back into questions and ignores unsupported types', () => {
    const schema = {
      title: 'Contact',
      pages: [
        {
          name: 'page1',
          elements: [
            { type: 'text', name: 'contactName', title: 'Name', isRequired: true },
            {
              type: 'checkbox',
              name: 'sectors',
              title: 'Sectors',
              choices: ['Public', { value: 'private', text: 'Private' }],
            },
            { type: 'rating', name: 'score', title: 'Unsupported' },
          ],
        },
      ],
    }
    const questions = schemaToQuestions(schema)
    expect(questions).toHaveLength(2)
    expect(questions[0]).toMatchObject({
      name: 'contactName',
      type: 'text',
      isRequired: true,
    })
    expect(questions[1].type).toBe('checkbox')
    expect(questions[1].choices).toEqual(['Public', 'Private'])
  })

  it('round-trips questions through schema without losing supported data', () => {
    const original = [createQuestion('text'), createQuestion('dropdown')].map(
      (q, i) => ({ ...q, title: `Q${i}`, name: `field_${i}` }),
    )
    const parsed = schemaToQuestions(questionsToSchema('', original))
    expect(parsed.map((q) => q.name)).toEqual(['field_0', 'field_1'])
    expect(parsed.map((q) => q.type)).toEqual(['text', 'dropdown'])
  })

  it('detects empty schemas', () => {
    expect(isEmptySurveySchema(undefined)).toBe(true)
    expect(isEmptySurveySchema({ pages: [{ elements: [] }] })).toBe(true)
    expect(
      isEmptySurveySchema({
        pages: [{ elements: [{ type: 'text', name: 'a' }] }],
      }),
    ).toBe(false)
  })
})
