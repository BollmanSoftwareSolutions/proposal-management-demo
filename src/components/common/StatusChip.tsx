import Chip, { type ChipProps } from '@mui/material/Chip'
import type {
  FinalistStatus,
  ProjectStatus,
  ProposalStatus,
} from '../../graphql/generated/graphql'

type ChipColor = ChipProps['color']

const PROJECT_STATUS: Record<
  ProjectStatus,
  { label: string; color: ChipColor }
> = {
  Draft: { label: 'In development', color: 'default' },
  Active: { label: 'Active', color: 'success' },
  InLegal: { label: 'In legal', color: 'info' },
  Closed: { label: 'Closed', color: 'default' },
}

const PROPOSAL_STATUS: Record<
  ProposalStatus,
  { label: string; color: ChipColor }
> = {
  SignedUp: { label: 'Signed up', color: 'default' },
  Submitted: { label: 'Submitted', color: 'info' },
  Filtered: { label: 'Filtered', color: 'primary' },
  FollowUp: { label: 'Follow-up', color: 'secondary' },
  Finalized: { label: 'Finalized', color: 'warning' },
  Won: { label: 'Won', color: 'success' },
  Declined: { label: 'Declined', color: 'error' },
}

const FINALIST_STATUS: Record<
  FinalistStatus,
  { label: string; color: ChipColor }
> = {
  Waiting: { label: 'Waiting', color: 'default' },
  SentToLegal: { label: 'Sent to legal', color: 'success' },
  Declined: { label: 'Declined', color: 'error' },
}

export function ProjectStatusChip({ status }: { status: ProjectStatus }) {
  const { label, color } = PROJECT_STATUS[status]
  return <Chip size="small" label={label} color={color} variant="outlined" />
}

export function ProposalStatusChip({ status }: { status: ProposalStatus }) {
  const { label, color } = PROPOSAL_STATUS[status]
  return <Chip size="small" label={label} color={color} variant="outlined" />
}

export function FinalistStatusChip({ status }: { status: FinalistStatus }) {
  const { label, color } = FINALIST_STATUS[status]
  return <Chip size="small" label={label} color={color} variant="outlined" />
}

/** Vendor participation on a project (procurement Vendors tab). */
export function VendorParticipationChip({
  status,
}: {
  status: 'Solicited' | 'SignedUp' | 'Declined'
}) {
  const map = {
    Solicited: { label: 'Solicited', color: 'info' as ChipColor },
    SignedUp: { label: 'Signed up', color: 'success' as ChipColor },
    Declined: { label: 'Declined', color: 'error' as ChipColor },
  }
  const { label, color } = map[status]
  return <Chip size="small" label={label} color={color} variant="outlined" />
}
