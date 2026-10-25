/**
 * Holds the simulated current identity for the GraphQL fetcher. The RoleProvider
 * keeps this in sync with the Role context so every request carries an
 * `x-demo-user` header the mock resolvers use for access control.
 */
let currentUserId: string | null = null

export function setCurrentUserId(id: string | null): void {
  currentUserId = id
}

export function getCurrentUserId(): string | null {
  return currentUserId
}

let endpoint = '/graphql'

export function setGraphQLEndpoint(url: string): void {
  endpoint = url
}

export function getGraphQLEndpoint(): string {
  return endpoint
}
