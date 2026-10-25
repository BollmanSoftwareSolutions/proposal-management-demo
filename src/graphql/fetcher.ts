import { getCurrentUserId, getGraphQLEndpoint } from './identity'

interface GraphQLResponse<TData> {
  data?: TData
  errors?: Array<{ message: string }>
}

/**
 * Shared GraphQL fetcher bound to the generated hooks (see codegen config).
 * Returns a thunk so TanStack Query can call it as its `queryFn`/`mutationFn`.
 * Swapping in a real backend only requires changing the endpoint (and auth).
 */
export function fetchGraphQL<TData, TVariables>(
  query: string | { toString(): string },
  variables?: TVariables,
  headers?: HeadersInit,
): () => Promise<TData> {
  return async () => {
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    const userId = getCurrentUserId()
    if (userId) {
      requestHeaders['x-demo-user'] = userId
    }
    const mergedHeaders = headers
      ? { ...requestHeaders, ...(headers as Record<string, string>) }
      : requestHeaders

    const response = await fetch(getGraphQLEndpoint(), {
      method: 'POST',
      headers: mergedHeaders,
      body: JSON.stringify({ query: query.toString(), variables }),
    })

    const result = (await response.json()) as GraphQLResponse<TData>

    if (result.errors && result.errors.length > 0) {
      throw new Error(result.errors.map((e) => e.message).join('; '))
    }
    if (!result.data) {
      throw new Error('GraphQL response contained no data')
    }
    return result.data
  }
}
