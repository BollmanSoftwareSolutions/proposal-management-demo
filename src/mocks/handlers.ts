import { http, HttpResponse, type RequestHandler } from 'msw'
import {
  AccessError,
  NotFoundError,
  resolveIdentity,
  simulateLatency,
} from './resolvers/access'
import type { User } from './store/types'
import * as queries from './resolvers/queries'
import * as mutations from './resolvers/index'

type Vars = Record<string, unknown>
interface GraphQLBody {
  query?: string
  variables?: Vars
  operationName?: string
}

interface OperationDef {
  field: string
  resolve: (identity: User, variables: Vars) => unknown
}

/** Maps generated operation names to a root field + resolver invocation. */
const OPERATIONS: Record<string, OperationDef> = {
  Dashboard: { field: 'dashboard', resolve: (id) => queries.dashboard(id) },
  Projects: {
    field: 'projects',
    resolve: (id, v) => queries.projects(id, v.filter as never),
  },
  Project: {
    field: 'project',
    resolve: (id, v) => queries.project(id, v.id as string),
  },
  ProjectAreas: {
    field: 'projectAreas',
    resolve: (id) => queries.projectAreas(id),
  },
  Vendors: { field: 'vendors', resolve: (id) => queries.vendors(id) },
  Vendor: {
    field: 'vendor',
    resolve: (id, v) => queries.vendor(id, v.id as string),
  },
  ArtifactTemplates: {
    field: 'artifactTemplates',
    resolve: (id) => queries.artifactTemplates(id),
  },
  AllProposals: {
    field: 'allProposals',
    resolve: (id) => queries.allProposals(id),
  },
  ProjectProposals: {
    field: 'projectProposals',
    resolve: (id, v) => queries.projectProposals(id, v.projectId as string),
  },
  ProjectSolicitations: {
    field: 'projectSolicitations',
    resolve: (id, v) =>
      queries.projectSolicitations(id, v.projectId as string),
  },
  ProjectFinalists: {
    field: 'projectFinalists',
    resolve: (id, v) => queries.projectFinalists(id, v.projectId as string),
  },
  ProjectNotInterestedVendors: {
    field: 'projectNotInterestedVendors',
    resolve: (id, v) =>
      queries.projectNotInterestedVendors(id, v.projectId as string),
  },
  MyProposals: {
    field: 'myProposals',
    resolve: (id) => queries.myProposals(id),
  },
  AvailableProjects: {
    field: 'availableProjects',
    resolve: (id) => queries.availableProjects(id),
  },
  NotInterestedProjects: {
    field: 'notInterestedProjects',
    resolve: (id) => queries.notInterestedProjects(id),
  },
  MySolicitations: {
    field: 'mySolicitations',
    resolve: (id) => queries.mySolicitations(id),
  },
  SharedArtifacts: {
    field: 'sharedArtifacts',
    resolve: (id) => queries.sharedArtifacts(id),
  },
  CreateProject: {
    field: 'createProject',
    resolve: (id, v) => mutations.createProject(id, v.input as never),
  },
  UpdateProject: {
    field: 'updateProject',
    resolve: (id, v) =>
      mutations.updateProject(id, v.id as string, v.input as never),
  },
  ActivateProject: {
    field: 'activateProject',
    resolve: (id, v) => mutations.activateProject(id, v.id as string),
  },
  AddProjectArtifact: {
    field: 'addProjectArtifact',
    resolve: (id, v) =>
      mutations.addProjectArtifact(id, v.projectId as string, v.input as never),
  },
  RemoveProjectArtifact: {
    field: 'removeProjectArtifact',
    resolve: (id, v) => mutations.removeProjectArtifact(id, v.id as string),
  },
  SolicitVendor: {
    field: 'solicitVendor',
    resolve: (id, v) =>
      mutations.solicitVendor(id, v.projectId as string, v.vendorId as string),
  },
  SignUp: {
    field: 'signUp',
    resolve: (id, v) => mutations.signUp(id, v.projectId as string),
  },
  MarkNotInterested: {
    field: 'markNotInterested',
    resolve: (id, v) => mutations.markNotInterested(id, v.projectId as string),
  },
  ReconsiderProject: {
    field: 'reconsiderProject',
    resolve: (id, v) => mutations.reconsiderProject(id, v.projectId as string),
  },
  SubmitArtifact: {
    field: 'submitArtifact',
    resolve: (id, v) => mutations.submitArtifact(id, v.input as never),
  },
  SubmitProposal: {
    field: 'submitProposal',
    resolve: (id, v) => mutations.submitProposal(id, v.proposalId as string),
  },
  AddAdditionalItem: {
    field: 'addAdditionalItem',
    resolve: (id, v) =>
      mutations.addAdditionalItem(
        id,
        v.proposalId as string,
        v.name as string,
        v.note as string | null,
      ),
  },
  FilterProposal: {
    field: 'filterProposal',
    resolve: (id, v) =>
      mutations.filterProposal(id, v.proposalId as string, v.pass as boolean),
  },
  ApproveRound: {
    field: 'approveRound',
    resolve: (id, v) =>
      mutations.approveRound(id, v.proposalId as string, v.approve as boolean),
  },
  RankFinalist: {
    field: 'rankFinalist',
    resolve: (id, v) =>
      mutations.rankFinalist(
        id,
        v.projectId as string,
        v.vendorId as string,
        v.rank as number,
      ),
  },
  ApproveFinal: {
    field: 'approveFinal',
    resolve: (id, v) =>
      mutations.approveFinal(id, v.proposalId as string, v.approve as boolean),
  },
}

function operationNameFromQuery(query: string | undefined): string | null {
  if (!query) return null
  const match = query.match(/\b(?:query|mutation)\s+(\w+)/)
  return match ? match[1] : null
}

function graphqlError(message: string) {
  return HttpResponse.json({ errors: [{ message }] })
}

// Match any origin ending in /graphql so the same handler serves both the
// browser worker (relative path) and the Node test server (absolute URL).
const GRAPHQL_PATH = /\/graphql$/

export const handlers: RequestHandler[] = [
  http.post(GRAPHQL_PATH, async ({ request }) => {
    const body = (await request.json()) as GraphQLBody
    const operationName =
      body.operationName ?? operationNameFromQuery(body.query)

    if (!operationName || !(operationName in OPERATIONS)) {
      return graphqlError(`Unknown operation: ${operationName ?? 'unnamed'}`)
    }

    await simulateLatency()

    try {
      const identity = resolveIdentity(request.headers.get('x-demo-user'))
      const def = OPERATIONS[operationName]
      const result = def.resolve(identity, body.variables ?? {})
      return HttpResponse.json({ data: { [def.field]: result } })
    } catch (error) {
      if (error instanceof AccessError || error instanceof NotFoundError) {
        return graphqlError(error.message)
      }
      const message =
        error instanceof Error ? error.message : 'Unexpected resolver error'
      return graphqlError(message)
    }
  }),
]
