import { render, screen } from '@testing-library/react'
import Home from './page'

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Home />)
    expect(screen.getByText('PaintingBuddy')).toBeInTheDocument()
  })

  it('displays the tagline', () => {
    render(<Home />)
    expect(screen.getByText('Mobile-First Painting Contractor Management')).toBeInTheDocument()
  })

  it('shows stats cards', () => {
    render(<Home />)
    expect(screen.getByText('Active Sites')).toBeInTheDocument()
    expect(screen.getByText('Painters')).toBeInTheDocument()
    expect(screen.getByText('Avg Progress')).toBeInTheDocument()
  })

  it('displays sign in button', () => {
    render(<Home />)
    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.getByText('Access is automatically granted based on your credentials')).toBeInTheDocument()
  })
})
