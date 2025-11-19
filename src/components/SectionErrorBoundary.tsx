import { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/react';

interface SectionErrorBoundaryProps {
  sectionName: string;
  children: ReactNode;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
  retryCount: number;
  isRetrying: boolean;
}

const MAX_SECTION_RETRIES = 2;

class SectionErrorBoundary extends Component<SectionErrorBoundaryProps, SectionErrorBoundaryState> {
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(props: SectionErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
      retryCount: 0,
      isRetrying: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<SectionErrorBoundaryState> {
    return { hasError: true, errorMessage: error.message };
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const { retryCount } = this.state;
    const isNetworkError = !navigator.onLine || error.message.includes('fetch') || error.message.includes('Loading chunk');
    
    // Log to Sentry
    Sentry.captureException(error, {
      contexts: {
        section: {
          name: this.props.sectionName,
          componentStack: info.componentStack,
          retryCount,
        }
      },
      tags: {
        sectionName: this.props.sectionName,
        errorType: isNetworkError ? 'network' : 'component',
      },
    });

    // Auto-retry for chunk loading errors
    if (isNetworkError && retryCount < MAX_SECTION_RETRIES) {
      const delay = Math.min(1000 * Math.pow(2, retryCount), 5000); // Exponential backoff, max 5s
      
      this.setState({ isRetrying: true });
      
      this.retryTimeout = setTimeout(() => {
        this.setState({
          hasError: false,
          errorMessage: '',
          retryCount: retryCount + 1,
          isRetrying: false,
        });
      }, delay);
    }
  }

  private handleRetry = () => {
    const { retryCount } = this.state;
    
    if (retryCount < MAX_SECTION_RETRIES) {
      this.setState({
        hasError: false,
        errorMessage: '',
        retryCount: retryCount + 1,
        isRetrying: false,
      });
    }
  };

  render() {
    const { hasError, errorMessage, retryCount, isRetrying } = this.state;
    const { sectionName, children } = this.props;
    
    if (hasError) {
      const canRetry = retryCount < MAX_SECTION_RETRIES;
      const isOffline = !navigator.onLine;
      
      return (
        <section className="py-12" role="alert" aria-live="assertive">
          <div className="mx-auto max-w-4xl rounded-xl border border-destructive/40 bg-destructive/5 p-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="font-semibold text-destructive">
                  {isOffline ? `${sectionName}: Connection lost` : `${sectionName} failed to load`}
                </p>
                <p className="text-sm text-destructive/80 mt-1">
                  {isOffline 
                    ? 'Please check your internet connection and try again.'
                    : errorMessage || 'An unexpected error occurred. Please try again.'}
                </p>
                
                {retryCount > 0 && (
                  <p className="text-xs text-destructive/60 mt-2">
                    Retry attempt: {retryCount} of {MAX_SECTION_RETRIES}
                  </p>
                )}
                
                {isRetrying && (
                  <div className="flex items-center gap-2 mt-3 text-sm text-destructive/70">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Retrying...</span>
                  </div>
                )}
                
                {!isRetrying && canRetry && (
                  <button
                    type="button"
                    onClick={this.handleRetry}
                    className="mt-4 rounded-md border border-destructive bg-background px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10"
                  >
                    Retry {sectionName}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      );
    }

    return children;
  }
}

export default SectionErrorBoundary;
