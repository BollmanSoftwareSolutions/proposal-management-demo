/** Procurement staff who can be assigned as a project's lead (seed identities). */
export const LEAD_OPTIONS = [
  { id: 'user-lead', name: 'Dana Lead' },
  { id: 'user-officer', name: 'Omar Officer' },
  { id: 'user-officer-2', name: 'Priya Officer' },
] as const

export function leadName(id: string | null | undefined): string {
  return LEAD_OPTIONS.find((l) => l.id === id)?.name ?? id ?? '—'
}
