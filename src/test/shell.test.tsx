import { describe, expect, it } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderApp } from './renderApp'

describe('App shell & roles (Phase 2)', () => {
  it('renders the shell and redirects the index to the dashboard', async () => {
    renderApp({ initialPath: '/' })

    expect(
      await screen.findByText(/Procurement dashboard/i),
    ).toBeInTheDocument()
    // Header logo + footer are part of the shell.
    expect(screen.getByText('Proposal Management')).toBeInTheDocument()
    expect(
      screen.getByText(/Bollman Software Solutions/i),
    ).toBeInTheDocument()
  })

  it('shows procurement nav tabs for a Lead/Officer identity', async () => {
    renderApp({ initialPath: '/dashboard', initialIdentityId: 'user-lead' })

    const nav = await screen.findByRole('tablist')
    expect(within(nav).getByRole('tab', { name: 'Dashboard' })).toBeInTheDocument()
    expect(within(nav).getByRole('tab', { name: 'Projects' })).toBeInTheDocument()
    expect(within(nav).getByRole('tab', { name: 'Vendors' })).toBeInTheDocument()
    expect(within(nav).getByRole('tab', { name: 'Artifacts' })).toBeInTheDocument()
    expect(within(nav).queryByRole('tab', { name: 'Proposals' })).toBeNull()
  })

  it('shows vendor nav tabs for a Vendor identity', async () => {
    renderApp({ initialPath: '/dashboard', initialIdentityId: 'user-vendor' })

    const nav = await screen.findByRole('tablist')
    expect(within(nav).getByRole('tab', { name: 'Proposals' })).toBeInTheDocument()
    expect(
      within(nav).getByRole('tab', { name: 'Not Interested' }),
    ).toBeInTheDocument()
    expect(
      within(nav).getByRole('tab', { name: 'Shared Artifacts' }),
    ).toBeInTheDocument()
    expect(within(nav).queryByRole('tab', { name: 'Vendors' })).toBeNull()
    // Vendor dashboard content is scoped.
    expect(await screen.findByText(/Your dashboard/i)).toBeInTheDocument()
  })

  it('switches role from the user menu, changing the nav', async () => {
    const user = userEvent.setup()
    renderApp({ initialPath: '/dashboard', initialIdentityId: 'user-lead' })

    await screen.findByRole('tablist')
    await user.click(screen.getByRole('button', { name: /user menu/i }))
    await user.click(await screen.findByText('Vera Vendor'))

    await waitFor(() => {
      const nav = screen.getByRole('tablist')
      expect(
        within(nav).getByRole('tab', { name: 'Proposals' }),
      ).toBeInTheDocument()
    })
  })

  it('resolves the project detail route and defaults to the Setup tab', async () => {
    renderApp({ initialPath: '/projects/proj-1' })

    expect(await screen.findByText(/Project proj-1/i)).toBeInTheDocument()
    const tablists = await screen.findAllByRole('tablist')
    const detailTabs = tablists[tablists.length - 1]
    expect(within(detailTabs).getByRole('tab', { name: 'Setup' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })

  it('renders the About page', async () => {
    renderApp({ initialPath: '/about' })
    expect(
      await screen.findByRole('heading', { name: /About this demo/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Data is non-persistent/i)).toBeInTheDocument()
  })
})
