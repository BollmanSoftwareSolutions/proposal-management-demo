import { getStore } from '../store/store'
import type { ProjectStatus, User } from '../store/types'
import {
  AccessError,
  requireProcurement,
  requireVendor,
} from './access'
import { computeDashboard } from './dashboard'
import { finalistDTO, projectDTO, proposalDTO } from './relations'

interface ProjectFilter {
  status?: ProjectStatus | null
  projectAreaId?: string | null
}

export function dashboard(identity: User) {
  requireProcurement(identity)
  return computeDashboard()
}

/** The acting identity (used by the vendor dashboard for scoped demographics). */
export function me(identity: User) {
  return identity
}

export function projects(identity: User, filter?: ProjectFilter | null) {
  requireProcurement(identity)
  let list = getStore().projects
  if (filter?.status) {
    list = list.filter((p) => p.status === filter.status)
  }
  if (filter?.projectAreaId) {
    list = list.filter((p) => p.projectAreaId === filter.projectAreaId)
  }
  return list.map(projectDTO)
}

export function project(identity: User, id: string) {
  const found = getStore().projects.find((p) => p.id === id)
  if (!found) return null
  const isProcurement =
    identity.roles.includes('Lead') || identity.roles.includes('Officer')
  if (!isProcurement) {
    requireVendor(identity)
    if (!found.isPublic) {
      throw new AccessError('Project is not publicly available')
    }
  }
  return projectDTO(found)
}

export function projectAreas(identity: User) {
  requireProcurement(identity)
  return getStore().projectAreas
}

export function vendors(identity: User) {
  requireProcurement(identity)
  return getStore().users.filter((u) => u.roles.includes('Vendor'))
}

export function vendor(identity: User, id: string) {
  requireProcurement(identity)
  return (
    getStore().users.find(
      (u) => u.id === id && u.roles.includes('Vendor'),
    ) ?? null
  )
}

export function artifactTemplates(identity: User) {
  requireProcurement(identity)
  return getStore().artifactTemplates
}

export function allProposals(identity: User) {
  requireProcurement(identity)
  return getStore().proposals.map(proposalDTO)
}

export function projectProposals(identity: User, projectId: string) {
  requireProcurement(identity)
  return getStore()
    .proposals.filter((p) => p.projectId === projectId)
    .map(proposalDTO)
}

export function projectSolicitations(identity: User, projectId: string) {
  requireProcurement(identity)
  return getStore().solicitations.filter((s) => s.projectId === projectId)
}

export function projectFinalists(identity: User, projectId: string) {
  requireProcurement(identity)
  return getStore()
    .finalists.filter((f) => f.projectId === projectId)
    .sort((a, b) => a.rank - b.rank)
    .map(finalistDTO)
}

export function projectNotInterestedVendors(
  identity: User,
  projectId: string,
) {
  requireProcurement(identity)
  const store = getStore()
  const vendorIds = new Set(
    store.notInterested
      .filter((n) => n.projectId === projectId)
      .map((n) => n.vendorId),
  )
  return store.users.filter((u) => vendorIds.has(u.id))
}

export function myProposals(identity: User) {
  requireVendor(identity)
  return getStore()
    .proposals.filter((p) => p.vendorId === identity.id)
    .map(proposalDTO)
}

export function availableProjects(identity: User) {
  requireVendor(identity)
  const store = getStore()
  const signedUp = new Set(
    store.proposals
      .filter((p) => p.vendorId === identity.id)
      .map((p) => p.projectId),
  )
  const declined = new Set(
    store.notInterested
      .filter((n) => n.vendorId === identity.id)
      .map((n) => n.projectId),
  )
  return store.projects
    .filter(
      (p) =>
        p.isPublic &&
        p.status === 'Active' &&
        !signedUp.has(p.id) &&
        !declined.has(p.id),
    )
    .map(projectDTO)
}

export function notInterestedProjects(identity: User) {
  requireVendor(identity)
  const store = getStore()
  const ids = new Set(
    store.notInterested
      .filter((n) => n.vendorId === identity.id)
      .map((n) => n.projectId),
  )
  return store.projects.filter((p) => ids.has(p.id)).map(projectDTO)
}

export function mySolicitations(identity: User) {
  requireVendor(identity)
  return getStore().solicitations.filter((s) => s.vendorId === identity.id)
}

export function sharedArtifacts(identity: User) {
  requireVendor(identity)
  return getStore().artifactTemplates.filter((t) => t.shared)
}
