/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query';
import { fetchGraphQL } from '../fetcher';
export type ArtifactInput = {
  description: string;
  surveyJsSchema?: unknown;
  templateId?: string | null | undefined;
  title: string;
  type: ArtifactType;
};

export type ArtifactType =
  | 'Document'
  | 'Form';

export type CreateProjectInput = {
  assignedLeadId: string;
  closeDate: string;
  estimatedValue: number;
  name: string;
  openDate: string;
  outline: string;
  projectAreaId: string;
  scope: string;
};

export type DemographicsInput = {
  companyName?: string | null | undefined;
  email?: string | null | undefined;
  jurisdiction?: string | null | undefined;
  phone?: string | null | undefined;
};

export type FinalistStatus =
  | 'Declined'
  | 'SentToLegal'
  | 'Waiting';

export type ProjectFilter = {
  projectAreaId?: string | null | undefined;
  status?: ProjectStatus | null | undefined;
};

export type ProjectStatus =
  | 'Active'
  | 'Closed'
  | 'Draft'
  | 'InLegal';

export type ProposalStatus =
  | 'Declined'
  | 'Filtered'
  | 'Finalized'
  | 'FollowUp'
  | 'SignedUp'
  | 'Submitted'
  | 'Won';

export type Role =
  | 'Lead'
  | 'Officer'
  | 'Vendor';

export type SegmentEventKind =
  | 'Close'
  | 'Open';

export type SubmissionInput = {
  documentName?: string | null | undefined;
  projectArtifactId: string;
  proposalId: string;
  surveyJsResponses?: unknown;
  type: ArtifactType;
};

export type UpdateProjectInput = {
  assignedLeadId?: string | null | undefined;
  closeDate?: string | null | undefined;
  estimatedValue?: number | null | undefined;
  name?: string | null | undefined;
  openDate?: string | null | undefined;
  outline?: string | null | undefined;
  projectAreaId?: string | null | undefined;
  scope?: string | null | undefined;
};

export type UserFieldsFragment = { id: string, name: string, email: string, phone: string, roles: Array<Role>, companyName: string | null, jurisdiction: string | null, lastActive: string };

export type ProjectArtifactFieldsFragment = { id: string, projectId: string, templateId: string | null, title: string, description: string, type: ArtifactType, surveyJsSchema: unknown, isActive: boolean };

export type ProjectSegmentFieldsFragment = { id: string, projectId: string, title: string, order: number, openDate: string, closeDate: string };

export type ProjectFieldsFragment = { id: string, projectAreaId: string, name: string, estimatedValue: number, outline: string, scope: string, openDate: string, closeDate: string, assignedLeadId: string, officerId: string, status: ProjectStatus, isPublic: boolean, area: { id: string, name: string } | null, assignedLead: { id: string, name: string } | null, officer: { id: string, name: string } | null, segments: Array<{ id: string, projectId: string, title: string, order: number, openDate: string, closeDate: string }>, artifacts: Array<{ id: string, projectId: string, templateId: string | null, title: string, description: string, type: ArtifactType, surveyJsSchema: unknown, isActive: boolean }> };

export type SubmissionFieldsFragment = { id: string, proposalId: string, projectArtifactId: string, type: ArtifactType, surveyJsResponses: unknown, documentName: string | null, submittedAt: string };

export type ProposalFieldsFragment = { id: string, projectId: string, vendorId: string, status: ProposalStatus, signedUpAt: string, vendor: { id: string, name: string, companyName: string | null } | null, project: { id: string, name: string, status: ProjectStatus, estimatedValue: number, closeDate: string } | null, submissions: Array<{ id: string, proposalId: string, projectArtifactId: string, type: ArtifactType, surveyJsResponses: unknown, documentName: string | null, submittedAt: string }>, additionalItems: Array<{ id: string, proposalId: string, name: string, note: string }> };

export type FinalistFieldsFragment = { id: string, projectId: string, vendorId: string, rank: number, status: FinalistStatus, vendor: { id: string, name: string, companyName: string | null } | null };

export type SolicitationFieldsFragment = { id: string, projectId: string, vendorId: string, invitedAt: string };

export type CreateProjectMutationVariables = Exact<{
  input: CreateProjectInput;
}>;


export type CreateProjectMutation = { createProject: { id: string, projectAreaId: string, name: string, estimatedValue: number, outline: string, scope: string, openDate: string, closeDate: string, assignedLeadId: string, officerId: string, status: ProjectStatus, isPublic: boolean, area: { id: string, name: string } | null, assignedLead: { id: string, name: string } | null, officer: { id: string, name: string } | null, segments: Array<{ id: string, projectId: string, title: string, order: number, openDate: string, closeDate: string }>, artifacts: Array<{ id: string, projectId: string, templateId: string | null, title: string, description: string, type: ArtifactType, surveyJsSchema: unknown, isActive: boolean }> } };

export type UpdateProjectMutationVariables = Exact<{
  id: string;
  input: UpdateProjectInput;
}>;


export type UpdateProjectMutation = { updateProject: { id: string, projectAreaId: string, name: string, estimatedValue: number, outline: string, scope: string, openDate: string, closeDate: string, assignedLeadId: string, officerId: string, status: ProjectStatus, isPublic: boolean, area: { id: string, name: string } | null, assignedLead: { id: string, name: string } | null, officer: { id: string, name: string } | null, segments: Array<{ id: string, projectId: string, title: string, order: number, openDate: string, closeDate: string }>, artifacts: Array<{ id: string, projectId: string, templateId: string | null, title: string, description: string, type: ArtifactType, surveyJsSchema: unknown, isActive: boolean }> } };

export type ActivateProjectMutationVariables = Exact<{
  id: string;
}>;


export type ActivateProjectMutation = { activateProject: { id: string, projectAreaId: string, name: string, estimatedValue: number, outline: string, scope: string, openDate: string, closeDate: string, assignedLeadId: string, officerId: string, status: ProjectStatus, isPublic: boolean, area: { id: string, name: string } | null, assignedLead: { id: string, name: string } | null, officer: { id: string, name: string } | null, segments: Array<{ id: string, projectId: string, title: string, order: number, openDate: string, closeDate: string }>, artifacts: Array<{ id: string, projectId: string, templateId: string | null, title: string, description: string, type: ArtifactType, surveyJsSchema: unknown, isActive: boolean }> } };

export type AddProjectArtifactMutationVariables = Exact<{
  projectId: string;
  input: ArtifactInput;
}>;


export type AddProjectArtifactMutation = { addProjectArtifact: { id: string, projectId: string, templateId: string | null, title: string, description: string, type: ArtifactType, surveyJsSchema: unknown, isActive: boolean } };

export type RemoveProjectArtifactMutationVariables = Exact<{
  id: string;
}>;


export type RemoveProjectArtifactMutation = { removeProjectArtifact: { id: string, projectId: string, templateId: string | null, title: string, description: string, type: ArtifactType, surveyJsSchema: unknown, isActive: boolean } };

export type SolicitVendorMutationVariables = Exact<{
  projectId: string;
  vendorId: string;
}>;


export type SolicitVendorMutation = { solicitVendor: { id: string, projectId: string, vendorId: string, invitedAt: string } };

export type SignUpMutationVariables = Exact<{
  projectId: string;
}>;


export type SignUpMutation = { signUp: { id: string, projectId: string, vendorId: string, status: ProposalStatus, signedUpAt: string, vendor: { id: string, name: string, companyName: string | null } | null, project: { id: string, name: string, status: ProjectStatus, estimatedValue: number, closeDate: string } | null, submissions: Array<{ id: string, proposalId: string, projectArtifactId: string, type: ArtifactType, surveyJsResponses: unknown, documentName: string | null, submittedAt: string }>, additionalItems: Array<{ id: string, proposalId: string, name: string, note: string }> } };

export type MarkNotInterestedMutationVariables = Exact<{
  projectId: string;
}>;


export type MarkNotInterestedMutation = { markNotInterested: boolean };

export type ReconsiderProjectMutationVariables = Exact<{
  projectId: string;
}>;


export type ReconsiderProjectMutation = { reconsiderProject: boolean };

export type SubmitArtifactMutationVariables = Exact<{
  input: SubmissionInput;
}>;


export type SubmitArtifactMutation = { submitArtifact: { id: string, proposalId: string, projectArtifactId: string, type: ArtifactType, surveyJsResponses: unknown, documentName: string | null, submittedAt: string } };

export type SubmitProposalMutationVariables = Exact<{
  proposalId: string;
}>;


export type SubmitProposalMutation = { submitProposal: { id: string, projectId: string, vendorId: string, status: ProposalStatus, signedUpAt: string, vendor: { id: string, name: string, companyName: string | null } | null, project: { id: string, name: string, status: ProjectStatus, estimatedValue: number, closeDate: string } | null, submissions: Array<{ id: string, proposalId: string, projectArtifactId: string, type: ArtifactType, surveyJsResponses: unknown, documentName: string | null, submittedAt: string }>, additionalItems: Array<{ id: string, proposalId: string, name: string, note: string }> } };

export type AddAdditionalItemMutationVariables = Exact<{
  proposalId: string;
  name: string;
  note?: string | null | undefined;
}>;


export type AddAdditionalItemMutation = { addAdditionalItem: { id: string, proposalId: string, name: string, note: string } };

export type UpdateDemographicsMutationVariables = Exact<{
  input: DemographicsInput;
}>;


export type UpdateDemographicsMutation = { updateDemographics: { id: string, name: string, email: string, phone: string, roles: Array<Role>, companyName: string | null, jurisdiction: string | null, lastActive: string } };

export type FilterProposalMutationVariables = Exact<{
  proposalId: string;
  pass: boolean;
}>;


export type FilterProposalMutation = { filterProposal: { id: string, projectId: string, vendorId: string, status: ProposalStatus, signedUpAt: string, vendor: { id: string, name: string, companyName: string | null } | null, project: { id: string, name: string, status: ProjectStatus, estimatedValue: number, closeDate: string } | null, submissions: Array<{ id: string, proposalId: string, projectArtifactId: string, type: ArtifactType, surveyJsResponses: unknown, documentName: string | null, submittedAt: string }>, additionalItems: Array<{ id: string, proposalId: string, name: string, note: string }> } };

export type ApproveRoundMutationVariables = Exact<{
  proposalId: string;
  approve: boolean;
}>;


export type ApproveRoundMutation = { approveRound: { id: string, projectId: string, vendorId: string, status: ProposalStatus, signedUpAt: string, vendor: { id: string, name: string, companyName: string | null } | null, project: { id: string, name: string, status: ProjectStatus, estimatedValue: number, closeDate: string } | null, submissions: Array<{ id: string, proposalId: string, projectArtifactId: string, type: ArtifactType, surveyJsResponses: unknown, documentName: string | null, submittedAt: string }>, additionalItems: Array<{ id: string, proposalId: string, name: string, note: string }> } };

export type RankFinalistMutationVariables = Exact<{
  projectId: string;
  vendorId: string;
  rank: number;
}>;


export type RankFinalistMutation = { rankFinalist: { id: string, projectId: string, vendorId: string, rank: number, status: FinalistStatus } };

export type ApproveFinalMutationVariables = Exact<{
  proposalId: string;
  approve: boolean;
}>;


export type ApproveFinalMutation = { approveFinal: { id: string, projectId: string, vendorId: string, status: ProposalStatus, signedUpAt: string, vendor: { id: string, name: string, companyName: string | null } | null, project: { id: string, name: string, status: ProjectStatus, estimatedValue: number, closeDate: string } | null, submissions: Array<{ id: string, proposalId: string, projectArtifactId: string, type: ArtifactType, surveyJsResponses: unknown, documentName: string | null, submittedAt: string }>, additionalItems: Array<{ id: string, proposalId: string, name: string, note: string }> } };

export type DashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type DashboardQuery = { dashboard: { activeProjects: number, activeEstimatedValue: number, activeVendors: number, projectsInLegal: number, projectsByActiveSegment: Array<{ segmentTitle: string, count: number }>, topVendorsByProjectCount: Array<{ vendorId: string, vendorName: string, value: number }>, topVendorsByEstimatedTotal: Array<{ vendorId: string, vendorName: string, value: number }>, topOfficersByEstimatedTotal: Array<{ vendorId: string, vendorName: string, value: number }>, estimatedValueClosingByMonth: Array<{ month: string, value: number }>, upcomingSegmentEvents: Array<{ projectId: string, projectName: string, segmentTitle: string, date: string, kind: SegmentEventKind }> } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { id: string, name: string, email: string, phone: string, roles: Array<Role>, companyName: string | null, jurisdiction: string | null, lastActive: string } };

export type ProjectsQueryVariables = Exact<{
  filter?: ProjectFilter | null | undefined;
}>;


export type ProjectsQuery = { projects: Array<{ id: string, projectAreaId: string, name: string, estimatedValue: number, outline: string, scope: string, openDate: string, closeDate: string, assignedLeadId: string, officerId: string, status: ProjectStatus, isPublic: boolean, area: { id: string, name: string } | null, assignedLead: { id: string, name: string } | null, officer: { id: string, name: string } | null, segments: Array<{ id: string, projectId: string, title: string, order: number, openDate: string, closeDate: string }>, artifacts: Array<{ id: string, projectId: string, templateId: string | null, title: string, description: string, type: ArtifactType, surveyJsSchema: unknown, isActive: boolean }> }> };

export type ProjectQueryVariables = Exact<{
  id: string;
}>;


export type ProjectQuery = { project: { id: string, projectAreaId: string, name: string, estimatedValue: number, outline: string, scope: string, openDate: string, closeDate: string, assignedLeadId: string, officerId: string, status: ProjectStatus, isPublic: boolean, area: { id: string, name: string } | null, assignedLead: { id: string, name: string } | null, officer: { id: string, name: string } | null, segments: Array<{ id: string, projectId: string, title: string, order: number, openDate: string, closeDate: string }>, artifacts: Array<{ id: string, projectId: string, templateId: string | null, title: string, description: string, type: ArtifactType, surveyJsSchema: unknown, isActive: boolean }> } | null };

export type ProjectAreasQueryVariables = Exact<{ [key: string]: never; }>;


export type ProjectAreasQuery = { projectAreas: Array<{ id: string, name: string }> };

export type VendorsQueryVariables = Exact<{ [key: string]: never; }>;


export type VendorsQuery = { vendors: Array<{ id: string, name: string, email: string, phone: string, roles: Array<Role>, companyName: string | null, jurisdiction: string | null, lastActive: string }> };

export type VendorQueryVariables = Exact<{
  id: string;
}>;


export type VendorQuery = { vendor: { id: string, name: string, email: string, phone: string, roles: Array<Role>, companyName: string | null, jurisdiction: string | null, lastActive: string } | null };

export type ArtifactTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type ArtifactTemplatesQuery = { artifactTemplates: Array<{ id: string, title: string, description: string, type: ArtifactType, surveyJsSchema: unknown, shared: boolean }> };

export type AllProposalsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllProposalsQuery = { allProposals: Array<{ id: string, projectId: string, vendorId: string, status: ProposalStatus, signedUpAt: string, vendor: { id: string, name: string, companyName: string | null } | null, project: { id: string, name: string, status: ProjectStatus, estimatedValue: number, closeDate: string } | null, submissions: Array<{ id: string, proposalId: string, projectArtifactId: string, type: ArtifactType, surveyJsResponses: unknown, documentName: string | null, submittedAt: string }>, additionalItems: Array<{ id: string, proposalId: string, name: string, note: string }> }> };

export type ProjectProposalsQueryVariables = Exact<{
  projectId: string;
}>;


export type ProjectProposalsQuery = { projectProposals: Array<{ id: string, projectId: string, vendorId: string, status: ProposalStatus, signedUpAt: string, vendor: { id: string, name: string, companyName: string | null } | null, project: { id: string, name: string, status: ProjectStatus, estimatedValue: number, closeDate: string } | null, submissions: Array<{ id: string, proposalId: string, projectArtifactId: string, type: ArtifactType, surveyJsResponses: unknown, documentName: string | null, submittedAt: string }>, additionalItems: Array<{ id: string, proposalId: string, name: string, note: string }> }> };

export type ProjectSolicitationsQueryVariables = Exact<{
  projectId: string;
}>;


export type ProjectSolicitationsQuery = { projectSolicitations: Array<{ id: string, projectId: string, vendorId: string, invitedAt: string }> };

export type ProjectFinalistsQueryVariables = Exact<{
  projectId: string;
}>;


export type ProjectFinalistsQuery = { projectFinalists: Array<{ id: string, projectId: string, vendorId: string, rank: number, status: FinalistStatus, vendor: { id: string, name: string, companyName: string | null } | null }> };

export type ProjectNotInterestedVendorsQueryVariables = Exact<{
  projectId: string;
}>;


export type ProjectNotInterestedVendorsQuery = { projectNotInterestedVendors: Array<{ id: string, name: string, email: string, phone: string, roles: Array<Role>, companyName: string | null, jurisdiction: string | null, lastActive: string }> };

export type MyProposalsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyProposalsQuery = { myProposals: Array<{ id: string, projectId: string, vendorId: string, status: ProposalStatus, signedUpAt: string, vendor: { id: string, name: string, companyName: string | null } | null, project: { id: string, name: string, status: ProjectStatus, estimatedValue: number, closeDate: string } | null, submissions: Array<{ id: string, proposalId: string, projectArtifactId: string, type: ArtifactType, surveyJsResponses: unknown, documentName: string | null, submittedAt: string }>, additionalItems: Array<{ id: string, proposalId: string, name: string, note: string }> }> };

export type AvailableProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type AvailableProjectsQuery = { availableProjects: Array<{ id: string, projectAreaId: string, name: string, estimatedValue: number, outline: string, scope: string, openDate: string, closeDate: string, assignedLeadId: string, officerId: string, status: ProjectStatus, isPublic: boolean, area: { id: string, name: string } | null, assignedLead: { id: string, name: string } | null, officer: { id: string, name: string } | null, segments: Array<{ id: string, projectId: string, title: string, order: number, openDate: string, closeDate: string }>, artifacts: Array<{ id: string, projectId: string, templateId: string | null, title: string, description: string, type: ArtifactType, surveyJsSchema: unknown, isActive: boolean }> }> };

export type NotInterestedProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type NotInterestedProjectsQuery = { notInterestedProjects: Array<{ id: string, projectAreaId: string, name: string, estimatedValue: number, outline: string, scope: string, openDate: string, closeDate: string, assignedLeadId: string, officerId: string, status: ProjectStatus, isPublic: boolean, area: { id: string, name: string } | null, assignedLead: { id: string, name: string } | null, officer: { id: string, name: string } | null, segments: Array<{ id: string, projectId: string, title: string, order: number, openDate: string, closeDate: string }>, artifacts: Array<{ id: string, projectId: string, templateId: string | null, title: string, description: string, type: ArtifactType, surveyJsSchema: unknown, isActive: boolean }> }> };

export type MySolicitationsQueryVariables = Exact<{ [key: string]: never; }>;


export type MySolicitationsQuery = { mySolicitations: Array<{ id: string, projectId: string, vendorId: string, invitedAt: string }> };

export type SharedArtifactsQueryVariables = Exact<{ [key: string]: never; }>;


export type SharedArtifactsQuery = { sharedArtifacts: Array<{ id: string, title: string, description: string, type: ArtifactType, surveyJsSchema: unknown, shared: boolean }> };


export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
export const UserFieldsFragmentDoc = new TypedDocumentString(`
    fragment UserFields on User {
  id
  name
  email
  phone
  roles
  companyName
  jurisdiction
  lastActive
}
    `, {"fragmentName":"UserFields"});
export const ProjectSegmentFieldsFragmentDoc = new TypedDocumentString(`
    fragment ProjectSegmentFields on ProjectSegment {
  id
  projectId
  title
  order
  openDate
  closeDate
}
    `, {"fragmentName":"ProjectSegmentFields"});
export const ProjectArtifactFieldsFragmentDoc = new TypedDocumentString(`
    fragment ProjectArtifactFields on ProjectArtifact {
  id
  projectId
  templateId
  title
  description
  type
  surveyJsSchema
  isActive
}
    `, {"fragmentName":"ProjectArtifactFields"});
export const ProjectFieldsFragmentDoc = new TypedDocumentString(`
    fragment ProjectFields on Project {
  id
  projectAreaId
  name
  estimatedValue
  outline
  scope
  openDate
  closeDate
  assignedLeadId
  officerId
  status
  isPublic
  area {
    id
    name
  }
  assignedLead {
    id
    name
  }
  officer {
    id
    name
  }
  segments {
    ...ProjectSegmentFields
  }
  artifacts {
    ...ProjectArtifactFields
  }
}
    fragment ProjectArtifactFields on ProjectArtifact {
  id
  projectId
  templateId
  title
  description
  type
  surveyJsSchema
  isActive
}
fragment ProjectSegmentFields on ProjectSegment {
  id
  projectId
  title
  order
  openDate
  closeDate
}`, {"fragmentName":"ProjectFields"});
export const SubmissionFieldsFragmentDoc = new TypedDocumentString(`
    fragment SubmissionFields on ArtifactSubmission {
  id
  proposalId
  projectArtifactId
  type
  surveyJsResponses
  documentName
  submittedAt
}
    `, {"fragmentName":"SubmissionFields"});
export const ProposalFieldsFragmentDoc = new TypedDocumentString(`
    fragment ProposalFields on Proposal {
  id
  projectId
  vendorId
  status
  signedUpAt
  vendor {
    id
    name
    companyName
  }
  project {
    id
    name
    status
    estimatedValue
    closeDate
  }
  submissions {
    ...SubmissionFields
  }
  additionalItems {
    id
    proposalId
    name
    note
  }
}
    fragment SubmissionFields on ArtifactSubmission {
  id
  proposalId
  projectArtifactId
  type
  surveyJsResponses
  documentName
  submittedAt
}`, {"fragmentName":"ProposalFields"});
export const FinalistFieldsFragmentDoc = new TypedDocumentString(`
    fragment FinalistFields on Finalist {
  id
  projectId
  vendorId
  rank
  status
  vendor {
    id
    name
    companyName
  }
}
    `, {"fragmentName":"FinalistFields"});
export const SolicitationFieldsFragmentDoc = new TypedDocumentString(`
    fragment SolicitationFields on Solicitation {
  id
  projectId
  vendorId
  invitedAt
}
    `, {"fragmentName":"SolicitationFields"});
export const CreateProjectDocument = new TypedDocumentString(`
    mutation CreateProject($input: CreateProjectInput!) {
  createProject(input: $input) {
    ...ProjectFields
  }
}
    fragment ProjectArtifactFields on ProjectArtifact {
  id
  projectId
  templateId
  title
  description
  type
  surveyJsSchema
  isActive
}
fragment ProjectSegmentFields on ProjectSegment {
  id
  projectId
  title
  order
  openDate
  closeDate
}
fragment ProjectFields on Project {
  id
  projectAreaId
  name
  estimatedValue
  outline
  scope
  openDate
  closeDate
  assignedLeadId
  officerId
  status
  isPublic
  area {
    id
    name
  }
  assignedLead {
    id
    name
  }
  officer {
    id
    name
  }
  segments {
    ...ProjectSegmentFields
  }
  artifacts {
    ...ProjectArtifactFields
  }
}`);

export const useCreateProjectMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateProjectMutation, TError, CreateProjectMutationVariables, TContext>) => {
    
    return useMutation<CreateProjectMutation, TError, CreateProjectMutationVariables, TContext>(
      {
    mutationKey: ['CreateProject'],
    mutationFn: (variables?: CreateProjectMutationVariables) => fetchGraphQL<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, variables)(),
    ...options
  }
    )};


useCreateProjectMutation.fetcher = (variables: CreateProjectMutationVariables, options?: RequestInit['headers']) => fetchGraphQL<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, variables, options);

export const UpdateProjectDocument = new TypedDocumentString(`
    mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
  updateProject(id: $id, input: $input) {
    ...ProjectFields
  }
}
    fragment ProjectArtifactFields on ProjectArtifact {
  id
  projectId
  templateId
  title
  description
  type
  surveyJsSchema
  isActive
}
fragment ProjectSegmentFields on ProjectSegment {
  id
  projectId
  title
  order
  openDate
  closeDate
}
fragment ProjectFields on Project {
  id
  projectAreaId
  name
  estimatedValue
  outline
  scope
  openDate
  closeDate
  assignedLeadId
  officerId
  status
  isPublic
  area {
    id
    name
  }
  assignedLead {
    id
    name
  }
  officer {
    id
    name
  }
  segments {
    ...ProjectSegmentFields
  }
  artifacts {
    ...ProjectArtifactFields
  }
}`);

export const useUpdateProjectMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateProjectMutation, TError, UpdateProjectMutationVariables, TContext>) => {
    
    return useMutation<UpdateProjectMutation, TError, UpdateProjectMutationVariables, TContext>(
      {
    mutationKey: ['UpdateProject'],
    mutationFn: (variables?: UpdateProjectMutationVariables) => fetchGraphQL<UpdateProjectMutation, UpdateProjectMutationVariables>(UpdateProjectDocument, variables)(),
    ...options
  }
    )};


useUpdateProjectMutation.fetcher = (variables: UpdateProjectMutationVariables, options?: RequestInit['headers']) => fetchGraphQL<UpdateProjectMutation, UpdateProjectMutationVariables>(UpdateProjectDocument, variables, options);

export const ActivateProjectDocument = new TypedDocumentString(`
    mutation ActivateProject($id: ID!) {
  activateProject(id: $id) {
    ...ProjectFields
  }
}
    fragment ProjectArtifactFields on ProjectArtifact {
  id
  projectId
  templateId
  title
  description
  type
  surveyJsSchema
  isActive
}
fragment ProjectSegmentFields on ProjectSegment {
  id
  projectId
  title
  order
  openDate
  closeDate
}
fragment ProjectFields on Project {
  id
  projectAreaId
  name
  estimatedValue
  outline
  scope
  openDate
  closeDate
  assignedLeadId
  officerId
  status
  isPublic
  area {
    id
    name
  }
  assignedLead {
    id
    name
  }
  officer {
    id
    name
  }
  segments {
    ...ProjectSegmentFields
  }
  artifacts {
    ...ProjectArtifactFields
  }
}`);

export const useActivateProjectMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<ActivateProjectMutation, TError, ActivateProjectMutationVariables, TContext>) => {
    
    return useMutation<ActivateProjectMutation, TError, ActivateProjectMutationVariables, TContext>(
      {
    mutationKey: ['ActivateProject'],
    mutationFn: (variables?: ActivateProjectMutationVariables) => fetchGraphQL<ActivateProjectMutation, ActivateProjectMutationVariables>(ActivateProjectDocument, variables)(),
    ...options
  }
    )};


useActivateProjectMutation.fetcher = (variables: ActivateProjectMutationVariables, options?: RequestInit['headers']) => fetchGraphQL<ActivateProjectMutation, ActivateProjectMutationVariables>(ActivateProjectDocument, variables, options);

export const AddProjectArtifactDocument = new TypedDocumentString(`
    mutation AddProjectArtifact($projectId: ID!, $input: ArtifactInput!) {
  addProjectArtifact(projectId: $projectId, input: $input) {
    ...ProjectArtifactFields
  }
}
    fragment ProjectArtifactFields on ProjectArtifact {
  id
  projectId
  templateId
  title
  description
  type
  surveyJsSchema
  isActive
}`);

export const useAddProjectArtifactMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<AddProjectArtifactMutation, TError, AddProjectArtifactMutationVariables, TContext>) => {
    
    return useMutation<AddProjectArtifactMutation, TError, AddProjectArtifactMutationVariables, TContext>(
      {
    mutationKey: ['AddProjectArtifact'],
    mutationFn: (variables?: AddProjectArtifactMutationVariables) => fetchGraphQL<AddProjectArtifactMutation, AddProjectArtifactMutationVariables>(AddProjectArtifactDocument, variables)(),
    ...options
  }
    )};


useAddProjectArtifactMutation.fetcher = (variables: AddProjectArtifactMutationVariables, options?: RequestInit['headers']) => fetchGraphQL<AddProjectArtifactMutation, AddProjectArtifactMutationVariables>(AddProjectArtifactDocument, variables, options);

export const RemoveProjectArtifactDocument = new TypedDocumentString(`
    mutation RemoveProjectArtifact($id: ID!) {
  removeProjectArtifact(id: $id) {
    ...ProjectArtifactFields
  }
}
    fragment ProjectArtifactFields on ProjectArtifact {
  id
  projectId
  templateId
  title
  description
  type
  surveyJsSchema
  isActive
}`);

export const useRemoveProjectArtifactMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<RemoveProjectArtifactMutation, TError, RemoveProjectArtifactMutationVariables, TContext>) => {
    
    return useMutation<RemoveProjectArtifactMutation, TError, RemoveProjectArtifactMutationVariables, TContext>(
      {
    mutationKey: ['RemoveProjectArtifact'],
    mutationFn: (variables?: RemoveProjectArtifactMutationVariables) => fetchGraphQL<RemoveProjectArtifactMutation, RemoveProjectArtifactMutationVariables>(RemoveProjectArtifactDocument, variables)(),
    ...options
  }
    )};


useRemoveProjectArtifactMutation.fetcher = (variables: RemoveProjectArtifactMutationVariables, options?: RequestInit['headers']) => fetchGraphQL<RemoveProjectArtifactMutation, RemoveProjectArtifactMutationVariables>(RemoveProjectArtifactDocument, variables, options);

export const SolicitVendorDocument = new TypedDocumentString(`
    mutation SolicitVendor($projectId: ID!, $vendorId: ID!) {
  solicitVendor(projectId: $projectId, vendorId: $vendorId) {
    id
    projectId
    vendorId
    invitedAt
  }
}
    `);

export const useSolicitVendorMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<SolicitVendorMutation, TError, SolicitVendorMutationVariables, TContext>) => {
    
    return useMutation<SolicitVendorMutation, TError, SolicitVendorMutationVariables, TContext>(
      {
    mutationKey: ['SolicitVendor'],
    mutationFn: (variables?: SolicitVendorMutationVariables) => fetchGraphQL<SolicitVendorMutation, SolicitVendorMutationVariables>(SolicitVendorDocument, variables)(),
    ...options
  }
    )};


useSolicitVendorMutation.fetcher = (variables: SolicitVendorMutationVariables, options?: RequestInit['headers']) => fetchGraphQL<SolicitVendorMutation, SolicitVendorMutationVariables>(SolicitVendorDocument, variables, options);

export const SignUpDocument = new TypedDocumentString(`
    mutation SignUp($projectId: ID!) {
  signUp(projectId: $projectId) {
    ...ProposalFields
  }
}
    fragment SubmissionFields on ArtifactSubmission {
  id
  proposalId
  projectArtifactId
  type
  surveyJsResponses
  documentName
  submittedAt
}
fragment ProposalFields on Proposal {
  id
  projectId
  vendorId
  status
  signedUpAt
  vendor {
    id
    name
    companyName
  }
  project {
    id
    name
    status
    estimatedValue
    closeDate
  }
  submissions {
    ...SubmissionFields
  }
  additionalItems {
    id
    proposalId
    name
    note
  }
}`);

export const useSignUpMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<SignUpMutation, TError, SignUpMutationVariables, TContext>) => {
    
    return useMutation<SignUpMutation, TError, SignUpMutationVariables, TContext>(
      {
    mutationKey: ['SignUp'],
    mutationFn: (variables?: SignUpMutationVariables) => fetchGraphQL<SignUpMutation, SignUpMutationVariables>(SignUpDocument, variables)(),
    ...options
  }
    )};


useSignUpMutation.fetcher = (variables: SignUpMutationVariables, options?: RequestInit['headers']) => fetchGraphQL<SignUpMutation, SignUpMutationVariables>(SignUpDocument, variables, options);

export const MarkNotInterestedDocument = new TypedDocumentString(`
    mutation MarkNotInterested($projectId: ID!) {
  markNotInterested(projectId: $projectId)
}
    `);

export const useMarkNotInterestedMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<MarkNotInterestedMutation, TError, MarkNotInterestedMutationVariables, TContext>) => {
    
    return useMutation<MarkNotInterestedMutation, TError, MarkNotInterestedMutationVariables, TContext>(
      {
    mutationKey: ['MarkNotInterested'],
    mutationFn: (variables?: MarkNotInterestedMutationVariables) => fetchGraphQL<MarkNotInterestedMutation, MarkNotInterestedMutationVariables>(MarkNotInterestedDocument, variables)(),
    ...options
  }
    )};


useMarkNotInterestedMutation.fetcher = (variables: MarkNotInterestedMutationVariables, options?: RequestInit['headers']) => fetchGraphQL<MarkNotInterestedMutation, MarkNotInterestedMutationVariables>(MarkNotInterestedDocument, variables, options);

export const ReconsiderProjectDocument = new TypedDocumentString(`
    mutation ReconsiderProject($projectId: ID!) {
  reconsiderProject(projectId: $projectId)
}
    `);

export const useReconsiderProjectMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<ReconsiderProjectMutation, TError, ReconsiderProjectMutationVariables, TContext>) => {
    
    return useMutation<ReconsiderProjectMutation, TError, ReconsiderProjectMutationVariables, TContext>(
      {
    mutationKey: ['ReconsiderProject'],
    mutationFn: (variables?: ReconsiderProjectMutationVariables) => fetchGraphQL<ReconsiderProjectMutation, ReconsiderProjectMutationVariables>(ReconsiderProjectDocument, variables)(),
    ...options
  }
    )};


useReconsiderProjectMutation.fetcher = (variables: ReconsiderProjectMutationVariables, options?: RequestInit['headers']) => fetchGraphQL<ReconsiderProjectMutation, ReconsiderProjectMutationVariables>(ReconsiderProjectDocument, variables, options);

export const SubmitArtifactDocument = new TypedDocumentString(`
    mutation SubmitArtifact($input: SubmissionInput!) {
  submitArtifact(input: $input) {
    ...SubmissionFields
  }
}
    fragment SubmissionFields on ArtifactSubmission {
  id
  proposalId
  projectArtifactId
  type
  surveyJsResponses
  documentName
  submittedAt
}`);

export const useSubmitArtifactMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<SubmitArtifactMutation, TError, SubmitArtifactMutationVariables, TContext>) => {
    
    return useMutation<SubmitArtifactMutation, TError, SubmitArtifactMutationVariables, TContext>(
      {
    mutationKey: ['SubmitArtifact'],
    mutationFn: (variables?: SubmitArtifactMutationVariables) => fetchGraphQL<SubmitArtifactMutation, SubmitArtifactMutationVariables>(SubmitArtifactDocument, variables)(),
    ...options
  }
    )};


useSubmitArtifactMutation.fetcher = (variables: SubmitArtifactMutationVariables, options?: RequestInit['headers']) => fetchGraphQL<SubmitArtifactMutation, SubmitArtifactMutationVariables>(SubmitArtifactDocument, variables, options);

export const SubmitProposalDocument = new TypedDocumentString(`
    mutation SubmitProposal($proposalId: ID!) {
  submitProposal(proposalId: $proposalId) {
    ...ProposalFields
  }
}
    fragment SubmissionFields on ArtifactSubmission {
  id
  proposalId
  projectArtifactId
  type
  surveyJsResponses
  documentName
  submittedAt
}
fragment ProposalFields on Proposal {
  id
  projectId
  vendorId
  status
  signedUpAt
  vendor {
    id
    name
    companyName
  }
  project {
    id
    name
    status
    estimatedValue
    closeDate
  }
  submissions {
    ...SubmissionFields
  }
  additionalItems {
    id
    proposalId
    name
    note
  }
}`);

export const useSubmitProposalMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<SubmitProposalMutation, TError, SubmitProposalMutationVariables, TContext>) => {
    
    return useMutation<SubmitProposalMutation, TError, SubmitProposalMutationVariables, TContext>(
      {
    mutationKey: ['SubmitProposal'],
    mutationFn: (variables?: SubmitProposalMutationVariables) => fetchGraphQL<SubmitProposalMutation, SubmitProposalMutationVariables>(SubmitProposalDocument, variables)(),
    ...options
  }
    )};


useSubmitProposalMutation.fetcher = (variables: SubmitProposalMutationVariables, options?: RequestInit['headers']) => fetchGraphQL<SubmitProposalMutation, SubmitProposalMutationVariables>(SubmitProposalDocument, variables, options);

export const AddAdditionalItemDocument = new TypedDocumentString(`
    mutation AddAdditionalItem($proposalId: ID!, $name: String!, $note: String) {
  addAdditionalItem(proposalId: $proposalId, name: $name, note: $note) {
    id
    proposalId
    name
    note
  }
}
    `);

export const useAddAdditionalItemMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<AddAdditionalItemMutation, TError, AddAdditionalItemMutationVariables, TContext>) => {
    
    return useMutation<AddAdditionalItemMutation, TError, AddAdditionalItemMutationVariables, TContext>(
      {
    mutationKey: ['AddAdditionalItem'],
    mutationFn: (variables?: AddAdditionalItemMutationVariables) => fetchGraphQL<AddAdditionalItemMutation, AddAdditionalItemMutationVariables>(AddAdditionalItemDocument, variables)(),
    ...options
  }
    )};


useAddAdditionalItemMutation.fetcher = (variables: AddAdditionalItemMutationVariables, options?: RequestInit['headers']) => fetchGraphQL<AddAdditionalItemMutation, AddAdditionalItemMutationVariables>(AddAdditionalItemDocument, variables, options);

export const UpdateDemographicsDocument = new TypedDocumentString(`
    mutation UpdateDemographics($input: DemographicsInput!) {
  updateDemographics(input: $input) {
    ...UserFields
  }
}
    fragment UserFields on User {
  id
  name
  email
  phone
  roles
  companyName
  jurisdiction
  lastActive
}`);

export const useUpdateDemographicsMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateDemographicsMutation, TError, UpdateDemographicsMutationVariables, TContext>) => {
    
    return useMutation<UpdateDemographicsMutation, TError, UpdateDemographicsMutationVariables, TContext>(
      {
    mutationKey: ['UpdateDemographics'],
    mutationFn: (variables?: UpdateDemographicsMutationVariables) => fetchGraphQL<UpdateDemographicsMutation, UpdateDemographicsMutationVariables>(UpdateDemographicsDocument, variables)(),
    ...options
  }
    )};


useUpdateDemographicsMutation.fetcher = (variables: UpdateDemographicsMutationVariables, options?: RequestInit['headers']) => fetchGraphQL<UpdateDemographicsMutation, UpdateDemographicsMutationVariables>(UpdateDemographicsDocument, variables, options);

export const FilterProposalDocument = new TypedDocumentString(`
    mutation FilterProposal($proposalId: ID!, $pass: Boolean!) {
  filterProposal(proposalId: $proposalId, pass: $pass) {
    ...ProposalFields
  }
}
    fragment SubmissionFields on ArtifactSubmission {
  id
  proposalId
  projectArtifactId
  type
  surveyJsResponses
  documentName
  submittedAt
}
fragment ProposalFields on Proposal {
  id
  projectId
  vendorId
  status
  signedUpAt
  vendor {
    id
    name
    companyName
  }
  project {
    id
    name
    status
    estimatedValue
    closeDate
  }
  submissions {
    ...SubmissionFields
  }
  additionalItems {
    id
    proposalId
    name
    note
  }
}`);

export const useFilterProposalMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<FilterProposalMutation, TError, FilterProposalMutationVariables, TContext>) => {
    
    return useMutation<FilterProposalMutation, TError, FilterProposalMutationVariables, TContext>(
      {
    mutationKey: ['FilterProposal'],
    mutationFn: (variables?: FilterProposalMutationVariables) => fetchGraphQL<FilterProposalMutation, FilterProposalMutationVariables>(FilterProposalDocument, variables)(),
    ...options
  }
    )};


useFilterProposalMutation.fetcher = (variables: FilterProposalMutationVariables, options?: RequestInit['headers']) => fetchGraphQL<FilterProposalMutation, FilterProposalMutationVariables>(FilterProposalDocument, variables, options);

export const ApproveRoundDocument = new TypedDocumentString(`
    mutation ApproveRound($proposalId: ID!, $approve: Boolean!) {
  approveRound(proposalId: $proposalId, approve: $approve) {
    ...ProposalFields
  }
}
    fragment SubmissionFields on ArtifactSubmission {
  id
  proposalId
  projectArtifactId
  type
  surveyJsResponses
  documentName
  submittedAt
}
fragment ProposalFields on Proposal {
  id
  projectId
  vendorId
  status
  signedUpAt
  vendor {
    id
    name
    companyName
  }
  project {
    id
    name
    status
    estimatedValue
    closeDate
  }
  submissions {
    ...SubmissionFields
  }
  additionalItems {
    id
    proposalId
    name
    note
  }
}`);

export const useApproveRoundMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<ApproveRoundMutation, TError, ApproveRoundMutationVariables, TContext>) => {
    
    return useMutation<ApproveRoundMutation, TError, ApproveRoundMutationVariables, TContext>(
      {
    mutationKey: ['ApproveRound'],
    mutationFn: (variables?: ApproveRoundMutationVariables) => fetchGraphQL<ApproveRoundMutation, ApproveRoundMutationVariables>(ApproveRoundDocument, variables)(),
    ...options
  }
    )};


useApproveRoundMutation.fetcher = (variables: ApproveRoundMutationVariables, options?: RequestInit['headers']) => fetchGraphQL<ApproveRoundMutation, ApproveRoundMutationVariables>(ApproveRoundDocument, variables, options);

export const RankFinalistDocument = new TypedDocumentString(`
    mutation RankFinalist($projectId: ID!, $vendorId: ID!, $rank: Int!) {
  rankFinalist(projectId: $projectId, vendorId: $vendorId, rank: $rank) {
    id
    projectId
    vendorId
    rank
    status
  }
}
    `);

export const useRankFinalistMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<RankFinalistMutation, TError, RankFinalistMutationVariables, TContext>) => {
    
    return useMutation<RankFinalistMutation, TError, RankFinalistMutationVariables, TContext>(
      {
    mutationKey: ['RankFinalist'],
    mutationFn: (variables?: RankFinalistMutationVariables) => fetchGraphQL<RankFinalistMutation, RankFinalistMutationVariables>(RankFinalistDocument, variables)(),
    ...options
  }
    )};


useRankFinalistMutation.fetcher = (variables: RankFinalistMutationVariables, options?: RequestInit['headers']) => fetchGraphQL<RankFinalistMutation, RankFinalistMutationVariables>(RankFinalistDocument, variables, options);

export const ApproveFinalDocument = new TypedDocumentString(`
    mutation ApproveFinal($proposalId: ID!, $approve: Boolean!) {
  approveFinal(proposalId: $proposalId, approve: $approve) {
    ...ProposalFields
  }
}
    fragment SubmissionFields on ArtifactSubmission {
  id
  proposalId
  projectArtifactId
  type
  surveyJsResponses
  documentName
  submittedAt
}
fragment ProposalFields on Proposal {
  id
  projectId
  vendorId
  status
  signedUpAt
  vendor {
    id
    name
    companyName
  }
  project {
    id
    name
    status
    estimatedValue
    closeDate
  }
  submissions {
    ...SubmissionFields
  }
  additionalItems {
    id
    proposalId
    name
    note
  }
}`);

export const useApproveFinalMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<ApproveFinalMutation, TError, ApproveFinalMutationVariables, TContext>) => {
    
    return useMutation<ApproveFinalMutation, TError, ApproveFinalMutationVariables, TContext>(
      {
    mutationKey: ['ApproveFinal'],
    mutationFn: (variables?: ApproveFinalMutationVariables) => fetchGraphQL<ApproveFinalMutation, ApproveFinalMutationVariables>(ApproveFinalDocument, variables)(),
    ...options
  }
    )};


useApproveFinalMutation.fetcher = (variables: ApproveFinalMutationVariables, options?: RequestInit['headers']) => fetchGraphQL<ApproveFinalMutation, ApproveFinalMutationVariables>(ApproveFinalDocument, variables, options);

export const DashboardDocument = new TypedDocumentString(`
    query Dashboard {
  dashboard {
    activeProjects
    activeEstimatedValue
    activeVendors
    projectsInLegal
    projectsByActiveSegment {
      segmentTitle
      count
    }
    topVendorsByProjectCount {
      vendorId
      vendorName
      value
    }
    topVendorsByEstimatedTotal {
      vendorId
      vendorName
      value
    }
    topOfficersByEstimatedTotal {
      vendorId
      vendorName
      value
    }
    estimatedValueClosingByMonth {
      month
      value
    }
    upcomingSegmentEvents {
      projectId
      projectName
      segmentTitle
      date
      kind
    }
  }
}
    `);

export const useDashboardQuery = <
      TData = DashboardQuery,
      TError = unknown
    >(
      variables?: DashboardQueryVariables,
      options?: Omit<UseQueryOptions<DashboardQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<DashboardQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<DashboardQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['Dashboard'] : ['Dashboard', variables],
    queryFn: fetchGraphQL<DashboardQuery, DashboardQueryVariables>(DashboardDocument, variables),
    ...options
  }
    )};

useDashboardQuery.getKey = (variables?: DashboardQueryVariables) => variables === undefined ? ['Dashboard'] : ['Dashboard', variables];


useDashboardQuery.fetcher = (variables?: DashboardQueryVariables, options?: RequestInit['headers']) => fetchGraphQL<DashboardQuery, DashboardQueryVariables>(DashboardDocument, variables, options);

export const MeDocument = new TypedDocumentString(`
    query Me {
  me {
    ...UserFields
  }
}
    fragment UserFields on User {
  id
  name
  email
  phone
  roles
  companyName
  jurisdiction
  lastActive
}`);

export const useMeQuery = <
      TData = MeQuery,
      TError = unknown
    >(
      variables?: MeQueryVariables,
      options?: Omit<UseQueryOptions<MeQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<MeQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<MeQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['Me'] : ['Me', variables],
    queryFn: fetchGraphQL<MeQuery, MeQueryVariables>(MeDocument, variables),
    ...options
  }
    )};

useMeQuery.getKey = (variables?: MeQueryVariables) => variables === undefined ? ['Me'] : ['Me', variables];


useMeQuery.fetcher = (variables?: MeQueryVariables, options?: RequestInit['headers']) => fetchGraphQL<MeQuery, MeQueryVariables>(MeDocument, variables, options);

export const ProjectsDocument = new TypedDocumentString(`
    query Projects($filter: ProjectFilter) {
  projects(filter: $filter) {
    ...ProjectFields
  }
}
    fragment ProjectArtifactFields on ProjectArtifact {
  id
  projectId
  templateId
  title
  description
  type
  surveyJsSchema
  isActive
}
fragment ProjectSegmentFields on ProjectSegment {
  id
  projectId
  title
  order
  openDate
  closeDate
}
fragment ProjectFields on Project {
  id
  projectAreaId
  name
  estimatedValue
  outline
  scope
  openDate
  closeDate
  assignedLeadId
  officerId
  status
  isPublic
  area {
    id
    name
  }
  assignedLead {
    id
    name
  }
  officer {
    id
    name
  }
  segments {
    ...ProjectSegmentFields
  }
  artifacts {
    ...ProjectArtifactFields
  }
}`);

export const useProjectsQuery = <
      TData = ProjectsQuery,
      TError = unknown
    >(
      variables?: ProjectsQueryVariables,
      options?: Omit<UseQueryOptions<ProjectsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<ProjectsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<ProjectsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['Projects'] : ['Projects', variables],
    queryFn: fetchGraphQL<ProjectsQuery, ProjectsQueryVariables>(ProjectsDocument, variables),
    ...options
  }
    )};

useProjectsQuery.getKey = (variables?: ProjectsQueryVariables) => variables === undefined ? ['Projects'] : ['Projects', variables];


useProjectsQuery.fetcher = (variables?: ProjectsQueryVariables, options?: RequestInit['headers']) => fetchGraphQL<ProjectsQuery, ProjectsQueryVariables>(ProjectsDocument, variables, options);

export const ProjectDocument = new TypedDocumentString(`
    query Project($id: ID!) {
  project(id: $id) {
    ...ProjectFields
  }
}
    fragment ProjectArtifactFields on ProjectArtifact {
  id
  projectId
  templateId
  title
  description
  type
  surveyJsSchema
  isActive
}
fragment ProjectSegmentFields on ProjectSegment {
  id
  projectId
  title
  order
  openDate
  closeDate
}
fragment ProjectFields on Project {
  id
  projectAreaId
  name
  estimatedValue
  outline
  scope
  openDate
  closeDate
  assignedLeadId
  officerId
  status
  isPublic
  area {
    id
    name
  }
  assignedLead {
    id
    name
  }
  officer {
    id
    name
  }
  segments {
    ...ProjectSegmentFields
  }
  artifacts {
    ...ProjectArtifactFields
  }
}`);

export const useProjectQuery = <
      TData = ProjectQuery,
      TError = unknown
    >(
      variables: ProjectQueryVariables,
      options?: Omit<UseQueryOptions<ProjectQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<ProjectQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<ProjectQuery, TError, TData>(
      {
    queryKey: ['Project', variables],
    queryFn: fetchGraphQL<ProjectQuery, ProjectQueryVariables>(ProjectDocument, variables),
    ...options
  }
    )};

useProjectQuery.getKey = (variables: ProjectQueryVariables) => ['Project', variables];


useProjectQuery.fetcher = (variables: ProjectQueryVariables, options?: RequestInit['headers']) => fetchGraphQL<ProjectQuery, ProjectQueryVariables>(ProjectDocument, variables, options);

export const ProjectAreasDocument = new TypedDocumentString(`
    query ProjectAreas {
  projectAreas {
    id
    name
  }
}
    `);

export const useProjectAreasQuery = <
      TData = ProjectAreasQuery,
      TError = unknown
    >(
      variables?: ProjectAreasQueryVariables,
      options?: Omit<UseQueryOptions<ProjectAreasQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<ProjectAreasQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<ProjectAreasQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['ProjectAreas'] : ['ProjectAreas', variables],
    queryFn: fetchGraphQL<ProjectAreasQuery, ProjectAreasQueryVariables>(ProjectAreasDocument, variables),
    ...options
  }
    )};

useProjectAreasQuery.getKey = (variables?: ProjectAreasQueryVariables) => variables === undefined ? ['ProjectAreas'] : ['ProjectAreas', variables];


useProjectAreasQuery.fetcher = (variables?: ProjectAreasQueryVariables, options?: RequestInit['headers']) => fetchGraphQL<ProjectAreasQuery, ProjectAreasQueryVariables>(ProjectAreasDocument, variables, options);

export const VendorsDocument = new TypedDocumentString(`
    query Vendors {
  vendors {
    ...UserFields
  }
}
    fragment UserFields on User {
  id
  name
  email
  phone
  roles
  companyName
  jurisdiction
  lastActive
}`);

export const useVendorsQuery = <
      TData = VendorsQuery,
      TError = unknown
    >(
      variables?: VendorsQueryVariables,
      options?: Omit<UseQueryOptions<VendorsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<VendorsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<VendorsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['Vendors'] : ['Vendors', variables],
    queryFn: fetchGraphQL<VendorsQuery, VendorsQueryVariables>(VendorsDocument, variables),
    ...options
  }
    )};

useVendorsQuery.getKey = (variables?: VendorsQueryVariables) => variables === undefined ? ['Vendors'] : ['Vendors', variables];


useVendorsQuery.fetcher = (variables?: VendorsQueryVariables, options?: RequestInit['headers']) => fetchGraphQL<VendorsQuery, VendorsQueryVariables>(VendorsDocument, variables, options);

export const VendorDocument = new TypedDocumentString(`
    query Vendor($id: ID!) {
  vendor(id: $id) {
    ...UserFields
  }
}
    fragment UserFields on User {
  id
  name
  email
  phone
  roles
  companyName
  jurisdiction
  lastActive
}`);

export const useVendorQuery = <
      TData = VendorQuery,
      TError = unknown
    >(
      variables: VendorQueryVariables,
      options?: Omit<UseQueryOptions<VendorQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<VendorQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<VendorQuery, TError, TData>(
      {
    queryKey: ['Vendor', variables],
    queryFn: fetchGraphQL<VendorQuery, VendorQueryVariables>(VendorDocument, variables),
    ...options
  }
    )};

useVendorQuery.getKey = (variables: VendorQueryVariables) => ['Vendor', variables];


useVendorQuery.fetcher = (variables: VendorQueryVariables, options?: RequestInit['headers']) => fetchGraphQL<VendorQuery, VendorQueryVariables>(VendorDocument, variables, options);

export const ArtifactTemplatesDocument = new TypedDocumentString(`
    query ArtifactTemplates {
  artifactTemplates {
    id
    title
    description
    type
    surveyJsSchema
    shared
  }
}
    `);

export const useArtifactTemplatesQuery = <
      TData = ArtifactTemplatesQuery,
      TError = unknown
    >(
      variables?: ArtifactTemplatesQueryVariables,
      options?: Omit<UseQueryOptions<ArtifactTemplatesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<ArtifactTemplatesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<ArtifactTemplatesQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['ArtifactTemplates'] : ['ArtifactTemplates', variables],
    queryFn: fetchGraphQL<ArtifactTemplatesQuery, ArtifactTemplatesQueryVariables>(ArtifactTemplatesDocument, variables),
    ...options
  }
    )};

useArtifactTemplatesQuery.getKey = (variables?: ArtifactTemplatesQueryVariables) => variables === undefined ? ['ArtifactTemplates'] : ['ArtifactTemplates', variables];


useArtifactTemplatesQuery.fetcher = (variables?: ArtifactTemplatesQueryVariables, options?: RequestInit['headers']) => fetchGraphQL<ArtifactTemplatesQuery, ArtifactTemplatesQueryVariables>(ArtifactTemplatesDocument, variables, options);

export const AllProposalsDocument = new TypedDocumentString(`
    query AllProposals {
  allProposals {
    ...ProposalFields
  }
}
    fragment SubmissionFields on ArtifactSubmission {
  id
  proposalId
  projectArtifactId
  type
  surveyJsResponses
  documentName
  submittedAt
}
fragment ProposalFields on Proposal {
  id
  projectId
  vendorId
  status
  signedUpAt
  vendor {
    id
    name
    companyName
  }
  project {
    id
    name
    status
    estimatedValue
    closeDate
  }
  submissions {
    ...SubmissionFields
  }
  additionalItems {
    id
    proposalId
    name
    note
  }
}`);

export const useAllProposalsQuery = <
      TData = AllProposalsQuery,
      TError = unknown
    >(
      variables?: AllProposalsQueryVariables,
      options?: Omit<UseQueryOptions<AllProposalsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<AllProposalsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<AllProposalsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['AllProposals'] : ['AllProposals', variables],
    queryFn: fetchGraphQL<AllProposalsQuery, AllProposalsQueryVariables>(AllProposalsDocument, variables),
    ...options
  }
    )};

useAllProposalsQuery.getKey = (variables?: AllProposalsQueryVariables) => variables === undefined ? ['AllProposals'] : ['AllProposals', variables];


useAllProposalsQuery.fetcher = (variables?: AllProposalsQueryVariables, options?: RequestInit['headers']) => fetchGraphQL<AllProposalsQuery, AllProposalsQueryVariables>(AllProposalsDocument, variables, options);

export const ProjectProposalsDocument = new TypedDocumentString(`
    query ProjectProposals($projectId: ID!) {
  projectProposals(projectId: $projectId) {
    ...ProposalFields
  }
}
    fragment SubmissionFields on ArtifactSubmission {
  id
  proposalId
  projectArtifactId
  type
  surveyJsResponses
  documentName
  submittedAt
}
fragment ProposalFields on Proposal {
  id
  projectId
  vendorId
  status
  signedUpAt
  vendor {
    id
    name
    companyName
  }
  project {
    id
    name
    status
    estimatedValue
    closeDate
  }
  submissions {
    ...SubmissionFields
  }
  additionalItems {
    id
    proposalId
    name
    note
  }
}`);

export const useProjectProposalsQuery = <
      TData = ProjectProposalsQuery,
      TError = unknown
    >(
      variables: ProjectProposalsQueryVariables,
      options?: Omit<UseQueryOptions<ProjectProposalsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<ProjectProposalsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<ProjectProposalsQuery, TError, TData>(
      {
    queryKey: ['ProjectProposals', variables],
    queryFn: fetchGraphQL<ProjectProposalsQuery, ProjectProposalsQueryVariables>(ProjectProposalsDocument, variables),
    ...options
  }
    )};

useProjectProposalsQuery.getKey = (variables: ProjectProposalsQueryVariables) => ['ProjectProposals', variables];


useProjectProposalsQuery.fetcher = (variables: ProjectProposalsQueryVariables, options?: RequestInit['headers']) => fetchGraphQL<ProjectProposalsQuery, ProjectProposalsQueryVariables>(ProjectProposalsDocument, variables, options);

export const ProjectSolicitationsDocument = new TypedDocumentString(`
    query ProjectSolicitations($projectId: ID!) {
  projectSolicitations(projectId: $projectId) {
    ...SolicitationFields
  }
}
    fragment SolicitationFields on Solicitation {
  id
  projectId
  vendorId
  invitedAt
}`);

export const useProjectSolicitationsQuery = <
      TData = ProjectSolicitationsQuery,
      TError = unknown
    >(
      variables: ProjectSolicitationsQueryVariables,
      options?: Omit<UseQueryOptions<ProjectSolicitationsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<ProjectSolicitationsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<ProjectSolicitationsQuery, TError, TData>(
      {
    queryKey: ['ProjectSolicitations', variables],
    queryFn: fetchGraphQL<ProjectSolicitationsQuery, ProjectSolicitationsQueryVariables>(ProjectSolicitationsDocument, variables),
    ...options
  }
    )};

useProjectSolicitationsQuery.getKey = (variables: ProjectSolicitationsQueryVariables) => ['ProjectSolicitations', variables];


useProjectSolicitationsQuery.fetcher = (variables: ProjectSolicitationsQueryVariables, options?: RequestInit['headers']) => fetchGraphQL<ProjectSolicitationsQuery, ProjectSolicitationsQueryVariables>(ProjectSolicitationsDocument, variables, options);

export const ProjectFinalistsDocument = new TypedDocumentString(`
    query ProjectFinalists($projectId: ID!) {
  projectFinalists(projectId: $projectId) {
    ...FinalistFields
  }
}
    fragment FinalistFields on Finalist {
  id
  projectId
  vendorId
  rank
  status
  vendor {
    id
    name
    companyName
  }
}`);

export const useProjectFinalistsQuery = <
      TData = ProjectFinalistsQuery,
      TError = unknown
    >(
      variables: ProjectFinalistsQueryVariables,
      options?: Omit<UseQueryOptions<ProjectFinalistsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<ProjectFinalistsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<ProjectFinalistsQuery, TError, TData>(
      {
    queryKey: ['ProjectFinalists', variables],
    queryFn: fetchGraphQL<ProjectFinalistsQuery, ProjectFinalistsQueryVariables>(ProjectFinalistsDocument, variables),
    ...options
  }
    )};

useProjectFinalistsQuery.getKey = (variables: ProjectFinalistsQueryVariables) => ['ProjectFinalists', variables];


useProjectFinalistsQuery.fetcher = (variables: ProjectFinalistsQueryVariables, options?: RequestInit['headers']) => fetchGraphQL<ProjectFinalistsQuery, ProjectFinalistsQueryVariables>(ProjectFinalistsDocument, variables, options);

export const ProjectNotInterestedVendorsDocument = new TypedDocumentString(`
    query ProjectNotInterestedVendors($projectId: ID!) {
  projectNotInterestedVendors(projectId: $projectId) {
    ...UserFields
  }
}
    fragment UserFields on User {
  id
  name
  email
  phone
  roles
  companyName
  jurisdiction
  lastActive
}`);

export const useProjectNotInterestedVendorsQuery = <
      TData = ProjectNotInterestedVendorsQuery,
      TError = unknown
    >(
      variables: ProjectNotInterestedVendorsQueryVariables,
      options?: Omit<UseQueryOptions<ProjectNotInterestedVendorsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<ProjectNotInterestedVendorsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<ProjectNotInterestedVendorsQuery, TError, TData>(
      {
    queryKey: ['ProjectNotInterestedVendors', variables],
    queryFn: fetchGraphQL<ProjectNotInterestedVendorsQuery, ProjectNotInterestedVendorsQueryVariables>(ProjectNotInterestedVendorsDocument, variables),
    ...options
  }
    )};

useProjectNotInterestedVendorsQuery.getKey = (variables: ProjectNotInterestedVendorsQueryVariables) => ['ProjectNotInterestedVendors', variables];


useProjectNotInterestedVendorsQuery.fetcher = (variables: ProjectNotInterestedVendorsQueryVariables, options?: RequestInit['headers']) => fetchGraphQL<ProjectNotInterestedVendorsQuery, ProjectNotInterestedVendorsQueryVariables>(ProjectNotInterestedVendorsDocument, variables, options);

export const MyProposalsDocument = new TypedDocumentString(`
    query MyProposals {
  myProposals {
    ...ProposalFields
  }
}
    fragment SubmissionFields on ArtifactSubmission {
  id
  proposalId
  projectArtifactId
  type
  surveyJsResponses
  documentName
  submittedAt
}
fragment ProposalFields on Proposal {
  id
  projectId
  vendorId
  status
  signedUpAt
  vendor {
    id
    name
    companyName
  }
  project {
    id
    name
    status
    estimatedValue
    closeDate
  }
  submissions {
    ...SubmissionFields
  }
  additionalItems {
    id
    proposalId
    name
    note
  }
}`);

export const useMyProposalsQuery = <
      TData = MyProposalsQuery,
      TError = unknown
    >(
      variables?: MyProposalsQueryVariables,
      options?: Omit<UseQueryOptions<MyProposalsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<MyProposalsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<MyProposalsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['MyProposals'] : ['MyProposals', variables],
    queryFn: fetchGraphQL<MyProposalsQuery, MyProposalsQueryVariables>(MyProposalsDocument, variables),
    ...options
  }
    )};

useMyProposalsQuery.getKey = (variables?: MyProposalsQueryVariables) => variables === undefined ? ['MyProposals'] : ['MyProposals', variables];


useMyProposalsQuery.fetcher = (variables?: MyProposalsQueryVariables, options?: RequestInit['headers']) => fetchGraphQL<MyProposalsQuery, MyProposalsQueryVariables>(MyProposalsDocument, variables, options);

export const AvailableProjectsDocument = new TypedDocumentString(`
    query AvailableProjects {
  availableProjects {
    ...ProjectFields
  }
}
    fragment ProjectArtifactFields on ProjectArtifact {
  id
  projectId
  templateId
  title
  description
  type
  surveyJsSchema
  isActive
}
fragment ProjectSegmentFields on ProjectSegment {
  id
  projectId
  title
  order
  openDate
  closeDate
}
fragment ProjectFields on Project {
  id
  projectAreaId
  name
  estimatedValue
  outline
  scope
  openDate
  closeDate
  assignedLeadId
  officerId
  status
  isPublic
  area {
    id
    name
  }
  assignedLead {
    id
    name
  }
  officer {
    id
    name
  }
  segments {
    ...ProjectSegmentFields
  }
  artifacts {
    ...ProjectArtifactFields
  }
}`);

export const useAvailableProjectsQuery = <
      TData = AvailableProjectsQuery,
      TError = unknown
    >(
      variables?: AvailableProjectsQueryVariables,
      options?: Omit<UseQueryOptions<AvailableProjectsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<AvailableProjectsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<AvailableProjectsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['AvailableProjects'] : ['AvailableProjects', variables],
    queryFn: fetchGraphQL<AvailableProjectsQuery, AvailableProjectsQueryVariables>(AvailableProjectsDocument, variables),
    ...options
  }
    )};

useAvailableProjectsQuery.getKey = (variables?: AvailableProjectsQueryVariables) => variables === undefined ? ['AvailableProjects'] : ['AvailableProjects', variables];


useAvailableProjectsQuery.fetcher = (variables?: AvailableProjectsQueryVariables, options?: RequestInit['headers']) => fetchGraphQL<AvailableProjectsQuery, AvailableProjectsQueryVariables>(AvailableProjectsDocument, variables, options);

export const NotInterestedProjectsDocument = new TypedDocumentString(`
    query NotInterestedProjects {
  notInterestedProjects {
    ...ProjectFields
  }
}
    fragment ProjectArtifactFields on ProjectArtifact {
  id
  projectId
  templateId
  title
  description
  type
  surveyJsSchema
  isActive
}
fragment ProjectSegmentFields on ProjectSegment {
  id
  projectId
  title
  order
  openDate
  closeDate
}
fragment ProjectFields on Project {
  id
  projectAreaId
  name
  estimatedValue
  outline
  scope
  openDate
  closeDate
  assignedLeadId
  officerId
  status
  isPublic
  area {
    id
    name
  }
  assignedLead {
    id
    name
  }
  officer {
    id
    name
  }
  segments {
    ...ProjectSegmentFields
  }
  artifacts {
    ...ProjectArtifactFields
  }
}`);

export const useNotInterestedProjectsQuery = <
      TData = NotInterestedProjectsQuery,
      TError = unknown
    >(
      variables?: NotInterestedProjectsQueryVariables,
      options?: Omit<UseQueryOptions<NotInterestedProjectsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<NotInterestedProjectsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<NotInterestedProjectsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['NotInterestedProjects'] : ['NotInterestedProjects', variables],
    queryFn: fetchGraphQL<NotInterestedProjectsQuery, NotInterestedProjectsQueryVariables>(NotInterestedProjectsDocument, variables),
    ...options
  }
    )};

useNotInterestedProjectsQuery.getKey = (variables?: NotInterestedProjectsQueryVariables) => variables === undefined ? ['NotInterestedProjects'] : ['NotInterestedProjects', variables];


useNotInterestedProjectsQuery.fetcher = (variables?: NotInterestedProjectsQueryVariables, options?: RequestInit['headers']) => fetchGraphQL<NotInterestedProjectsQuery, NotInterestedProjectsQueryVariables>(NotInterestedProjectsDocument, variables, options);

export const MySolicitationsDocument = new TypedDocumentString(`
    query MySolicitations {
  mySolicitations {
    ...SolicitationFields
  }
}
    fragment SolicitationFields on Solicitation {
  id
  projectId
  vendorId
  invitedAt
}`);

export const useMySolicitationsQuery = <
      TData = MySolicitationsQuery,
      TError = unknown
    >(
      variables?: MySolicitationsQueryVariables,
      options?: Omit<UseQueryOptions<MySolicitationsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<MySolicitationsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<MySolicitationsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['MySolicitations'] : ['MySolicitations', variables],
    queryFn: fetchGraphQL<MySolicitationsQuery, MySolicitationsQueryVariables>(MySolicitationsDocument, variables),
    ...options
  }
    )};

useMySolicitationsQuery.getKey = (variables?: MySolicitationsQueryVariables) => variables === undefined ? ['MySolicitations'] : ['MySolicitations', variables];


useMySolicitationsQuery.fetcher = (variables?: MySolicitationsQueryVariables, options?: RequestInit['headers']) => fetchGraphQL<MySolicitationsQuery, MySolicitationsQueryVariables>(MySolicitationsDocument, variables, options);

export const SharedArtifactsDocument = new TypedDocumentString(`
    query SharedArtifacts {
  sharedArtifacts {
    id
    title
    description
    type
    surveyJsSchema
    shared
  }
}
    `);

export const useSharedArtifactsQuery = <
      TData = SharedArtifactsQuery,
      TError = unknown
    >(
      variables?: SharedArtifactsQueryVariables,
      options?: Omit<UseQueryOptions<SharedArtifactsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<SharedArtifactsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<SharedArtifactsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['SharedArtifacts'] : ['SharedArtifacts', variables],
    queryFn: fetchGraphQL<SharedArtifactsQuery, SharedArtifactsQueryVariables>(SharedArtifactsDocument, variables),
    ...options
  }
    )};

useSharedArtifactsQuery.getKey = (variables?: SharedArtifactsQueryVariables) => variables === undefined ? ['SharedArtifacts'] : ['SharedArtifacts', variables];


useSharedArtifactsQuery.fetcher = (variables?: SharedArtifactsQueryVariables, options?: RequestInit['headers']) => fetchGraphQL<SharedArtifactsQuery, SharedArtifactsQueryVariables>(SharedArtifactsDocument, variables, options);
