import { useRole } from '../roles/roleContext'
import { PagePlaceholder } from '../components/common/PagePlaceholder'
import { ProcurementProjectsPage } from '../features/procurement/ProcurementProjectsPage'

/**
 * Projects route (`/projects`). Role-scoped: procurement sees Active /
 * In-development / Create tabs (§4.3); vendors see available projects to sign up
 * for or decline (§4.9). Vendor behaviour lands in Phase 4.
 */
export function ProjectsPage() {
  const { hasRole } = useRole()
  const isVendor = hasRole('Vendor')

  if (!isVendor) {
    return <ProcurementProjectsPage />
  }

  return (
    <PagePlaceholder
      title="Projects"
      description="Projects you have not signed up for. Solicited projects are pinned to the top, followed by projects ordered by closing date. Sign up or mark not interested."
      note="Vendor project browsing and sign-up arrive in Phase 4 (Vendor features)."
    />
  )
}
