import type { Role } from './roleContext'

/** A top-level navigation tab shown in the header. */
export interface NavItem {
  label: string
  to: string
}

/** Tabs for procurement identities (Lead / Officer share the same tabs). */
export const PROCUREMENT_NAV: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Projects', to: '/projects' },
  { label: 'Vendors', to: '/vendors' },
  { label: 'Artifacts', to: '/artifacts' },
]

/** Tabs for vendor identities. */
export const VENDOR_NAV: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Projects', to: '/projects' },
  { label: 'Proposals', to: '/proposals' },
  { label: 'Not Interested', to: '/not-interested' },
  { label: 'Shared Artifacts', to: '/shared-artifacts' },
]

/**
 * Nav tabs for the active identity. Vendors get the vendor tab set; everyone
 * else (Lead and/or Officer) gets the procurement tab set.
 */
export function navForRoles(roles: Role[]): NavItem[] {
  return roles.includes('Vendor') ? VENDOR_NAV : PROCUREMENT_NAV
}
