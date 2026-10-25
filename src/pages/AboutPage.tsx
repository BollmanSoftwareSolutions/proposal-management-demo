import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from '@tanstack/react-router'

/**
 * About this demo (design-docs/04-ui-ux.md §4.1): describes the production
 * system and how this demo differs, with a note that data is non-persistent.
 */
export function AboutPage() {
  return (
    <Box sx={{ maxWidth: 760 }}>
      <Typography variant="h4" gutterBottom>
        About this demo
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Vendor Proposal Management is a platform where procurement teams publish
        projects, solicit vendors, collect proposal artifacts, and advance
        finalists through to legal. This demo showcases those workflows across
        the Lead, Officer, and Vendor roles.
      </Typography>

      <Typography variant="h6" gutterBottom>
        How the demo differs from production
      </Typography>
      <Stack component="ul" spacing={1} sx={{ color: 'text.secondary', pl: 3 }}>
        <li>
          It is a <strong>client-only single-page app</strong> — there is no
          server or database.
        </li>
        <li>
          All data lives <strong>in memory</strong> and is served by a mocked
          GraphQL API running in the browser.
        </li>
        <li>
          Use the user menu to <strong>switch roles</strong> and walk the same
          scenario from each perspective.
        </li>
      </Stack>

      <Paper
        variant="outlined"
        sx={{ mt: 3, p: 3, borderStyle: 'dashed', bgcolor: 'background.default' }}
      >
        <Typography variant="subtitle2" gutterBottom>
          Data is non-persistent
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Changes you make are kept only in memory for this browser session. Use
          “Reset demo data” in the user menu to restore the seeded dataset at any
          time; a page reload also resets everything.
        </Typography>
      </Paper>

      <Typography sx={{ mt: 3 }}>
        <Link component={RouterLink} to="/dashboard">
          Back to the dashboard
        </Link>
      </Typography>
    </Box>
  )
}
