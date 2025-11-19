import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Hero from '../Hero';

// Mock the intersection observer
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;
window.IntersectionObserverEntry = jest.fn();

describe('Hero Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders hero section with correct content', () => {
    render(<Hero />);
    
    expect(screen.getByText('Aman Awasthi')).toBeInTheDocument();
    expect(screen.getByText(/Python-first/i)).toBeInTheDocument();
    expect(screen.getByText(/Generative AI, RAG pipelines/i)).toBeInTheDocument();
  });

  it('renders call-to-action buttons', () => {
    render(<Hero />);
    
    expect(screen.getByLabelText('View projects section')).toBeInTheDocument();
    expect(screen.getByLabelText('View portfolio section')).toBeInTheDocument();
  });

  it('renders availability status indicator', () => {
    render(<Hero />);
    
    const statusText = screen.getByText('Available for opportunities');
    expect(statusText).toBeInTheDocument();
  });

  it('renders scroll indicator', () => {
    render(<Hero />);
    
    expect(screen.getByText('Discover my work')).toBeInTheDocument();
  });
});