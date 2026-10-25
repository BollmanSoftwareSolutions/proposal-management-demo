import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { Outlet } from '@tanstack/react-router'
import { Header } from './Header'
import { Footer } from './Footer'

/**
 * App shell: docked Header, scrolling routed content, docked Footer.
 * Child routes render into the <Outlet />.
 */
export function AppShell() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Header />
      <Box component="main" sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Outlet />
        </Container>
      </Box>
      <Footer />
    </Box>
  )
}
