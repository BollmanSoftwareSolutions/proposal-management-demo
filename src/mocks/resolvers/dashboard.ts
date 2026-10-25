import { getStore } from '../store/store'

function monthKey(iso: string): string {
  const d = new Date(iso)
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

/** Compute procurement dashboard metrics from the current store. */
export function computeDashboard() {
  const store = getStore()
  const now = Date.now()

  const activeProjects = store.projects.filter((p) => p.status === 'Active')
  const inLegal = store.projects.filter((p) => p.status === 'InLegal')

  const activeVendorIds = new Set(
    store.proposals.filter((p) => p.status !== 'Declined').map((p) => p.vendorId),
  )

  // % projects by active segment (the segment whose window contains "now").
  const segmentCounts = new Map<string, number>()
  for (const project of activeProjects) {
    const current = project.segments.find((s) => {
      const open = new Date(s.openDate).getTime()
      const close = new Date(s.closeDate).getTime()
      return open <= now && now <= close
    })
    const title = current?.title ?? 'Scheduled'
    segmentCounts.set(title, (segmentCounts.get(title) ?? 0) + 1)
  }

  // Vendor project counts (distinct projects a vendor has a proposal in).
  const vendorProjectCount = new Map<string, Set<string>>()
  for (const proposal of store.proposals) {
    const set = vendorProjectCount.get(proposal.vendorId) ?? new Set<string>()
    set.add(proposal.projectId)
    vendorProjectCount.set(proposal.vendorId, set)
  }

  // Vendor estimated totals from won/finalized proposals.
  const vendorEstimated = new Map<string, number>()
  for (const proposal of store.proposals) {
    if (proposal.status === 'Won' || proposal.status === 'Finalized') {
      const project = store.projects.find((p) => p.id === proposal.projectId)
      if (project) {
        vendorEstimated.set(
          proposal.vendorId,
          (vendorEstimated.get(proposal.vendorId) ?? 0) + project.estimatedValue,
        )
      }
    }
  }

  // Officer estimated totals across their projects.
  const officerEstimated = new Map<string, number>()
  for (const project of store.projects) {
    officerEstimated.set(
      project.officerId,
      (officerEstimated.get(project.officerId) ?? 0) + project.estimatedValue,
    )
  }

  const userName = (id: string) =>
    store.users.find((u) => u.id === id)?.name ?? id

  const topMetric = (map: Map<string, number>, limit: number) =>
    [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([vendorId, value]) => ({
        vendorId,
        vendorName: userName(vendorId),
        value,
      }))

  // Estimated value closing by month for the next 6 months.
  const monthValues = new Map<string, number>()
  for (const project of store.projects) {
    const key = monthKey(project.closeDate)
    monthValues.set(key, (monthValues.get(key) ?? 0) + project.estimatedValue)
  }

  return {
    activeProjects: activeProjects.length,
    activeEstimatedValue: activeProjects.reduce(
      (sum, p) => sum + p.estimatedValue,
      0,
    ),
    activeVendors: activeVendorIds.size,
    projectsInLegal: inLegal.length,
    projectsByActiveSegment: [...segmentCounts.entries()].map(
      ([segmentTitle, count]) => ({ segmentTitle, count }),
    ),
    topVendorsByProjectCount: [...vendorProjectCount.entries()]
      .map(([vendorId, set]) => ({
        vendorId,
        vendorName: userName(vendorId),
        value: set.size,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5),
    topVendorsByEstimatedTotal: topMetric(vendorEstimated, 10),
    topOfficersByEstimatedTotal: topMetric(officerEstimated, 8),
    estimatedValueClosingByMonth: [...monthValues.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, value]) => ({ month, value })),
  }
}
