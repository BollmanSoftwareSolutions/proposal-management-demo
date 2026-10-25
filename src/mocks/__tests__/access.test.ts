import { describe, expect, it } from 'vitest'
import { getStore } from '../store/store'
import type { Project, User } from '../store/types'
import { AccessError } from '../resolvers/access'
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

function firstProject(predicate: (p: Project) => boolean): Project {
  const found = getStore().projects.find(predicate)
  if (!found) throw new Error('Test setup: no matching project')
  return found
}

describe('resolver access control', () => {
  it('lets procurement read the dashboard but blocks vendors', () => {
    expect(() => queries.dashboard(lead())).not.toThrow()
    expect(() => queries.dashboard(vendor())).toThrowError(AccessError)
  })

  it('blocks vendors from the procurement projects and vendors lists', () => {
    expect(() => queries.projects(vendor())).toThrowError(AccessError)
    expect(() => queries.vendors(vendor())).toThrowError(AccessError)
  })

  it('scopes myProposals to the acting vendor and rejects procurement', () => {
    expect(() => queries.myProposals(lead())).toThrowError(AccessError)
    const mine = queries.myProposals(vendor())
    expect(mine.every((p) => p.vendorId === 'user-vendor')).toBe(true)
  })

  it('hides non-public projects from vendors', () => {
    const draft = firstProject((p) => !p.isPublic)
    expect(() => queries.project(vendor(), draft.id)).toThrowError(AccessError)

    const active = firstProject((p) => p.isPublic)
    const result = queries.project(vendor(), active.id)
    expect(result?.id).toBe(active.id)
  })

  it('lets procurement read any project', () => {
    const draft = firstProject((p) => !p.isPublic)
    expect(queries.project(officer(), draft.id)?.id).toBe(draft.id)
  })

  it('restricts lead-only mutations to leads', () => {
    const proposal = getStore().proposals[0]
    expect(() =>
      mutations.approveRound(officer(), proposal.id, true),
    ).toThrowError(AccessError)
    expect(() =>
      mutations.approveRound(lead(), proposal.id, true),
    ).not.toThrow()
  })

  it('restricts project creation to procurement', () => {
    const area = getStore().projectAreas[0]
    const input = {
      name: 'Test',
      projectAreaId: area.id,
      estimatedValue: 1000,
      outline: 'o',
      scope: 's',
      openDate: new Date().toISOString(),
      closeDate: new Date().toISOString(),
      assignedLeadId: 'user-lead',
    }
    expect(() => mutations.createProject(vendor(), input)).toThrowError(
      AccessError,
    )
    expect(() => mutations.createProject(officer(), input)).not.toThrow()
  })

  it('prevents a vendor from submitting against another vendor proposal', () => {
    const otherProposal = getStore().proposals.find(
      (p) => p.vendorId !== 'user-vendor',
    )
    if (!otherProposal) throw new Error('Test setup: need another vendor')
    expect(() =>
      mutations.submitArtifact(vendor(), {
        proposalId: otherProposal.id,
        projectArtifactId: 'whatever',
        type: 'Document',
        documentName: 'x.pdf',
      }),
    ).toThrowError(AccessError)
  })

  it('locks editing of a public project', () => {
    const active = firstProject((p) => p.isPublic)
    expect(() =>
      mutations.updateProject(officer(), active.id, { name: 'new' }),
    ).toThrowError(AccessError)
  })
})
