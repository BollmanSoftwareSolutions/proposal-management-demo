import { useParams } from '@tanstack/react-router'
import { PagePlaceholder } from '../components/common/PagePlaceholder'
import { useRole } from '../roles/roleContext'
import { SetupTab } from '../features/procurement/SetupTab'
import { ArtifactsTab } from '../features/procurement/ArtifactsTab'
import { VendorsTab } from '../features/procurement/VendorsTab'
import { FinalistsTab } from '../features/procurement/FinalistsTab'
import { VendorOverviewTab } from '../features/vendor/VendorOverviewTab'
import { VendorArtifactsTab } from '../features/vendor/VendorArtifactsTab'
import { VendorItemsTab } from '../features/vendor/VendorItemsTab'

/**
 * Nested tab content for the project detail page. Procurement (Lead/Officer)
 * sees the Phase 3 feature content; vendors see the Phase 4 proposal view.
 */
export function ProjectDetailTab() {
  const { projectId, tab } = useParams({ from: '/projects/$projectId/$tab' })
  const { hasRole } = useRole()

  if (hasRole('Vendor')) {
    switch (tab) {
      case 'setup':
        return <VendorOverviewTab projectId={projectId} />
      case 'artifacts':
        return <VendorArtifactsTab projectId={projectId} />
      case 'items':
        return <VendorItemsTab projectId={projectId} />
      default:
        return (
          <PagePlaceholder
            title="Not found"
            description="Unknown project tab."
          />
        )
    }
  }

  switch (tab) {
    case 'setup':
      return <SetupTab projectId={projectId} />
    case 'artifacts':
      return <ArtifactsTab projectId={projectId} />
    case 'vendors':
      return <VendorsTab projectId={projectId} />
    case 'finalists':
      return <FinalistsTab projectId={projectId} />
    default:
      return (
        <PagePlaceholder title="Not found" description="Unknown project tab." />
      )
  }
}
