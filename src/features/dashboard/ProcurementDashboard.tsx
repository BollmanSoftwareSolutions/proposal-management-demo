import { useMemo } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { BarChart } from '@mui/x-charts/BarChart'
import { PieChart } from '@mui/x-charts/PieChart'
import { useDashboardQuery } from '../../graphql/generated/graphql'
import { QueryState } from '../../components/common/QueryState'
import { chartPalette, palette } from '../../app/theme'
import { formatCurrency } from '../../lib/format'
import { DashboardCard } from './DashboardCard'
import { KpiStrip } from './KpiStrip'
import { MetricList } from './MetricList'
import { SegmentTimeline } from './SegmentTimeline'

const chartColors = [...chartPalette]

/** Compact USD for chart axes/KPIs, e.g. `$1.2M`, `$340K`. */
function formatCompact(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`
  return `$${value}`
}

/** `2026-01` → `Jan 2026`. */
function formatMonth(key: string): string {
  const [year, month] = key.split('-').map(Number)
  if (!year || !month) return key
  const date = new Date(Date.UTC(year, month - 1, 1))
  return date.toLocaleString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/**
 * Procurement dashboard (design-docs/04-ui-ux.md §4.2): a full-width KPI strip
 * over a responsive grid of six metric cards driven by derived aggregates
 * (design-docs/02-data-model.md §5).
 */
export function ProcurementDashboard() {
  const { data, isLoading, error } = useDashboardQuery()
  const metrics = data?.dashboard

  const segmentPie = useMemo(
    () =>
      (metrics?.projectsByActiveSegment ?? []).map((segment, index) => ({
        id: segment.segmentTitle,
        value: segment.count,
        label: segment.segmentTitle,
        color: chartColors[index % chartColors.length],
      })),
    [metrics],
  )

  const closingMonths = metrics?.estimatedValueClosingByMonth ?? []

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Procurement dashboard
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        A live snapshot of the active pipeline, vendor activity, and upcoming
        milestones.
      </Typography>

      <QueryState isLoading={isLoading} error={error} isEmpty={!metrics}>
        {metrics && (
          <Stack spacing={3}>
            <KpiStrip
              items={[
                {
                  label: 'Active projects',
                  value: String(metrics.activeProjects),
                },
                {
                  label: 'Active est. value',
                  value: formatCurrency(metrics.activeEstimatedValue),
                },
                {
                  label: 'Active vendors',
                  value: String(metrics.activeVendors),
                },
                {
                  label: 'Projects in legal',
                  value: String(metrics.projectsInLegal),
                },
              ]}
            />

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: '1fr 1fr',
                  md: 'repeat(3, 1fr)',
                },
              }}
            >
              <DashboardCard
                title="Projects by active segment"
                subheader="Share of active projects by current stage"
              >
                {segmentPie.length > 0 ? (
                  <PieChart
                    height={240}
                    series={[
                      {
                        data: segmentPie,
                        innerRadius: 48,
                        paddingAngle: 2,
                        cornerRadius: 4,
                        highlightScope: { fade: 'global', highlight: 'item' },
                      },
                    ]}
                  />
                ) : (
                  <EmptyCard />
                )}
              </DashboardCard>

              <DashboardCard
                title="Top vendors by project count"
                subheader="Most-engaged vendors across all projects"
              >
                {metrics.topVendorsByProjectCount.length > 0 ? (
                  <MetricList
                    items={metrics.topVendorsByProjectCount.map((vendor) => ({
                      id: vendor.vendorId,
                      label: vendor.vendorName,
                      value: vendor.value,
                      display: `${vendor.value} project${
                        vendor.value === 1 ? '' : 's'
                      }`,
                    }))}
                  />
                ) : (
                  <EmptyCard />
                )}
              </DashboardCard>

              <DashboardCard
                title="Upcoming segments"
                subheader="Open / close dates in the next 60 days"
              >
                {metrics.upcomingSegmentEvents.length > 0 ? (
                  <SegmentTimeline events={metrics.upcomingSegmentEvents} />
                ) : (
                  <EmptyCard message="No segment milestones in the next 60 days." />
                )}
              </DashboardCard>

              <DashboardCard
                title="Estimated value closing"
                subheader="Projects by close month"
              >
                {closingMonths.length > 0 ? (
                  <BarChart
                    height={260}
                    xAxis={[
                      {
                        scaleType: 'band',
                        data: closingMonths.map((m) => formatMonth(m.month)),
                      },
                    ]}
                    yAxis={[{ valueFormatter: (v: number) => formatCompact(v) }]}
                    series={[
                      {
                        data: closingMonths.map((m) => m.value),
                        color: palette.primary,
                        valueFormatter: (v) => formatCurrency(v ?? 0),
                      },
                    ]}
                    margin={{ left: 12 }}
                  />
                ) : (
                  <EmptyCard />
                )}
              </DashboardCard>

              <DashboardCard
                title="Top vendors by est. total"
                subheader="Won & finalized project value"
              >
                {metrics.topVendorsByEstimatedTotal.length > 0 ? (
                  <MetricList
                    items={metrics.topVendorsByEstimatedTotal.map((vendor) => ({
                      id: vendor.vendorId,
                      label: vendor.vendorName,
                      value: vendor.value,
                      display: formatCurrency(vendor.value),
                    }))}
                  />
                ) : (
                  <EmptyCard message="No won or finalized proposals yet." />
                )}
              </DashboardCard>

              <DashboardCard
                title="Top officers by est. total"
                subheader="Managed project value by officer"
              >
                {metrics.topOfficersByEstimatedTotal.length > 0 ? (
                  <MetricList
                    items={metrics.topOfficersByEstimatedTotal.map(
                      (officer) => ({
                        id: officer.vendorId,
                        label: officer.vendorName,
                        value: officer.value,
                        display: formatCurrency(officer.value),
                      }),
                    )}
                  />
                ) : (
                  <EmptyCard />
                )}
              </DashboardCard>
            </Box>
          </Stack>
        )}
      </QueryState>
    </Box>
  )
}

function EmptyCard({ message = 'No data to display yet.' }: { message?: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 160,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  )
}
