import { useRole } from '../roles/roleContext'
import { ProcurementProjectsPage } from '../features/procurement/ProcurementProjectsPage'
import { VendorProjectsPage } from '../features/vendor/VendorProjectsPage'

/**
 * Projects route (`/projects`). Role-scoped: procurement sees Active /
 * In-development / Create tabs (§4.3); vendors see available projects to sign up
 * for or decline (§4.9).
 */
export function ProjectsPage() {
  const { hasRole } = useRole()

  if (hasRole('Vendor')) {
    return <VendorProjectsPage />
  }

  return <ProcurementProjectsPage />
}
