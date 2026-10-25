import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AppProviders } from '../app/providers'
import { Footer } from '../components/layout/Footer'

describe('App foundations smoke test', () => {
  it('renders a presentational component inside the providers', () => {
    render(
      <AppProviders>
        <Footer />
      </AppProviders>,
    )

    expect(screen.getByText(/Bollman Software Solutions/i)).toBeInTheDocument()
  })
})
