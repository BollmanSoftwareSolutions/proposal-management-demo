import { describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderApp } from './renderApp'

describe('Procurement features (Phase 3)', () => {
  it('lists active projects (including in-legal) with links for a procurement identity', async () => {
    renderApp({ initialPath: '/projects', initialIdentityId: 'user-lead' })

    expect(
      await screen.findByRole('heading', { name: 'Projects' }),
    ).toBeInTheDocument()
    // All four Projects tabs are present.
    expect(screen.getByRole('tab', { name: /^Active/ })).toBeInTheDocument()
    expect(
      screen.getByRole('tab', { name: /In development/ }),
    ).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Closed/ })).toBeInTheDocument()
    expect(
      screen.getByRole('tab', { name: /Create new project/ }),
    ).toBeInTheDocument()

    // The seeded project-1 ("HVAC Overhaul", Active) links out on the Active tab.
    expect(
      await screen.findByRole('link', { name: /HVAC Overhaul/i }),
    ).toBeInTheDocument()
    // In-legal projects now live on the Active tab too (project-11).
    expect(
      screen.getByRole('link', { name: /Elevator Maintenance/i }),
    ).toBeInTheDocument()
    // Draft and Closed projects are not on the Active tab.
    expect(
      screen.queryByRole('link', { name: /Roof Replacement/i }),
    ).toBeNull()
    expect(
      screen.queryByRole('link', { name: /Janitorial Services/i }),
    ).toBeNull()
  })

  it('shows only Draft projects on the In development tab', async () => {
    const user = userEvent.setup()
    renderApp({ initialPath: '/projects', initialIdentityId: 'user-lead' })

    await screen.findByRole('heading', { name: 'Projects' })
    await user.click(screen.getByRole('tab', { name: /In development/ }))

    // project-7 ("Roof Replacement") is Draft.
    expect(
      await screen.findByRole('link', { name: /Roof Replacement/i }),
    ).toBeInTheDocument()
    // Active and Closed projects are excluded.
    expect(screen.queryByRole('link', { name: /HVAC Overhaul/i })).toBeNull()
    expect(
      screen.queryByRole('link', { name: /Janitorial Services/i }),
    ).toBeNull()
  })

  it('shows only Closed projects on the Closed tab', async () => {
    const user = userEvent.setup()
    renderApp({ initialPath: '/projects', initialIdentityId: 'user-lead' })

    await screen.findByRole('heading', { name: 'Projects' })
    await user.click(screen.getByRole('tab', { name: /Closed/ }))

    // project-15 ("Janitorial Services") is Closed.
    expect(
      await screen.findByRole('link', { name: /Janitorial Services/i }),
    ).toBeInTheDocument()
    // Active and Draft projects are excluded.
    expect(screen.queryByRole('link', { name: /HVAC Overhaul/i })).toBeNull()
    expect(
      screen.queryByRole('link', { name: /Roof Replacement/i }),
    ).toBeNull()
  })

  it('switches to the Create tab and shows the create form', async () => {
    const user = userEvent.setup()
    renderApp({ initialPath: '/projects', initialIdentityId: 'user-lead' })

    await screen.findByRole('heading', { name: 'Projects' })
    await user.click(screen.getByRole('tab', { name: /Create new project/i }))
    expect(
      await screen.findByText(/Create a new project/i),
    ).toBeInTheDocument()
  })

  it('renders the project Setup tab with the project name and vendor count', async () => {
    renderApp({
      initialPath: '/projects/project-1/setup',
      initialIdentityId: 'user-lead',
    })

    expect(
      await screen.findByRole('heading', { name: /HVAC Overhaul/i }),
    ).toBeInTheDocument()
    expect(await screen.findByText(/Vendors signed up/i)).toBeInTheDocument()
  })

  it('shows the Vendors tab participants for a project', async () => {
    renderApp({
      initialPath: '/projects/project-1/vendors',
      initialIdentityId: 'user-lead',
    })

    expect(
      await screen.findByText(/Vendors associated with this project/i),
    ).toBeInTheDocument()
  })

  it('lists vendors with their activity for procurement', async () => {
    renderApp({ initialPath: '/vendors', initialIdentityId: 'user-lead' })

    const table = await screen.findByRole('table', { name: /Vendors/i })
    expect(
      within(table).getByRole('columnheader', { name: /Projects won/i }),
    ).toBeInTheDocument()
    // Seeded vendor company name appears as a link to the detail page.
    expect(
      await screen.findByRole('link', { name: /Acme Supplies/i }),
    ).toBeInTheDocument()
  })
})
