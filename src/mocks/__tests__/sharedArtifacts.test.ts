import { beforeEach, describe, expect, it } from 'vitest'
import { getStore, resetStore } from '../store/store'
import type { User } from '../store/types'
import { AccessError, NotFoundError } from '../resolvers/access'
import * as queries from '../resolvers/queries'
import * as mutations from '../resolvers/index'

function user(id: string): User {
  const found = getStore().users.find((u) => u.id === id)
  if (!found) throw new Error(`Test setup: missing user ${id}`)
  return found
}

const lead = () => user('user-lead')
const officer = () => user('user-officer')
const vendor = () => user('user-vendor')

function sharedFormTemplate() {
  const tmpl = getStore().artifactTemplates.find(
    (t) => t.shared && t.type === 'Form',
  )
  if (!tmpl) throw new Error('Test setup: expected a shared Form template')
  return tmpl
}

describe('shared artifact responses', () => {
  beforeEach(resetStore)

  it('saves and returns the acting vendor responses (upsert)', () => {
    const tmpl = sharedFormTemplate()
    const saved = mutations.saveSharedArtifactResponse(vendor(), tmpl.id, {
      contactName: 'Vera',
    })
    expect(saved.vendorId).toBe('user-vendor')
    expect(saved.templateId).toBe(tmpl.id)
    expect(saved.surveyJsResponses).toEqual({ contactName: 'Vera' })

    const first = queries.mySharedArtifactResponses(vendor())
    expect(first).toHaveLength(1)

    // Saving again updates in place rather than appending.
    const updated = mutations.saveSharedArtifactResponse(vendor(), tmpl.id, {
      contactName: 'Vera Updated',
    })
    expect(updated.id).toBe(saved.id)
    expect(queries.mySharedArtifactResponses(vendor())).toHaveLength(1)
    expect(
      queries.mySharedArtifactResponses(vendor())[0].surveyJsResponses,
    ).toEqual({ contactName: 'Vera Updated' })
  })

  it('enforces the vendor role and rejects unknown/non-shared templates', () => {
    const tmpl = sharedFormTemplate()
    expect(() =>
      mutations.saveSharedArtifactResponse(lead(), tmpl.id, {}),
    ).toThrowError(AccessError)
    expect(() => queries.mySharedArtifactResponses(lead())).toThrowError(
      AccessError,
    )
    expect(() =>
      mutations.saveSharedArtifactResponse(vendor(), 'tmpl-missing', {}),
    ).toThrowError(NotFoundError)
    const nonShared = getStore().artifactTemplates.find((t) => !t.shared)
    if (nonShared) {
      expect(() =>
        mutations.saveSharedArtifactResponse(vendor(), nonShared.id, {}),
      ).toThrowError(NotFoundError)
    }
  })

  it('copies pre-completed responses into a new proposal on sign-up', () => {
    const tmpl = sharedFormTemplate()
    const project = queries.availableProjects(vendor())[0]
    expect(project).toBeDefined()
    const artifact = mutations.addProjectArtifact(officer(), project.id, {
      templateId: tmpl.id,
      title: tmpl.title,
      description: tmpl.description,
      type: 'Form',
      surveyJsSchema: tmpl.surveyJsSchema,
    })

    mutations.saveSharedArtifactResponse(vendor(), tmpl.id, {
      contactName: 'Vera',
    })

    const proposal = mutations.signUp(vendor(), project.id)
    const submission = getStore()
      .proposals.find((p) => p.id === proposal.id)
      ?.submissions.find((s) => s.projectArtifactId === artifact.id)
    expect(submission).toBeDefined()
    expect(submission?.type).toBe('Form')
    expect(submission?.surveyJsResponses).toEqual({ contactName: 'Vera' })
  })

  it('propagates saved responses into existing proposals', () => {
    const tmpl = sharedFormTemplate()
    const project = queries.availableProjects(vendor())[0]
    const proposal = mutations.signUp(vendor(), project.id)
    const artifact = mutations.addProjectArtifact(officer(), project.id, {
      templateId: tmpl.id,
      title: tmpl.title,
      description: tmpl.description,
      type: 'Form',
      surveyJsSchema: tmpl.surveyJsSchema,
    })

    mutations.saveSharedArtifactResponse(vendor(), tmpl.id, {
      contactName: 'Vera',
    })

    const submission = getStore()
      .proposals.find((p) => p.id === proposal.id)
      ?.submissions.find((s) => s.projectArtifactId === artifact.id)
    expect(submission?.surveyJsResponses).toEqual({ contactName: 'Vera' })
  })
})

describe('artifact template management', () => {
  beforeEach(resetStore)

  it('creates, updates, and deletes templates (Lead only)', () => {
    const before = getStore().artifactTemplates.length
    const created = mutations.createArtifactTemplate(lead(), {
      title: 'Insurance Form',
      description: 'Proof of coverage.',
      type: 'Form',
      shared: true,
      surveyJsSchema: {
        pages: [{ elements: [{ type: 'text', name: 'policy' }] }],
      },
    })
    expect(created.shared).toBe(true)
    expect(getStore().artifactTemplates).toHaveLength(before + 1)

    const updated = mutations.updateArtifactTemplate(lead(), created.id, {
      title: 'Insurance Form v2',
      description: 'Updated.',
      type: 'Document',
      shared: false,
    })
    expect(updated.title).toBe('Insurance Form v2')
    expect(updated.type).toBe('Document')
    // Switching away from Form clears the schema.
    expect(updated.surveyJsSchema).toBeUndefined()
    expect(updated.shared).toBe(false)

    expect(mutations.deleteArtifactTemplate(lead(), created.id)).toBe(true)
    expect(getStore().artifactTemplates).toHaveLength(before)
  })

  it('rejects template management by non-Lead roles', () => {
    const input = {
      title: 'X',
      description: 'Y',
      type: 'Document' as const,
      shared: false,
    }
    expect(() =>
      mutations.createArtifactTemplate(officer(), input),
    ).toThrowError(AccessError)
    expect(() =>
      mutations.createArtifactTemplate(vendor(), input),
    ).toThrowError(AccessError)
    const existing = getStore().artifactTemplates[0]
    expect(() =>
      mutations.updateArtifactTemplate(officer(), existing.id, input),
    ).toThrowError(AccessError)
    expect(() =>
      mutations.deleteArtifactTemplate(officer(), existing.id),
    ).toThrowError(AccessError)
  })

  it('throws NotFoundError for unknown template ids', () => {
    const input = {
      title: 'X',
      description: 'Y',
      type: 'Document' as const,
      shared: false,
    }
    expect(() =>
      mutations.updateArtifactTemplate(lead(), 'tmpl-missing', input),
    ).toThrowError(NotFoundError)
    expect(() =>
      mutations.deleteArtifactTemplate(lead(), 'tmpl-missing'),
    ).toThrowError(NotFoundError)
  })
})

