export type ID = string

export type Role = 'Lead' | 'Officer' | 'Vendor'
export type ProjectStatus = 'Draft' | 'Active' | 'InLegal' | 'Closed'
export type ArtifactType = 'Form' | 'Document'
export type ProposalStatus =
  | 'SignedUp'
  | 'Submitted'
  | 'Filtered'
  | 'Declined'
  | 'FollowUp'
  | 'Finalized'
  | 'Won'
export type FinalistStatus = 'Waiting' | 'SentToLegal' | 'Declined'

export interface User {
  id: ID
  name: string
  email: string
  phone: string
  roles: Role[]
  companyName?: string
  jurisdiction?: string
  lastActive: string
}

export interface ProjectArea {
  id: ID
  name: string
}

export interface ProjectSegment {
  id: ID
  projectId: ID
  title: string
  order: number
  openDate: string
  closeDate: string
}

export interface ArtifactTemplate {
  id: ID
  title: string
  description: string
  type: ArtifactType
  surveyJsSchema?: unknown
  shared: boolean
}

export interface ProjectArtifact {
  id: ID
  projectId: ID
  templateId?: ID
  title: string
  description: string
  type: ArtifactType
  surveyJsSchema?: unknown
  isActive: boolean
}

export interface Project {
  id: ID
  projectAreaId: ID
  name: string
  estimatedValue: number
  outline: string
  scope: string
  openDate: string
  closeDate: string
  assignedLeadId: ID
  officerId: ID
  status: ProjectStatus
  isPublic: boolean
  segments: ProjectSegment[]
  artifacts: ProjectArtifact[]
}

export interface Solicitation {
  id: ID
  projectId: ID
  vendorId: ID
  invitedAt: string
}

export interface AdditionalItem {
  id: ID
  proposalId: ID
  name: string
  note: string
}

export interface ArtifactSubmission {
  id: ID
  proposalId: ID
  projectArtifactId: ID
  type: ArtifactType
  surveyJsResponses?: Record<string, unknown>
  documentName?: string
  submittedAt: string
}

/**
 * A vendor's pre-completed response to a shared artifact template. Copied into a
 * proposal's submissions when the vendor signs up for a project that includes an
 * artifact derived from the same template.
 */
export interface SharedArtifactResponse {
  id: ID
  vendorId: ID
  templateId: ID
  surveyJsResponses: Record<string, unknown>
  updatedAt: string
}

export interface Proposal {
  id: ID
  projectId: ID
  vendorId: ID
  status: ProposalStatus
  signedUpAt: string
  submissions: ArtifactSubmission[]
  additionalItems: AdditionalItem[]
}

export interface Finalist {
  id: ID
  projectId: ID
  vendorId: ID
  rank: number
  status: FinalistStatus
}

/** Records a vendor explicitly declining to pursue a project. */
export interface NotInterested {
  vendorId: ID
  projectId: ID
}

export interface DemoStore {
  users: User[]
  projectAreas: ProjectArea[]
  projects: Project[]
  artifactTemplates: ArtifactTemplate[]
  solicitations: Solicitation[]
  proposals: Proposal[]
  finalists: Finalist[]
  notInterested: NotInterested[]
  sharedArtifactResponses: SharedArtifactResponse[]
}
