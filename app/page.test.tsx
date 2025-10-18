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

  it('displays login buttons', () => {
    render(<Home />)
    expect(screen.getByText('Admin Login')).toBeInTheDocument()
    expect(screen.getByText('Employee Login')).toBeInTheDocument()
  })
})
