import type {
  ArtifactSubmission,
  ArtifactTemplate,
  DemoStore,
  Finalist,
  NotInterested,
  Project,
  ProjectArea,
  ProjectArtifact,
  ProjectSegment,
  Proposal,
  ProposalStatus,
  Solicitation,
  User,
} from './types'

/** Deterministic PRNG (mulberry32) so the dataset is identical between loads. */
function createRng(seed: number) {
  let a = seed
  return function next(): number {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const DAY_MS = 86_400_000

/** Base date: midnight today, so "next 60 days" windows track the current date. */
function baseDate(): number {
  const now = new Date()
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
}

function isoFromOffset(base: number, offsetDays: number): string {
  return new Date(base + offsetDays * DAY_MS).toISOString()
}

const FORM_SCHEMAS: Record<string, unknown> = {
  contact: {
    title: 'Contact Information',
    pages: [
      {
        name: 'page1',
        elements: [
          {
            type: 'text',
            name: 'contactName',
            title: 'Primary contact name',
            isRequired: true,
          },
          {
            type: 'text',
            name: 'contactEmail',
            title: 'Contact email',
            isRequired: true,
          },
          {
            type: 'dropdown',
            name: 'preferredContact',
            title: 'Preferred contact method',
            isRequired: false,
            choices: ['Email', 'Phone', 'Mail'],
          },
          {
            type: 'radiogroup',
            name: 'authorized',
            title: 'Authorized to bind contracts?',
            isRequired: true,
            choices: ['Yes', 'No'],
          },
        ],
      },
    ],
  },
  references: {
    title: 'References',
    pages: [
      {
        name: 'page1',
        elements: [
          {
            type: 'text',
            name: 'referenceOne',
            title: 'Reference 1 (name & contact)',
            isRequired: true,
          },
          {
            type: 'text',
            name: 'referenceTwo',
            title: 'Reference 2 (name & contact)',
            isRequired: false,
          },
          {
            type: 'checkbox',
            name: 'sectors',
            title: 'Sectors served',
            isRequired: false,
            choices: ['Public', 'Private', 'Education', 'Healthcare'],
          },
        ],
      },
    ],
  },
  pricing: {
    title: 'Pricing Summary',
    pages: [
      {
        name: 'page1',
        elements: [
          {
            type: 'text',
            name: 'baseBid',
            title: 'Base bid (USD)',
            isRequired: true,
          },
          {
            type: 'radiogroup',
            name: 'pricingModel',
            title: 'Pricing model',
            isRequired: true,
            choices: ['Fixed', 'Time & Materials', 'Hybrid'],
          },
          {
            type: 'dropdown',
            name: 'warranty',
            title: 'Warranty period',
            isRequired: false,
            choices: ['1 year', '2 years', '3 years'],
          },
        ],
      },
    ],
  },
  capability: {
    title: 'Capability Statement',
    pages: [
      {
        name: 'page1',
        elements: [
          {
            type: 'text',
            name: 'summary',
            title: 'Capability summary',
            isRequired: true,
          },
          {
            type: 'checkbox',
            name: 'certifications',
            title: 'Certifications held',
            isRequired: false,
            choices: ['ISO 9001', 'SOC 2', 'OSHA', 'None'],
          },
        ],
      },
    ],
  },
}

const TEMPLATE_DEFS: Array<Omit<ArtifactTemplate, 'id'>> = [
  {
    title: 'Contact Form',
    description: 'Primary contact and authorization details.',
    type: 'Form',
    shared: true,
    surveyJsSchema: FORM_SCHEMAS.contact,
  },
  {
    title: 'References',
    description: 'Past-performance references.',
    type: 'Form',
    shared: true,
    surveyJsSchema: FORM_SCHEMAS.references,
  },
  {
    title: 'Pricing Summary',
    description: 'Base bid and pricing model.',
    type: 'Form',
    shared: false,
    surveyJsSchema: FORM_SCHEMAS.pricing,
  },
  {
    title: 'Capability Statement',
    description: 'Summary of capabilities and certifications.',
    type: 'Form',
    shared: false,
    surveyJsSchema: FORM_SCHEMAS.capability,
  },
  {
    title: 'Liability Insurance',
    description: 'Proof of liability insurance coverage.',
    type: 'Document',
    shared: true,
  },
  {
    title: 'W-9',
    description: 'Completed IRS Form W-9.',
    type: 'Document',
    shared: true,
  },
  {
    title: 'Security Certification',
    description: 'Relevant security/compliance certification.',
    type: 'Document',
    shared: false,
  },
]

const AREA_NAMES = [
  'Facilities Maintenance',
  'Cafeteria Services',
  'Staffing',
  'Entertainment',
  'IT Services',
  'Grounds & Landscaping',
]

const VENDOR_DEFS: Array<{
  id: string
  name: string
  companyName: string
  jurisdiction: string
}> = [
  { id: 'user-vendor', name: 'Vera Vendor', companyName: 'Acme Supplies', jurisdiction: 'CA' },
  { id: 'vendor-2', name: 'Marcus Reed', companyName: 'Reed Facilities', jurisdiction: 'TX' },
  { id: 'vendor-3', name: 'Lin Chen', companyName: 'Evergreen Catering', jurisdiction: 'WA' },
  { id: 'vendor-4', name: 'Sofia Ramirez', companyName: 'BrightStaff', jurisdiction: 'NY' },
  { id: 'vendor-5', name: 'Noah Patel', companyName: 'Patel Events', jurisdiction: 'IL' },
  { id: 'vendor-6', name: 'Grace Kim', companyName: 'NetSecure IT', jurisdiction: 'MA' },
  { id: 'vendor-7', name: 'Diego Alvarez', companyName: 'GreenScape', jurisdiction: 'FL' },
  { id: 'vendor-8', name: 'Hannah Brooks', companyName: 'Summit Maintenance', jurisdiction: 'CO' },
  { id: 'vendor-9', name: 'Owen Clarke', companyName: 'Clarke Cafe Co', jurisdiction: 'OR' },
  { id: 'vendor-10', name: 'Priya Nair', companyName: 'TalentBridge', jurisdiction: 'NJ' },
  { id: 'vendor-11', name: 'Ethan Wright', companyName: 'Showtime Pro', jurisdiction: 'NV' },
  { id: 'vendor-12', name: 'Mia Lopez', companyName: 'CloudGuard', jurisdiction: 'AZ' },
]

const PROJECT_NAME_POOL = [
  'HVAC Overhaul',
  'Daily Cafeteria Operations',
  'Temporary Admin Staffing',
  'Annual Gala Production',
  'Network Infrastructure Refresh',
  'Campus Landscaping',
  'Roof Replacement',
  'Vending & Concessions',
  'Seasonal Grounds Crew',
  'Help Desk Services',
  'Elevator Maintenance',
  'Catering for Board Meetings',
  'Security System Upgrade',
  'Event A/V Services',
  'Janitorial Services',
]

const PROJECT_STATUS_PLAN: Array<Project['status']> = [
  'Active',
  'Active',
  'Active',
  'Active',
  'Active',
  'Active',
  'Draft',
  'Draft',
  'Draft',
  'Draft',
  'InLegal',
  'InLegal',
  'Closed',
  'Closed',
  'Closed',
]

const PROPOSAL_STATUS_CYCLE: ProposalStatus[] = [
  'SignedUp',
  'Submitted',
  'Filtered',
  'FollowUp',
  'Declined',
  'Finalized',
  'Won',
]

export function seed(): DemoStore {
  const rng = createRng(0x5eed1234)
  const base = baseDate()
  const pick = <T>(arr: T[]): T => arr[Math.floor(rng() * arr.length)]
  const randInt = (min: number, max: number): number =>
    min + Math.floor(rng() * (max - min + 1))

  // --- Users ---------------------------------------------------------------
  const procurement: User[] = [
    {
      id: 'user-lead',
      name: 'Dana Lead',
      email: 'dana.lead@bss.demo',
      phone: '555-0100',
      roles: ['Lead', 'Officer'],
      lastActive: isoFromOffset(base, -1),
    },
    {
      id: 'user-officer',
      name: 'Omar Officer',
      email: 'omar.officer@bss.demo',
      phone: '555-0101',
      roles: ['Officer'],
      lastActive: isoFromOffset(base, -2),
    },
    {
      id: 'user-officer-2',
      name: 'Priya Officer',
      email: 'priya.officer@bss.demo',
      phone: '555-0102',
      roles: ['Officer'],
      lastActive: isoFromOffset(base, -3),
    },
  ]

  const vendors: User[] = VENDOR_DEFS.map((v, i) => ({
    id: v.id,
    name: v.name,
    email: `${v.id}@vendor.demo`,
    phone: `555-02${String(i).padStart(2, '0')}`,
    roles: ['Vendor'],
    companyName: v.companyName,
    jurisdiction: v.jurisdiction,
    lastActive: isoFromOffset(base, -randInt(0, 45)),
  }))

  const users = [...procurement, ...vendors]
  const officerIds = ['user-lead', 'user-officer', 'user-officer-2']
  const leadId = 'user-lead'

  // --- Project areas -------------------------------------------------------
  const projectAreas: ProjectArea[] = AREA_NAMES.map((name, i) => ({
    id: `area-${i + 1}`,
    name,
  }))

  // --- Artifact templates --------------------------------------------------
  const artifactTemplates: ArtifactTemplate[] = TEMPLATE_DEFS.map((t, i) => ({
    id: `tmpl-${i + 1}`,
    ...t,
  }))

  const segmentTitles = ['Solicitation', 'Submissions', 'Filtering', 'Final Selection']

  // --- Projects (with segments + artifacts) --------------------------------
  const projects: Project[] = PROJECT_STATUS_PLAN.map((status, i) => {
    const id = `project-${i + 1}`
    const isPublic = status !== 'Draft'
    // Spread close dates across the next ~6 months for the value-closing chart.
    const closeOffset = status === 'Closed' ? -randInt(10, 90) : randInt(10, 170)
    const openOffset = closeOffset - randInt(20, 60)

    const segments: ProjectSegment[] = segmentTitles.map((title, s) => {
      // Overlapping windows clustered around "now" for the 60-day timeline.
      const segOpen = randInt(-20, 40) + s * 5
      const segClose = segOpen + randInt(10, 25)
      return {
        id: `${id}-seg-${s + 1}`,
        projectId: id,
        title,
        order: s + 1,
        openDate: isoFromOffset(base, segOpen),
        closeDate: isoFromOffset(base, segClose),
      }
    })

    const templateCount = randInt(2, 4)
    const chosen = [...artifactTemplates]
      .sort(() => rng() - 0.5)
      .slice(0, templateCount)
    const artifacts: ProjectArtifact[] = chosen.map((tmpl, a) => ({
      id: `${id}-art-${a + 1}`,
      projectId: id,
      templateId: tmpl.id,
      title: tmpl.title,
      description: tmpl.description,
      type: tmpl.type,
      surveyJsSchema: tmpl.surveyJsSchema,
      // Occasionally include a soft-deleted artifact to exercise the UI.
      isActive: !(a === chosen.length - 1 && rng() < 0.25),
    }))

    return {
      id,
      projectAreaId: pick(projectAreas).id,
      name: PROJECT_NAME_POOL[i] ?? `Project ${i + 1}`,
      estimatedValue: randInt(5, 200) * 10_000,
      outline: `Outline for ${PROJECT_NAME_POOL[i] ?? id}.`,
      scope: `Scope of work covering deliverables for ${
        PROJECT_NAME_POOL[i] ?? id
      }.`,
      openDate: isoFromOffset(base, openOffset),
      closeDate: isoFromOffset(base, closeOffset),
      assignedLeadId: leadId,
      officerId: officerIds[i % officerIds.length],
      status,
      isPublic,
      segments,
      artifacts,
    }
  })

  const publicProjects = projects.filter((p) => p.isPublic)

  // --- Proposals (spread across every status) ------------------------------
  const proposals: Proposal[] = []
  const solicitations: Solicitation[] = []
  const finalists: Finalist[] = []
  const notInterested: NotInterested[] = []
  let proposalSeq = 0
  let submissionSeq = 0
  let solicitationSeq = 0
  let statusCursor = 0

  for (const project of publicProjects) {
    const vendorCount = randInt(3, 5)
    const projectVendors = [...vendors]
      .sort(() => rng() - 0.5)
      .slice(0, vendorCount)

    projectVendors.forEach((vendor, idx) => {
      const status = PROPOSAL_STATUS_CYCLE[statusCursor % PROPOSAL_STATUS_CYCLE.length]
      statusCursor += 1
      const proposalId = `proposal-${++proposalSeq}`

      const submissions: ArtifactSubmission[] = []
      const hasSubmissions = status !== 'SignedUp' && status !== 'Declined'
      if (hasSubmissions) {
        for (const artifact of project.artifacts.filter((a) => a.isActive)) {
          const submission: ArtifactSubmission = {
            id: `submission-${++submissionSeq}`,
            proposalId,
            projectArtifactId: artifact.id,
            type: artifact.type,
            submittedAt: isoFromOffset(base, -randInt(1, 20)),
          }
          if (artifact.type === 'Form') {
            submission.surveyJsResponses = {
              contactName: vendor.name,
              contactEmail: vendor.email,
              authorized: 'Yes',
            }
          } else {
            submission.documentName = `${artifact.title.replace(/\s+/g, '_')}.pdf`
          }
          submissions.push(submission)
        }
      }

      proposals.push({
        id: proposalId,
        projectId: project.id,
        vendorId: vendor.id,
        status,
        signedUpAt: isoFromOffset(base, -randInt(5, 40)),
        submissions,
        additionalItems:
          idx === 0
            ? [
                {
                  id: `additional-${proposalId}`,
                  proposalId,
                  name: 'Capability deck',
                  note: 'Additional supporting material.',
                },
              ]
            : [],
      })

      // Solicit a subset of vendors (pinned in the vendor view).
      if (rng() < 0.4) {
        solicitations.push({
          id: `solicitation-${++solicitationSeq}`,
          projectId: project.id,
          vendorId: vendor.id,
          invitedAt: isoFromOffset(base, -randInt(10, 50)),
        })
      }
    })

    // Finalists for projects in/near legal handoff.
    if (project.status === 'InLegal' || project.status === 'Closed') {
      const finalistVendors = projectVendors.slice(0, randInt(2, 3))
      finalistVendors.forEach((vendor, r) => {
        finalists.push({
          id: `finalist-${project.id}-${vendor.id}`,
          projectId: project.id,
          vendorId: vendor.id,
          rank: r + 1,
          status:
            project.status === 'InLegal' && r === 0
              ? 'SentToLegal'
              : r === finalistVendors.length - 1
                ? 'Declined'
                : 'Waiting',
        })
      })
    }
  }

  // Guarantee the demo vendor has at least one available (public, un-signed,
  // not-declined) project and one solicited project.
  const demoVendorId = 'user-vendor'
  const demoHasProposal = (pid: string) =>
    proposals.some((p) => p.vendorId === demoVendorId && p.projectId === pid)

  const activePublic = publicProjects.filter((p) => p.status === 'Active')
  const availableForDemo = activePublic.find((p) => !demoHasProposal(p.id))
  if (availableForDemo) {
    // Ensure it is genuinely available: no proposal, no not-interested record.
    notInterested.filter((n) => n.vendorId === demoVendorId)
  }

  // Solicit the demo vendor on an active project they have not signed up for.
  const toSolicit = activePublic.find(
    (p) => !demoHasProposal(p.id) && p.id !== availableForDemo?.id,
  )
  if (toSolicit) {
    solicitations.push({
      id: `solicitation-${++solicitationSeq}`,
      projectId: toSolicit.id,
      vendorId: demoVendorId,
      invitedAt: isoFromOffset(base, -3),
    })
  }

  // Record one not-interested project for the demo vendor.
  const notInterestedProject = activePublic.find(
    (p) =>
      !demoHasProposal(p.id) &&
      p.id !== availableForDemo?.id &&
      p.id !== toSolicit?.id,
  )
  if (notInterestedProject) {
    notInterested.push({
      vendorId: demoVendorId,
      projectId: notInterestedProject.id,
    })
  }

  return {
    users,
    projectAreas,
    projects,
    artifactTemplates,
    solicitations,
    proposals,
    finalists,
    notInterested,
    sharedArtifactResponses: [],
  }
}
