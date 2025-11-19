import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Contact from '../Contact';
import { toast } from '@/hooks/use-toast';

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn()
}));

// Mock fetch
global.fetch = jest.fn();

// Mock intersection observer
jest.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: jest.fn(), inView: true })
}));

describe('Contact Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as any).mockClear();
  });

  it('renders contact form with all fields', () => {
    render(<Contact />);
    
    expect(screen.getByPlaceholderText('Your Name *')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your Email *')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Subject *')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your Message *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('renders contact information', () => {
    render(<Contact />);
    
    expect(screen.getByText('aman.awasthi.dev@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('+91 98765 43210')).toBeInTheDocument();
    expect(screen.getByText('Dehradun, Uttarakhand, India')).toBeInTheDocument();
  });

  it('validates form fields correctly', async () => {
    render(<Contact />);
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive"
      });
    });
  });

  it('shows validation errors for individual fields', async () => {
    render(<Contact />);
    
    const nameInput = screen.getByPlaceholderText('Your Name *');
    const emailInput = screen.getByPlaceholderText('Your Email *');
    const submitButton = screen.getByRole('button', { name: /send message/i });
    
    // Enter invalid data
    fireEvent.change(nameInput, { target: { value: 'A' } }); // Too short
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } }); // Invalid email
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('clears validation errors when user starts typing', async () => {
    render(<Contact />);
    
    const nameInput = screen.getByPlaceholderText('Your Name *');
    const submitButton = screen.getByRole('button', { name: /send message/i });
    
    // Trigger validation error
    fireEvent.change(nameInput, { target: { value: 'A' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    });
    
    // Fix the error
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    await waitFor(() => {
      expect(screen.queryByText('Name must be at least 2 characters')).not.toBeInTheDocument();
    });
  });

  it('submits form successfully', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Thank you for your message!'
      })
    });
    
    render(<Contact />);
    
    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Your Name *'), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByPlaceholderText('Your Email *'), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Subject *'), {
      target: { value: 'Test Subject' }
    });
    fireEvent.change(screen.getByPlaceholderText('Your Message *'), {
      target: { value: 'This is a test message that is long enough to pass validation.' }
    });
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);
    
    // Check loading state
    await waitFor(() => {
      expect(screen.getByText('Sending Message...')).toBeInTheDocument();
    });
    
    // Check success
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test Subject',
          message: 'This is a test message that is long enough to pass validation.'
        })
      });
      
      expect(toast).toHaveBeenCalledWith({
        title: "Message Sent Successfully! ✨",
        description: "Thank you for your message!"
      });
    });
  });

  it('handles form submission error', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('Network error'));
    
    render(<Contact />);
    
    // Fill out the form with valid data
    fireEvent.change(screen.getByPlaceholderText('Your Name *'), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByPlaceholderText('Your Email *'), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Subject *'), {
      target: { value: 'Test Subject' }
    });
    fireEvent.change(screen.getByPlaceholderText('Your Message *'), {
      target: { value: 'This is a test message that is long enough to pass validation.' }
    });
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: "Message Failed to Send",
        description: "Network error",
        variant: "destructive"
      });
    });
  });

  it('disables form during submission', async () => {
    (fetch as any).mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 1000)));
    
    render(<Contact />);
    
    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Your Name *'), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByPlaceholderText('Your Email *'), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Subject *'), {
      target: { value: 'Test Subject' }
    });
    fireEvent.change(screen.getByPlaceholderText('Your Message *'), {
      target: { value: 'This is a test message that is long enough to pass validation.' }
    });
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);
    
    // Check that form inputs are disabled
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Your Name *')).toBeDisabled();
      expect(screen.getByPlaceholderText('Your Email *')).toBeDisabled();
      expect(screen.getByPlaceholderText('Subject *')).toBeDisabled();
      expect(screen.getByPlaceholderText('Your Message *')).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });

  it('renders social media links', () => {
    render(<Contact />);
    
    const githubLink = screen.getByRole('button', { name: '' }); // GitHub icon button
    const linkedinLink = screen.getByRole('button', { name: '' }); // LinkedIn icon button
    
    expect(githubLink).toBeInTheDocument();
    expect(linkedinLink).toBeInTheDocument();
  });
});