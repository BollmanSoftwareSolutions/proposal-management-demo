import { getStore } from '../store/store'
import type { Finalist, Project, Proposal } from '../store/types'

/** Attach resolved relations a Project selection set may request. */
export function projectDTO(project: Project) {
  const store = getStore()
  return {
    ...project,
    area: store.projectAreas.find((a) => a.id === project.projectAreaId) ?? null,
    assignedLead:
      store.users.find((u) => u.id === project.assignedLeadId) ?? null,
    officer: store.users.find((u) => u.id === project.officerId) ?? null,
  }
}

/** Attach resolved relations a Proposal selection set may request. */
export function proposalDTO(proposal: Proposal) {
  const store = getStore()
  const project = store.projects.find((p) => p.id === proposal.projectId)
  return {
    ...proposal,
    vendor: store.users.find((u) => u.id === proposal.vendorId) ?? null,
    project: project ? projectDTO(project) : null,
  }
}

export function finalistDTO(finalist: Finalist) {
  const store = getStore()
  return {
    ...finalist,
    vendor: store.users.find((u) => u.id === finalist.vendorId) ?? null,
  }
}
