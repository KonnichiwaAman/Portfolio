import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Projects from '../Projects';

// Mock intersection observer
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver as any;

describe('Projects Component', () => {
  beforeEach(() => {
    mockIntersectionObserver.mockClear();
  });

  it('renders the projects section heading', () => {
    render(<Projects />);
    expect(screen.getByText(/Featured/i)).toBeInTheDocument();
    expect(screen.getByText(/Projects/i)).toBeInTheDocument();
  });

  it('renders all project cards', () => {
    render(<Projects />);
    expect(screen.getByText(/RAG Chatbot for Documentation/i)).toBeInTheDocument();
    expect(screen.getByText(/Agentic Workflow Orchestrator/i)).toBeInTheDocument();
    expect(screen.getByText(/LoRA Fine-tuned Classifier/i)).toBeInTheDocument();
    expect(screen.getByText(/Vision Pipeline with PyTorch/i)).toBeInTheDocument();
  });

  it('displays project technologies', () => {
    render(<Projects />);
    expect(screen.getByText(/Python/i)).toBeInTheDocument();
    expect(screen.getByText(/PyTorch/i)).toBeInTheDocument();
    expect(screen.getByText(/FastAPI/i)).toBeInTheDocument();
    expect(screen.getByText(/Docker/i)).toBeInTheDocument();
  });

  it('renders project status badges', () => {
    render(<Projects />);
    expect(screen.getByText(/Case Study/i)).toBeInTheDocument();
    expect(screen.getByText(/In Progress/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Prototype/i)).toHaveLength(2);
  });

  it('has proper accessibility attributes', () => {
    render(<Projects />);
    const section = screen.getByRole('region');
    expect(section).toHaveAttribute('id', 'projects');
  });

  it('displays project descriptions', () => {
    render(<Projects />);
    expect(screen.getByText(/Retrieval-Augmented Generation chatbot/i)).toBeInTheDocument();
    expect(screen.getByText(/Multi-tool agent with function-calling/i)).toBeInTheDocument();
  });
});
