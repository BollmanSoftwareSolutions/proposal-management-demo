import { beforeEach, describe, expect, it } from 'vitest'
import { getStore, resetStore } from '../store/store'
import type { User } from '../store/types'
import { AccessError } from '../resolvers/access'
import * as queries from '../resolvers/queries'
import * as mutations from '../resolvers/index'

function user(id: string): User {
  const found = getStore().users.find((u) => u.id === id)
  if (!found) throw new Error(`Test setup: missing user ${id}`)
  return found
}

const lead = () => user('user-lead')
const vendor = () => user('user-vendor')

describe('vendor queries', () => {
  beforeEach(resetStore)

  it('returns only the acting vendor solicitations', () => {
    const result = queries.mySolicitations(vendor())
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((s) => s.vendorId === 'user-vendor')).toBe(true)
  })

  it('returns only shared artifact templates', () => {
    const result = queries.sharedArtifacts(vendor())
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((t) => t.shared)).toBe(true)
  })

  it('excludes signed-up and not-interested projects from availableProjects', () => {
    const store = getStore()
    const available = queries.availableProjects(vendor())
    const availableIds = new Set(available.map((p) => p.id))
    const signedUp = store.proposals
      .filter((p) => p.vendorId === 'user-vendor')
      .map((p) => p.projectId)
    const declined = store.notInterested
      .filter((n) => n.vendorId === 'user-vendor')
      .map((n) => n.projectId)
    for (const id of [...signedUp, ...declined]) {
      expect(availableIds.has(id)).toBe(false)
    }
    expect(available.every((p) => p.isPublic && p.status === 'Active')).toBe(
      true,
    )
  })

  it('requires the vendor role for vendor queries', () => {
    expect(() => queries.mySolicitations(lead())).toThrowError(AccessError)
    expect(() => queries.sharedArtifacts(lead())).toThrowError(AccessError)
    expect(() => queries.availableProjects(lead())).toThrowError(AccessError)
  })
})

describe('vendor sign-up and not-interested flow', () => {
  beforeEach(resetStore)

  it('signs up for an available project and clears any decline', () => {
    const project = queries.availableProjects(vendor())[0]
    expect(project).toBeDefined()
    const proposal = mutations.signUp(vendor(), project.id)
    expect(proposal.vendorId).toBe('user-vendor')
    expect(proposal.status).toBe('SignedUp')
    // No longer available once signed up.
    const stillAvailable = queries
      .availableProjects(vendor())
      .some((p) => p.id === project.id)
    expect(stillAvailable).toBe(false)
  })

  it('marks a project not interested and reconsiders it', () => {
    const project = queries.availableProjects(vendor())[0]
    mutations.markNotInterested(vendor(), project.id)
    expect(
      queries.availableProjects(vendor()).some((p) => p.id === project.id),
    ).toBe(false)
    expect(
      queries
        .notInterestedProjects(vendor())
        .some((p) => p.id === project.id),
    ).toBe(true)

    mutations.reconsiderProject(vendor(), project.id)
    expect(
      queries
        .notInterestedProjects(vendor())
        .some((p) => p.id === project.id),
    ).toBe(false)
    expect(
      queries.availableProjects(vendor()).some((p) => p.id === project.id),
    ).toBe(true)
  })
})

describe('vendor proposal completion', () => {
  beforeEach(resetStore)

  function vendorProposal() {
    const found = getStore().proposals.find((p) => p.vendorId === 'user-vendor')
    if (!found) throw new Error('Test setup: expected a vendor proposal')
    return found
  }

  it('submits a document artifact against the vendor proposal', () => {
    const proposal = vendorProposal()
    const artifact = getStore().projects.find(
      (p) => p.id === proposal.projectId,
    )?.artifacts[0]
    if (!artifact) throw new Error('Test setup: expected a project artifact')
    const submission = mutations.submitArtifact(vendor(), {
      proposalId: proposal.id,
      projectArtifactId: artifact.id,
      type: 'Document',
      documentName: 'capabilities.pdf',
    })
    expect(submission.documentName).toBe('capabilities.pdf')
    expect(submission.proposalId).toBe(proposal.id)
  })

  it('adds an additional item and rejects other vendors', () => {
    const proposal = vendorProposal()
    const item = mutations.addAdditionalItem(
      vendor(),
      proposal.id,
      'References',
      'Three prior clients',
    )
    expect(item.name).toBe('References')
    expect(item.note).toBe('Three prior clients')
    expect(
      getStore()
        .proposals.find((p) => p.id === proposal.id)
        ?.additionalItems.some((i) => i.id === item.id),
    ).toBe(true)
    expect(() =>
      mutations.addAdditionalItem(lead(), proposal.id, 'x'),
    ).toThrowError(AccessError)
  })

  it('submits the proposal, advancing it to Submitted', () => {
    const existing = getStore().proposals.find(
      (p) => p.vendorId === 'user-vendor' && p.status === 'SignedUp',
    )
    const proposalId =
      existing?.id ??
      mutations.signUp(vendor(), queries.availableProjects(vendor())[0].id).id
    const result = mutations.submitProposal(vendor(), proposalId)
    expect(result.status).toBe('Submitted')
  })
})

describe('vendor demographics', () => {
  beforeEach(resetStore)

  it('returns the acting identity from me', () => {
    expect(queries.me(vendor()).id).toBe('user-vendor')
    expect(queries.me(lead()).id).toBe('user-lead')
  })

  it('updates only the provided demographic fields on the acting user', () => {
    const before = vendor()
    const originalEmail = before.email
    const updated = mutations.updateDemographics(vendor(), {
      companyName: 'Rebranded Supplies',
      jurisdiction: 'Oregon',
    })
    expect(updated.companyName).toBe('Rebranded Supplies')
    expect(updated.jurisdiction).toBe('Oregon')
    // Omitted fields are untouched.
    expect(updated.email).toBe(originalEmail)
    // Change persists in the store.
    expect(
      getStore().users.find((u) => u.id === 'user-vendor')?.companyName,
    ).toBe('Rebranded Supplies')
  })
})
