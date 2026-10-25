import { useState, type ReactNode } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { theme } from './theme'
import { RoleProvider } from '../roles/RoleProvider'

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 30_000,
      },
    },
  })
}

export function AppProviders({
  children,
  initialIdentityId,
}: {
  children: ReactNode
  initialIdentityId?: string
}) {
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RoleProvider initialIdentityId={initialIdentityId}>
          {children}
        </RoleProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
