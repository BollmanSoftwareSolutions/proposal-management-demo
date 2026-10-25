import Link from '@mui/material/Link'
import { createLink } from '@tanstack/react-router'

/**
 * A MUI `Link` wired to TanStack Router navigation (typed `to`/`params`), the
 * same pattern as `LinkTab`. Use for in-content links to typed routes.
 */
export const AppLink = createLink(Link)
