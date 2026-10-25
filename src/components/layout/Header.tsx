import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { Link } from '@tanstack/react-router'
import { NavTabs } from './NavTabs'
import { UserMenu } from './UserMenu'

/**
 * App header: left-aligned logo, a separator, role-dependent navigation tabs,
 * and a right-aligned user menu (Role Switcher, reset demo data, About).
 */
export function Header() {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography
          component={Link}
          to="/dashboard"
          variant="h6"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Proposal Management
        </Typography>
        <Divider
          orientation="vertical"
          flexItem
          sx={{ display: { xs: 'none', sm: 'block' } }}
        />
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <NavTabs />
        </Box>
        <UserMenu />
      </Toolbar>
    </AppBar>
  )
}
