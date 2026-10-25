import Tab from '@mui/material/Tab'
import { createLink } from '@tanstack/react-router'

/**
 * A MUI `Tab` wired to TanStack Router navigation. Renders as an anchor so tabs
 * are deep-linkable and support middle-click/open-in-new-tab. Used by the header
 * nav and detail-page tab strips.
 */
export const LinkTab = createLink(Tab)
