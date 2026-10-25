import { getStore } from '../store/store'
import type { Role, User } from '../store/types'

/** Error that handlers translate into a GraphQL `errors` entry. */
export class AccessError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AccessError'
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

let latencyEnabled = true

/** Disable simulated latency (used in tests for fast, deterministic runs). */
export function setLatencyEnabled(enabled: boolean): void {
  latencyEnabled = enabled
}

/** Simulated network latency so TanStack Query loading states are visible. */
export async function simulateLatency(): Promise<void> {
  if (!latencyEnabled) return
  const ms = 150 + Math.floor(Math.random() * 350)
  await new Promise((resolve) => setTimeout(resolve, ms))
}

/** Resolve the acting identity from the `x-demo-user` header value. */
export function resolveIdentity(userId: string | null): User {
  if (!userId) {
    throw new AccessError('No identity provided')
  }
  const user = getStore().users.find((u) => u.id === userId)
  if (!user) {
    throw new AccessError(`Unknown identity: ${userId}`)
  }
  return user
}

export const hasRole = (user: User, role: Role): boolean =>
  user.roles.includes(role)

/** Lead or Officer (procurement staff). */
export function requireProcurement(user: User): void {
  if (!hasRole(user, 'Lead') && !hasRole(user, 'Officer')) {
    throw new AccessError('Requires procurement (Lead or Officer) role')
  }
}

/** Officer rights (Lead inherits Officer rights). */
export function requireOfficer(user: User): void {
  if (!hasRole(user, 'Officer') && !hasRole(user, 'Lead')) {
    throw new AccessError('Requires Officer role')
  }
}

export function requireLead(user: User): void {
  if (!hasRole(user, 'Lead')) {
    throw new AccessError('Requires Lead role')
  }
}

export function requireVendor(user: User): void {
  if (!hasRole(user, 'Vendor')) {
    throw new AccessError('Requires Vendor role')
  }
}
