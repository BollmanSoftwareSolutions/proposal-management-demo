import { useRole } from '../roles/roleContext'
import { PagePlaceholder } from '../components/common/PagePlaceholder'

/**
 * Projects route (`/projects`). Role-scoped: procurement sees Active /
 * In-development / Create tabs (§4.3); vendors see available projects to sign up
 * for or decline (§4.9). Full behaviour lands in Phases 3 and 4.
 */
export function ProjectsPage() {
  const { hasRole } = useRole()
  const isVendor = hasRole('Vendor')

  return isVendor ? (
    <PagePlaceholder
      title="Projects"
      description="Projects you have not signed up for. Solicited projects are pinned to the top, followed by projects ordered by closing date. Sign up or mark not interested."
      note="Vendor project browsing and sign-up arrive in Phase 4 (Vendor features)."
    />
  ) : (
    <PagePlaceholder
      title="Projects"
      description="Active, In-development, and Create tabs for managing procurement projects."
      note="Project lists, creation, and detail tabs arrive in Phase 3 (Procurement features)."
    />
  )
}
