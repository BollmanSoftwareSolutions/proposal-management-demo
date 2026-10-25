import { useState, type MouseEvent } from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import Divider from '@mui/material/Divider'
import Radio from '@mui/material/Radio'
import Snackbar from '@mui/material/Snackbar'
import Tooltip from '@mui/material/Tooltip'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useRole } from '../../roles/roleContext'
import { resetStore } from '../../mocks/store/store'

/**
 * Right-aligned user menu: the Role Switcher (choose the active identity), a
 * "Reset demo data" action, and a link to the About page.
 */
export function UserMenu() {
  const { identity, identities, setIdentityId } = useRole()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [toast, setToast] = useState(false)
  const open = Boolean(anchorEl)

  const handleOpen = (event: MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const handleSelectIdentity = (id: string) => {
    setIdentityId(id)
    handleClose()
  }

  const handleReset = () => {
    resetStore()
    queryClient.clear()
    handleClose()
    setToast(true)
  }

  const handleAbout = () => {
    handleClose()
    navigate({ to: '/about' })
  }

  return (
    <>
      <Tooltip title={`${identity.name} · ${identity.roles.join('/')}`}>
        <IconButton
          onClick={handleOpen}
          size="large"
          edge="end"
          aria-label="User menu"
          aria-haspopup="true"
          aria-controls={open ? 'user-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
        >
          <AccountCircleIcon />
        </IconButton>
      </Tooltip>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ list: { sx: { minWidth: 260 } } }}
      >
        <ListSubheader disableSticky>Switch role</ListSubheader>
        {identities.map((i) => (
          <MenuItem
            key={i.id}
            selected={i.id === identity.id}
            onClick={() => handleSelectIdentity(i.id)}
          >
            <ListItemIcon>
              <Radio
                edge="start"
                checked={i.id === identity.id}
                tabIndex={-1}
                disableRipple
                size="small"
              />
            </ListItemIcon>
            <ListItemText
              primary={i.name}
              secondary={`${i.roles.join('/')}${i.org ? ` · ${i.org}` : ''}`}
            />
          </MenuItem>
        ))}

        <Divider />

        <MenuItem onClick={handleReset}>
          <ListItemIcon>
            <RestartAltIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Reset demo data"
            secondary="Restore the seeded dataset"
          />
        </MenuItem>
        <MenuItem onClick={handleAbout}>
          <ListItemIcon>
            <InfoOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="About this demo" />
        </MenuItem>
      </Menu>

      <Snackbar
        open={toast}
        autoHideDuration={3000}
        onClose={() => setToast(false)}
        message="Demo data reset"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  )
}
