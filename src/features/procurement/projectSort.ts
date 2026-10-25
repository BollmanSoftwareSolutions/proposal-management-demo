import type { ProjectFieldsFragment } from '../../graphql/generated/graphql'

/** Earliest upcoming (or latest) segment close date for ordering/labelling. */
export function nextSegmentEnd(project: ProjectFieldsFragment): number {
  if (project.segments.length === 0) return Number.POSITIVE_INFINITY
  const now = Date.now()
  const upcoming = project.segments
    .map((s) => new Date(s.closeDate).getTime())
    .filter((t) => t >= now)
    .sort((a, b) => a - b)
  if (upcoming.length > 0) return upcoming[0]
  return Math.max(...project.segments.map((s) => new Date(s.closeDate).getTime()))
}

/** Solicitation segment open date (falls back to the project open date). */
export function solicitationOpen(project: ProjectFieldsFragment): number {
  const solicitation = project.segments.find((s) =>
    s.title.toLowerCase().includes('solicitation'),
  )
  const iso = solicitation?.openDate ?? project.openDate
  return new Date(iso).getTime()
}
