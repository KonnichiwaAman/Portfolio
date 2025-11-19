import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import About from '../About';

// Mock intersection observer
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver as any;

describe('About Component', () => {
  beforeEach(() => {
    mockIntersectionObserver.mockClear();
  });

  it('renders the about section heading', () => {
    render(<About />);
    expect(screen.getByText('About Me')).toBeInTheDocument();
  });

  it('displays the main introduction text', () => {
    render(<About />);
    expect(screen.getByText(/AI\/ML engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/Generative AI systems/i)).toBeInTheDocument();
  });

  it('shows expertise description', () => {
    render(<About />);
    expect(screen.getByText(/PyTorch/i)).toBeInTheDocument();
    expect(screen.getByText(/RAG/i)).toBeInTheDocument();
    expect(screen.getByText(/PEFT\/LoRA/i)).toBeInTheDocument();
    expect(screen.getByText(/FastAPI/i)).toBeInTheDocument();
  });

  it('has proper semantic HTML structure', () => {
    render(<About />);
    const section = screen.getByRole('region');
    expect(section).toHaveAttribute('id', 'about');
    expect(section).toHaveAttribute('aria-labelledby', 'about-heading');
  });

  it('renders article cards with proper ARIA labels', () => {
    render(<About />);
    const articles = screen.getAllByRole('article');
    expect(articles.length).toBeGreaterThanOrEqual(2);
  });

  it('displays the subtitle', () => {
    render(<About />);
    expect(screen.getByText(/sophisticated digital solutions/i)).toBeInTheDocument();
  });
});
