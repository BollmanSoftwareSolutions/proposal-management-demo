import { useParams } from '@tanstack/react-router'
import { PagePlaceholder } from '../components/common/PagePlaceholder'
import { useRole } from '../roles/roleContext'
import { SetupTab } from '../features/procurement/SetupTab'
import { ArtifactsTab } from '../features/procurement/ArtifactsTab'
import { VendorsTab } from '../features/procurement/VendorsTab'
import { FinalistsTab } from '../features/procurement/FinalistsTab'

const TAB_COPY: Record<string, { title: string; description: string }> = {
  setup: {
    title: 'Setup',
    description:
      'Vendor count and active segments, plus editable project fields that lock once the project is public.',
  },
  artifacts: {
    title: 'Artifacts',
    description:
      'Project artifacts with a sub-row per vendor submission. Artifacts can be added anytime; removed ones are soft-deleted and struck through.',
  },
  vendors: {
    title: 'Vendors',
    description:
      'All vendors with status (solicited / signed up / declined), a sub-row per artifact submission, and a sub-row per additional uploaded item.',
  },
  finalists: {
    title: 'Finalists',
    description:
      'Ranked list of selected vendors with status (sent to legal / waiting / declined).',
  },
}

/**
 * Nested tab content for the project detail page. Procurement (Lead/Officer)
 * sees the Phase 3 feature content; the vendor view arrives in Phase 4.
 */
export function ProjectDetailTab() {
  const { projectId, tab } = useParams({ from: '/projects/$projectId/$tab' })
  const { hasRole } = useRole()

  if (!hasRole('Vendor')) {
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
          <PagePlaceholder
            title="Not found"
            description="Unknown project tab."
          />
        )
    }
  }

  const copy = TAB_COPY[tab] ?? {
    title: 'Not found',
    description: 'Unknown project tab.',
  }
  return (
    <PagePlaceholder
      title={copy.title}
      description={copy.description}
      note="The vendor view of this tab arrives in Phase 4."
    />
  )
}
