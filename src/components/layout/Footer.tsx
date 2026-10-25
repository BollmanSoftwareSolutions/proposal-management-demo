import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from '@tanstack/react-router'

const externalLinks = [
  { label: 'Bollman Software', href: 'https://bollmansoftware.com' },
  {
    label: 'GitHub repo',
    href: 'https://github.com/BollmanSoftwareSolutions/proposal-management-demo',
  },
]

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 3,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 2,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Bollman Software Solutions
      </Typography>
      {externalLinks.map((l) => (
        <Link
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener"
          variant="body2"
          color="text.secondary"
          underline="hover"
        >
          {l.label}
        </Link>
      ))}
      <Link
        component={RouterLink}
        to="/about"
        variant="body2"
        color="text.secondary"
        underline="hover"
      >
        About this demo
      </Link>
    </Box>
  )
}
