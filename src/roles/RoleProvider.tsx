import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
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
  const queryClient = useQueryClient()
  const [identityId, setIdentityId] = useState<string>(
    initialIdentityId ?? SEED_IDENTITIES[0].id,
  )

  // Keep the fetcher's identity header in sync during render so queries mounted
  // by children read the current identity before their fetch effects run
  // (child effects fire before this provider's effects).
  useMemo(() => setCurrentUserId(identityId), [identityId])

  // When the identity changes, drop cached data so every query refetches under
  // the new identity's access rules rather than showing the prior identity's
  // results (or a stale access error).
  const previousIdentityId = useRef(identityId)
  useEffect(() => {
    if (previousIdentityId.current !== identityId) {
      previousIdentityId.current = identityId
      void queryClient.resetQueries()
    }
  }, [identityId, queryClient])

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
