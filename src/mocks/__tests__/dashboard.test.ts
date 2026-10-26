import { beforeEach, describe, expect, it } from 'vitest'
import { getStore, resetStore } from '../store/store'
import { computeDashboard } from '../resolvers/dashboard'

describe('dashboard derived metrics', () => {
  beforeEach(resetStore)

  it('derives KPI counts from the store', () => {
    const store = getStore()
    const metrics = computeDashboard()

    expect(metrics.activeProjects).toBe(
      store.projects.filter((p) => p.status === 'Active').length,
    )
    expect(metrics.projectsInLegal).toBe(
      store.projects.filter((p) => p.status === 'InLegal').length,
    )
    expect(metrics.activeEstimatedValue).toBe(
      store.projects
        .filter((p) => p.status === 'Active')
        .reduce((sum, p) => sum + p.estimatedValue, 0),
    )
    // Active vendors = distinct vendors with a non-declined proposal.
    expect(metrics.activeVendors).toBe(
      new Set(
        store.proposals
          .filter((p) => p.status !== 'Declined')
          .map((p) => p.vendorId),
      ).size,
    )
  })

  it('caps top-metric lists at their configured limits', () => {
    const metrics = computeDashboard()
    expect(metrics.topVendorsByProjectCount.length).toBeLessThanOrEqual(5)
    expect(metrics.topVendorsByEstimatedTotal.length).toBeLessThanOrEqual(10)
    expect(metrics.topOfficersByEstimatedTotal.length).toBeLessThanOrEqual(8)
  })

  it('emits only upcoming segment events within the next 60 days, sorted', () => {
    const metrics = computeDashboard()
    const now = Date.now()
    const horizon = now + 60 * 86_400_000

    expect(metrics.upcomingSegmentEvents.length).toBeGreaterThan(0)
    for (const event of metrics.upcomingSegmentEvents) {
      const time = new Date(event.date).getTime()
      expect(time).toBeGreaterThanOrEqual(now)
      expect(time).toBeLessThanOrEqual(horizon)
      expect(['Open', 'Close']).toContain(event.kind)
    }

    const dates = metrics.upcomingSegmentEvents.map((e) => e.date)
    const sorted = [...dates].sort((a, b) => a.localeCompare(b))
    expect(dates).toEqual(sorted)
  })
})
