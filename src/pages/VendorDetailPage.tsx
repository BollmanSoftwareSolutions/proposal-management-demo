import { useParams } from '@tanstack/react-router'
import { PagePlaceholder } from '../components/common/PagePlaceholder'

/** Vendor detail (procurement) — §4.6. */
export function VendorDetailPage() {
  const { vendorId } = useParams({ from: '/vendors/$vendorId' })
  return (
    <PagePlaceholder
      title={`Vendor ${vendorId}`}
      description="Vendor info, graphs of estimated totals, statuses, and last active, plus a list of all projects the vendor signed up for."
      note="Vendor detail arrives in Phase 3 (Procurement features)."
    />
  )
}
