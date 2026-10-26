/** Extract a user-facing message from an unknown thrown/query error value. */
export function errorMessage(
  error: unknown,
  fallback = 'Something went wrong.',
): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string' && error) return error
  return fallback
}
