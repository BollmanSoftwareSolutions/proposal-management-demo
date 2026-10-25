import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Select, { type SelectChangeEvent } from '@mui/material/Select'
import { useRole } from '../../roles/roleContext'

/**
 * Phase 0 header: logo + a minimal identity picker standing in for the full
 * Role Switcher that lands in Phase 2. Role-based nav tabs arrive with the shell
 * work in Phase 2.
 */
export function Header() {
  const { identity, identities, setIdentityId } = useRole()

  const handleChange = (event: SelectChangeEvent) => {
    setIdentityId(event.target.value)
  }

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
          Proposal Management
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Select
          size="small"
          value={identity.id}
          onChange={handleChange}
          inputProps={{ 'aria-label': 'Select identity' }}
        >
          {identities.map((i) => (
            <MenuItem key={i.id} value={i.id}>
              {i.name} ({i.roles.join('/')})
            </MenuItem>
          ))}
        </Select>
      </Toolbar>
    </AppBar>
  )
}
