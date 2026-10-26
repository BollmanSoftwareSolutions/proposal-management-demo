import { getStore } from '../store/store'
import type {
  AdditionalItem,
  ArtifactSubmission,
  ArtifactType,
  Finalist,
  Project,
  ProjectArtifact,
  Proposal,
  Solicitation,
  User,
} from '../store/types'
import {
  AccessError,
  NotFoundError,
  requireLead,
  requireOfficer,
  requireVendor,
} from './access'
import { finalistDTO, projectDTO, proposalDTO } from './relations'

function newId(prefix: string): string {
  return `${prefix}-${globalThis.crypto.randomUUID()}`
}

interface CreateProjectInput {
  name: string
  projectAreaId: string
  estimatedValue: number
  outline: string
  scope: string
  openDate: string
  closeDate: string
  assignedLeadId: string
}

interface UpdateProjectInput {
  name?: string | null
  projectAreaId?: string | null
  estimatedValue?: number | null
  outline?: string | null
  scope?: string | null
  openDate?: string | null
  closeDate?: string | null
  assignedLeadId?: string | null
}

interface ArtifactInput {
  templateId?: string | null
  title: string
  description: string
  type: ArtifactType
  surveyJsSchema?: unknown
}

interface SubmissionInput {
  proposalId: string
  projectArtifactId: string
  type: ArtifactType
  surveyJsResponses?: Record<string, unknown> | null
  documentName?: string | null
}

function findProject(id: string): Project {
  const project = getStore().projects.find((p) => p.id === id)
  if (!project) throw new NotFoundError(`Project not found: ${id}`)
  return project
}

function findProposal(id: string): Proposal {
  const proposal = getStore().proposals.find((p) => p.id === id)
  if (!proposal) throw new NotFoundError(`Proposal not found: ${id}`)
  return proposal
}

export function createProject(identity: User, input: CreateProjectInput) {
  requireOfficer(identity)
  const project: Project = {
    id: newId('project'),
    projectAreaId: input.projectAreaId,
    name: input.name,
    estimatedValue: input.estimatedValue,
    outline: input.outline,
    scope: input.scope,
    openDate: input.openDate,
    closeDate: input.closeDate,
    assignedLeadId: input.assignedLeadId,
    officerId: identity.id,
    status: 'Draft',
    isPublic: false,
    segments: [],
    artifacts: [],
  }
  getStore().projects.push(project)
  return projectDTO(project)
}

export function updateProject(
  identity: User,
  id: string,
  input: UpdateProjectInput,
) {
  requireOfficer(identity)
  const project = findProject(id)
  if (project.isPublic) {
    throw new AccessError('Project is locked for editing once public')
  }
  const fields: (keyof UpdateProjectInput)[] = [
    'name',
    'projectAreaId',
    'estimatedValue',
    'outline',
    'scope',
    'openDate',
    'closeDate',
    'assignedLeadId',
  ]
  for (const key of fields) {
    const value = input[key]
    if (value !== undefined && value !== null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(project as any)[key] = value
    }
  }
  return projectDTO(project)
}

export function activateProject(identity: User, id: string) {
  requireOfficer(identity)
  const project = findProject(id)
  project.status = 'Active'
  project.isPublic = true
  return projectDTO(project)
}

export function addProjectArtifact(
  identity: User,
  projectId: string,
  input: ArtifactInput,
) {
  requireOfficer(identity)
  const project = findProject(projectId)
  const artifact: ProjectArtifact = {
    id: newId('artifact'),
    projectId,
    templateId: input.templateId ?? undefined,
    title: input.title,
    description: input.description,
    type: input.type,
    surveyJsSchema: input.surveyJsSchema,
    isActive: true,
  }
  project.artifacts.push(artifact)
  return artifact
}

export function removeProjectArtifact(identity: User, id: string) {
  requireOfficer(identity)
  for (const project of getStore().projects) {
    const artifact = project.artifacts.find((a) => a.id === id)
    if (artifact) {
      artifact.isActive = false
      return artifact
    }
  }
  throw new NotFoundError(`Artifact not found: ${id}`)
}

export function solicitVendor(
  identity: User,
  projectId: string,
  vendorId: string,
) {
  requireOfficer(identity)
  findProject(projectId)
  const solicitation: Solicitation = {
    id: newId('solicitation'),
    projectId,
    vendorId,
    invitedAt: new Date().toISOString(),
  }
  getStore().solicitations.push(solicitation)
  return solicitation
}

export function signUp(identity: User, projectId: string) {
  requireVendor(identity)
  const project = findProject(projectId)
  if (!project.isPublic) {
    throw new AccessError('Cannot sign up for a non-public project')
  }
  const store = getStore()
  const existing = store.proposals.find(
    (p) => p.projectId === projectId && p.vendorId === identity.id,
  )
  if (existing) {
    throw new AccessError('Already signed up for this project')
  }
  // Signing up clears any prior "not interested" record.
  store.notInterested = store.notInterested.filter(
    (n) => !(n.vendorId === identity.id && n.projectId === projectId),
  )
  const proposal: Proposal = {
    id: newId('proposal'),
    projectId,
    vendorId: identity.id,
    status: 'SignedUp',
    signedUpAt: new Date().toISOString(),
    submissions: [],
    additionalItems: [],
  }
  store.proposals.push(proposal)
  return proposalDTO(proposal)
}

export function markNotInterested(identity: User, projectId: string) {
  requireVendor(identity)
  const store = getStore()
  const already = store.notInterested.some(
    (n) => n.vendorId === identity.id && n.projectId === projectId,
  )
  if (!already) {
    store.notInterested.push({ vendorId: identity.id, projectId })
  }
  return true
}

export function reconsiderProject(identity: User, projectId: string) {
  requireVendor(identity)
  const store = getStore()
  store.notInterested = store.notInterested.filter(
    (n) => !(n.vendorId === identity.id && n.projectId === projectId),
  )
  return true
}

export function submitArtifact(identity: User, input: SubmissionInput) {
  requireVendor(identity)
  const proposal = findProposal(input.proposalId)
  if (proposal.vendorId !== identity.id) {
    throw new AccessError('Cannot submit against another vendor proposal')
  }
  const submission: ArtifactSubmission = {
    id: newId('submission'),
    proposalId: input.proposalId,
    projectArtifactId: input.projectArtifactId,
    type: input.type,
    surveyJsResponses: input.surveyJsResponses ?? undefined,
    documentName: input.documentName ?? undefined,
    submittedAt: new Date().toISOString(),
  }
  // Replace any prior submission for the same artifact.
  proposal.submissions = proposal.submissions.filter(
    (s) => s.projectArtifactId !== input.projectArtifactId,
  )
  proposal.submissions.push(submission)
  return submission
}

export function submitProposal(identity: User, proposalId: string) {
  requireVendor(identity)
  const proposal = findProposal(proposalId)
  if (proposal.vendorId !== identity.id) {
    throw new AccessError('Cannot submit another vendor proposal')
  }
  proposal.status = 'Submitted'
  return proposalDTO(proposal)
}

export function addAdditionalItem(
  identity: User,
  proposalId: string,
  name: string,
  note?: string | null,
) {
  requireVendor(identity)
  const proposal = findProposal(proposalId)
  if (proposal.vendorId !== identity.id) {
    throw new AccessError('Cannot add items to another vendor proposal')
  }
  const item: AdditionalItem = {
    id: newId('item'),
    proposalId,
    name,
    note: note ?? '',
  }
  proposal.additionalItems.push(item)
  return item
}

export function filterProposal(
  identity: User,
  proposalId: string,
  pass: boolean,
) {
  requireOfficer(identity)
  const proposal = findProposal(proposalId)
  proposal.status = pass ? 'Filtered' : 'Declined'
  return proposalDTO(proposal)
}

export function approveRound(
  identity: User,
  proposalId: string,
  approve: boolean,
) {
  requireLead(identity)
  const proposal = findProposal(proposalId)
  proposal.status = approve ? 'FollowUp' : 'Declined'
  return proposalDTO(proposal)
}

export function rankFinalist(
  identity: User,
  projectId: string,
  vendorId: string,
  rank: number,
) {
  requireOfficer(identity)
  findProject(projectId)
  const store = getStore()
  let finalist = store.finalists.find(
    (f) => f.projectId === projectId && f.vendorId === vendorId,
  )
  if (finalist) {
    finalist.rank = rank
  } else {
    finalist = {
      id: newId('finalist'),
      projectId,
      vendorId,
      rank,
      status: 'Waiting',
    } as Finalist
    store.finalists.push(finalist)
  }
  // Ranking a vendor advances their proposal into the Finalized state.
  const proposal = store.proposals.find(
    (p) => p.projectId === projectId && p.vendorId === vendorId,
  )
  if (proposal && proposal.status === 'FollowUp') {
    proposal.status = 'Finalized'
  }
  return finalistDTO(finalist)
}

export function approveFinal(
  identity: User,
  proposalId: string,
  approve: boolean,
) {
  requireLead(identity)
  const proposal = findProposal(proposalId)
  proposal.status = approve ? 'Won' : 'Declined'
  // Keep the finalist record's status in sync with the decision.
  const finalist = getStore().finalists.find(
    (f) => f.projectId === proposal.projectId && f.vendorId === proposal.vendorId,
  )
  if (finalist) {
    finalist.status = approve ? 'SentToLegal' : 'Declined'
  }
  return proposalDTO(proposal)
}
