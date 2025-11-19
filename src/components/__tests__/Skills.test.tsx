import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Skills from '../Skills';

// Mock intersection observer
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver as any;

describe('Skills Component', () => {
  beforeEach(() => {
    mockIntersectionObserver.mockClear();
  });

  it('renders the skills section heading', () => {
    render(<Skills />);
    expect(screen.getByText(/Technical/i)).toBeInTheDocument();
    expect(screen.getByText(/Skills/i)).toBeInTheDocument();
  });

  it('renders all skill items', () => {
    render(<Skills />);
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('PyTorch')).toBeInTheDocument();
    expect(screen.getByText('Prompt Engineering')).toBeInTheDocument();
    expect(screen.getByText('RAG Pipelines')).toBeInTheDocument();
    expect(screen.getByText('AI Agents')).toBeInTheDocument();
  });

  it('displays skill levels with progress bars', () => {
    render(<Skills />);
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars.length).toBeGreaterThan(0);
  });

  it('shows skill categories as badges', () => {
    render(<Skills />);
    expect(screen.getByText('GenAI')).toBeInTheDocument();
    expect(screen.getByText('ML')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();
  });

  it('has proper accessibility structure', () => {
    render(<Skills />);
    const section = screen.getByRole('region');
    expect(section).toHaveAttribute('id', 'skills');
  });

  it('renders skill icons', () => {
    const { container } = render(<Skills />);
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });
});
