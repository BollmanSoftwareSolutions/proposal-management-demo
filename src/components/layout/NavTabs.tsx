import Tabs from '@mui/material/Tabs'
import { useRouterState } from '@tanstack/react-router'
import { LinkTab } from '../common/LinkTab'
import { useRole } from '../../roles/roleContext'
import { navForRoles } from '../../roles/navigation'

/**
 * Role-dependent navigation tabs. The visible set changes with the active
 * identity (procurement vs. vendor); the active tab is derived from the current
 * route so deep links and nested pages highlight the right tab.
 */
export function NavTabs() {
  const { identity } = useRole()
  const items = navForRoles(identity.roles)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  const active =
    items.find((i) => pathname === i.to || pathname.startsWith(`${i.to}/`))
      ?.to ?? false

  return (
    <Tabs
      value={active}
      variant="scrollable"
      allowScrollButtonsMobile
      textColor="primary"
      indicatorColor="primary"
      sx={{ minHeight: 48 }}
    >
      {items.map((i) => (
        <LinkTab key={i.to} label={i.label} value={i.to} to={i.to} />
      ))}
    </Tabs>
  )
}
