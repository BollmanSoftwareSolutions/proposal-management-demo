import { describe, expect, it } from 'vitest'
import { fetchGraphQL } from '../../graphql/fetcher'
import { setCurrentUserId } from '../../graphql/identity'
import {
  DashboardDocument,
  type DashboardQuery,
  MyProposalsDocument,
  type MyProposalsQuery,
  ProjectsDocument,
  type ProjectsQuery,
  SignUpDocument,
  type SignUpMutation,
} from '../../graphql/generated/graphql'
import { getStore } from '../store/store'

async function run<TData>(
  document: { toString(): string },
  variables?: Record<string, unknown>,
): Promise<TData> {
  return fetchGraphQL<TData, Record<string, unknown>>(document, variables)()
}

describe('MSW GraphQL round-trip', () => {
  it('resolves the dashboard for a procurement identity', async () => {
    setCurrentUserId('user-lead')
    const data = await run<DashboardQuery>(DashboardDocument)
    expect(data.dashboard.activeProjects).toBeGreaterThan(0)
    expect(data.dashboard.activeEstimatedValue).toBeGreaterThan(0)
    expect(data.dashboard.estimatedValueClosingByMonth.length).toBeGreaterThan(0)
  })

  it('returns all projects for an officer', async () => {
    setCurrentUserId('user-officer')
    const data = await run<ProjectsQuery>(ProjectsDocument, {})
    expect(data.projects.length).toBe(getStore().projects.length)
  })

  it('scopes myProposals to the acting vendor', async () => {
    setCurrentUserId('user-vendor')
    const data = await run<MyProposalsQuery>(MyProposalsDocument)
    expect(data.myProposals.every((p) => p.vendorId === 'user-vendor')).toBe(
      true,
    )
  })

  it('surfaces resolver access errors as GraphQL errors', async () => {
    setCurrentUserId('user-vendor')
    await expect(run<ProjectsQuery>(ProjectsDocument, {})).rejects.toThrow(
      /procurement/i,
    )
  })

  it('signs a vendor up for an available project (mutation round-trip)', async () => {
    setCurrentUserId('user-vendor')
    const available = getStore().projects.find(
      (p) =>
        p.isPublic &&
        p.status === 'Active' &&
        !getStore().proposals.some(
          (pr) => pr.vendorId === 'user-vendor' && pr.projectId === p.id,
        ) &&
        !getStore().notInterested.some(
          (n) => n.vendorId === 'user-vendor' && n.projectId === p.id,
        ),
    )
    expect(available).toBeDefined()

    const data = await run<SignUpMutation>(SignUpDocument, {
      projectId: available!.id,
    })
    expect(data.signUp.status).toBe('SignedUp')
    expect(data.signUp.vendorId).toBe('user-vendor')

    // Store reflects the new proposal.
    expect(
      getStore().proposals.some(
        (p) => p.vendorId === 'user-vendor' && p.projectId === available!.id,
      ),
    ).toBe(true)
  })
})
