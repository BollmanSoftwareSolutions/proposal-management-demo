import { createTheme } from '@mui/material/styles'

// Palette sourced from design-docs/04-ui-ux.md §7 "Theming & color palette".
const palette = {
  primary: '#ff580f',
  primaryLight: '#ff7e26',
  accent1: '#ff9c59',
  accent2: '#ffa472',
  surfaceTint: '#ffc99d',
} as const

export const chartPalette = [
  palette.primary,
  palette.primaryLight,
  palette.accent1,
  palette.accent2,
  palette.surfaceTint,
] as const

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: palette.primary,
      light: palette.primaryLight,
      contrastText: '#ffffff',
    },
    secondary: {
      main: palette.accent1,
      light: palette.accent2,
      contrastText: '#1f2933',
    },
    background: {
      default: '#f7f8fa',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: [
      'Inter',
      'system-ui',
      '-apple-system',
      'Segoe UI',
      'Roboto',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
})

export { palette }
