import { describe, expect, it } from 'vitest'
import { seed } from '../store/seed'
import type { ProposalStatus } from '../store/types'

const ALLOWED_QUESTION_TYPES = ['text', 'radiogroup', 'checkbox', 'dropdown']

describe('seed integrity', () => {
  it('produces procurement staff and a dozen vendors', () => {
    const store = seed()
    const vendors = store.users.filter((u) => u.roles.includes('Vendor'))
    const procurement = store.users.filter(
      (u) => u.roles.includes('Lead') || u.roles.includes('Officer'),
    )
    expect(vendors.length).toBeGreaterThanOrEqual(12)
    expect(procurement.length).toBeGreaterThanOrEqual(3)
    expect(store.users.some((u) => u.id === 'user-lead')).toBe(true)
    expect(store.users.some((u) => u.id === 'user-vendor')).toBe(true)
  })

  it('creates a spread of project statuses', () => {
    const store = seed()
    const statuses = new Set(store.projects.map((p) => p.status))
    expect(store.projects.length).toBeGreaterThanOrEqual(12)
    expect(statuses).toContain('Active')
    expect(statuses).toContain('Draft')
    expect(statuses).toContain('InLegal')
    expect(statuses).toContain('Closed')
  })

  it('locks public projects and leaves drafts editable', () => {
    const store = seed()
    for (const project of store.projects) {
      if (project.status === 'Draft') {
        expect(project.isPublic).toBe(false)
      } else {
        expect(project.isPublic).toBe(true)
      }
    }
  })

  it('covers every proposal status', () => {
    const store = seed()
    const present = new Set<ProposalStatus>(
      store.proposals.map((p) => p.status),
    )
    const all: ProposalStatus[] = [
      'SignedUp',
      'Submitted',
      'Filtered',
      'Declined',
      'FollowUp',
      'Finalized',
      'Won',
    ]
    for (const status of all) {
      expect(present).toContain(status)
    }
  })

  it('keeps form artifact schemas limited to the four supported types', () => {
    const store = seed()
    const forms = store.artifactTemplates.filter((t) => t.type === 'Form')
    expect(forms.length).toBeGreaterThan(0)
    for (const form of forms) {
      const schema = form.surveyJsSchema as {
        pages: Array<{ elements: Array<{ type: string }> }>
      }
      for (const page of schema.pages) {
        for (const element of page.elements) {
          expect(ALLOWED_QUESTION_TYPES).toContain(element.type)
        }
      }
    }
  })

  it('references valid projects and vendors from proposals', () => {
    const store = seed()
    const projectIds = new Set(store.projects.map((p) => p.id))
    const vendorIds = new Set(store.users.map((u) => u.id))
    for (const proposal of store.proposals) {
      expect(projectIds.has(proposal.projectId)).toBe(true)
      expect(vendorIds.has(proposal.vendorId)).toBe(true)
    }
  })

  it('gives the demo vendor at least one available project', () => {
    const store = seed()
    const demoProposals = store.proposals.filter(
      (p) => p.vendorId === 'user-vendor',
    )
    const signedUp = new Set(demoProposals.map((p) => p.projectId))
    const declined = new Set(
      store.notInterested
        .filter((n) => n.vendorId === 'user-vendor')
        .map((n) => n.projectId),
    )
    const available = store.projects.filter(
      (p) =>
        p.isPublic &&
        p.status === 'Active' &&
        !signedUp.has(p.id) &&
        !declined.has(p.id),
    )
    expect(available.length).toBeGreaterThan(0)
  })
})
