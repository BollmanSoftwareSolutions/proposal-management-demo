import { beforeEach, describe, expect, it } from 'vitest'
import { getStore, resetStore } from '../store/store'
import type { Proposal, User } from '../store/types'
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

function firstProposal(predicate: (p: Proposal) => boolean): Proposal {
  const found = getStore().proposals.find(predicate)
  if (!found) throw new Error('Test setup: no matching proposal')
  return found
}

describe('procurement project-detail queries', () => {
  beforeEach(resetStore)

  it('requires procurement for the new project-detail queries', () => {
    const projectId = getStore().proposals[0].projectId
    expect(() => queries.projectProposals(vendor(), projectId)).toThrowError(
      AccessError,
    )
    expect(() => queries.projectFinalists(vendor(), projectId)).toThrowError(
      AccessError,
    )
    expect(() =>
      queries.projectSolicitations(vendor(), projectId),
    ).toThrowError(AccessError)
    expect(() =>
      queries.projectNotInterestedVendors(vendor(), projectId),
    ).toThrowError(AccessError)
    expect(() => queries.allProposals(vendor())).toThrowError(AccessError)
  })

  it('returns only the requested project proposals for procurement', () => {
    const projectId = getStore().proposals[0].projectId
    const result = queries.projectProposals(officer(), projectId)
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((p) => p.projectId === projectId)).toBe(true)
  })

  it('sorts finalists by rank', () => {
    const project = getStore().finalists[0]?.projectId
    if (!project) throw new Error('Test setup: expected seeded finalists')
    const ranks = queries
      .projectFinalists(lead(), project)
      .map((f) => f.rank)
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b))
  })
})

describe('proposal state machine (procurement)', () => {
  beforeEach(resetStore)

  it('advances a follow-up proposal to Finalized when ranked', () => {
    const proposal = firstProposal((p) => p.status === 'FollowUp')
    mutations.rankFinalist(
      officer(),
      proposal.projectId,
      proposal.vendorId,
      1,
    )
    const updated = getStore().proposals.find((p) => p.id === proposal.id)
    expect(updated?.status).toBe('Finalized')
    expect(
      getStore().finalists.some(
        (f) =>
          f.projectId === proposal.projectId &&
          f.vendorId === proposal.vendorId,
      ),
    ).toBe(true)
  })

  it('approving a finalized proposal marks it Won and sends the finalist to legal', () => {
    const proposal = firstProposal((p) => p.status === 'FollowUp')
    mutations.rankFinalist(officer(), proposal.projectId, proposal.vendorId, 1)
    mutations.approveFinal(lead(), proposal.id, true)

    const updated = getStore().proposals.find((p) => p.id === proposal.id)
    expect(updated?.status).toBe('Won')
    const finalist = getStore().finalists.find(
      (f) =>
        f.projectId === proposal.projectId && f.vendorId === proposal.vendorId,
    )
    expect(finalist?.status).toBe('SentToLegal')
  })

  it('filtering then approving round one follows the Submitted → Filtered → FollowUp path', () => {
    const proposal = firstProposal((p) => p.status === 'Submitted')
    mutations.filterProposal(officer(), proposal.id, true)
    expect(
      getStore().proposals.find((p) => p.id === proposal.id)?.status,
    ).toBe('Filtered')
    mutations.approveRound(lead(), proposal.id, true)
    expect(
      getStore().proposals.find((p) => p.id === proposal.id)?.status,
    ).toBe('FollowUp')
  })
})
