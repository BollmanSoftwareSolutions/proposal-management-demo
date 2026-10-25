import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { setCurrentUserId } from '../graphql/identity'
import {
  RoleContext,
  SEED_IDENTITIES,
  type Identity,
  type Role,
  type RoleContextValue,
} from './roleContext'

export function RoleProvider({
  children,
  initialIdentityId,
}: {
  children: ReactNode
  initialIdentityId?: string
}) {
  const [identityId, setIdentityId] = useState<string>(
    initialIdentityId ?? SEED_IDENTITIES[0].id,
  )

  useEffect(() => {
    setCurrentUserId(identityId)
  }, [identityId])

  const value = useMemo<RoleContextValue>(() => {
    const identity: Identity =
      SEED_IDENTITIES.find((i) => i.id === identityId) ?? SEED_IDENTITIES[0]
    return {
      identity,
      identities: SEED_IDENTITIES,
      setIdentityId,
      hasRole: (role: Role) => identity.roles.includes(role),
    }
  }, [identityId])

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}
