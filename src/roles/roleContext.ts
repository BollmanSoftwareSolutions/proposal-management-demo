import { createContext, useContext } from 'react'

/** Platform roles. A single user may hold both Lead and Officer. */
export type Role = 'Lead' | 'Officer' | 'Vendor'

/** A seeded identity the demo can act as, selected via the Role Switcher. */
export interface Identity {
  id: string
  name: string
  roles: Role[]
  org?: string
}

/**
 * Seed identities used by the Role Switcher. These are placeholders for Phase 0;
 * later phases will reconcile IDs with the in-memory store seed (Phase 1).
 */
export const SEED_IDENTITIES: Identity[] = [
  { id: 'user-lead', name: 'Dana Lead', roles: ['Lead', 'Officer'] },
  { id: 'user-officer', name: 'Omar Officer', roles: ['Officer'] },
  {
    id: 'user-vendor',
    name: 'Vera Vendor',
    roles: ['Vendor'],
    org: 'Acme Supplies',
  },
]

export interface RoleContextValue {
  identity: Identity
  identities: Identity[]
  setIdentityId: (id: string) => void
  hasRole: (role: Role) => boolean
}

export const RoleContext = createContext<RoleContextValue | undefined>(undefined)

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext)
  if (!ctx) {
    throw new Error('useRole must be used within a RoleProvider')
  }
  return ctx
}
