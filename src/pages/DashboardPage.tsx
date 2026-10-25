import { useRole } from '../roles/roleContext'
import { PagePlaceholder } from '../components/common/PagePlaceholder'

/**
 * Dashboard route (`/dashboard`). The same path serves both audiences; content
 * is role-scoped: procurement KPIs/charts (§4.2) vs. the vendor's own scoped
 * metrics (§4.8). Charts and derived metrics land in Phase 5.
 */
export function DashboardPage() {
  const { hasRole } = useRole()
  const isVendor = hasRole('Vendor')

  return isVendor ? (
    <PagePlaceholder
      title="Your dashboard"
      description="A snapshot of your activity: estimated totals, statuses, last active, and editable demographic info."
      note="Vendor KPIs and charts arrive in Phase 5 (Dashboards & charts)."
    />
  ) : (
    <PagePlaceholder
      title="Procurement dashboard"
      description="KPI strip (active projects, estimated value, active vendors, projects in legal) plus pie, list, timeline, and bar cards."
      note="KPIs and MUI X Charts arrive in Phase 5 (Dashboards & charts)."
    />
  )
}
