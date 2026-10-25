import { useParams } from '@tanstack/react-router'
import { PagePlaceholder } from '../components/common/PagePlaceholder'

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
 * Nested tab content for the project detail page. Phase 2 renders placeholders;
 * the procurement behaviour arrives in Phase 3 and the vendor behaviour in
 * Phase 4.
 */
export function ProjectDetailTab() {
  const { tab } = useParams({ from: '/projects/$projectId/$tab' })
  const copy = TAB_COPY[tab] ?? {
    title: 'Not found',
    description: 'Unknown project tab.',
  }
  return (
    <PagePlaceholder
      title={copy.title}
      description={copy.description}
      note="This tab is populated in Phases 3 and 4."
    />
  )
}
