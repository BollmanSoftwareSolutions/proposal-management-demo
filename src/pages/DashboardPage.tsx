import { useRole } from '../roles/roleContext'
import { ProcurementDashboard } from '../features/dashboard/ProcurementDashboard'
import { VendorDashboard } from '../features/dashboard/VendorDashboard'

/**
 * Dashboard route (`/dashboard`). The same path serves both audiences; content
 * is role-scoped: procurement KPIs/charts (§4.2) vs. the vendor's own scoped
 * metrics (§4.8).
 */
export function DashboardPage() {
  const { hasRole } = useRole()
  return hasRole('Vendor') ? <VendorDashboard /> : <ProcurementDashboard />
}
