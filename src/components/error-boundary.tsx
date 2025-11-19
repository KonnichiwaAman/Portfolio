import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from "@sentry/react";

// Types
interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  eventId: string | null;
  retryCount: number;
}

// Constants
const ERROR_MESSAGES = {
  title: 'Something went wrong',
  description: 'We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.',
  offline: 'You appear to be offline. Please check your internet connection.',
  timeout: 'The request took too long to complete. Please try again.'
} as const;

const MAX_RETRY_COUNT = 3;

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
      retryCount: 0,
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);
    
    // Check if error is network-related
    const isNetworkError = !navigator.onLine || error.message.includes('fetch') || error.message.includes('network');
    
    // Send error to Sentry only if online and not a network error
    let eventId: string | null = null;
    if (!isNetworkError) {
      eventId = Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
        tags: {
          errorType: isNetworkError ? 'network' : 'application',
        },
      });
    }

    this.setState({
      error,
      errorInfo,
      eventId,
    });
  }

  private handleRefresh = (): void => {
    window.location.reload();
  };

  private handleRetry = (): void => {
    const { retryCount } = this.state;
    
    if (retryCount < MAX_RETRY_COUNT) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: retryCount + 1,
      });
    } else {
      // Max retries reached, force refresh
      this.handleRefresh();
    }
  };

  private handleReportFeedback = (): void => {
    const { eventId } = this.state;
    if (eventId) {
      Sentry.showReportDialog({ eventId });
    }
  };

  private renderErrorContent(): ReactNode {
    const { error, eventId, retryCount } = this.state;
    const isOffline = !navigator.onLine;
    const canRetry = retryCount < MAX_RETRY_COUNT;

    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-2xl w-full bg-card rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h1 className="text-2xl font-bold text-red-500">
              {isOffline ? 'Connection Lost' : ERROR_MESSAGES.title}
            </h1>
          </div>
          
          <p className="text-foreground mb-4">
            {isOffline ? ERROR_MESSAGES.offline : ERROR_MESSAGES.description}
          </p>

          {error && !isOffline && (
            <div className="bg-muted p-4 rounded-md mb-4">
              <p className="text-sm font-mono text-foreground/80">
                {error.toString()}
              </p>
            </div>
          )}

          {retryCount > 0 && (
            <p className="text-sm text-muted-foreground mb-4">
              Retry attempt: {retryCount} of {MAX_RETRY_COUNT}
            </p>
          )}

          <div className="flex gap-3 flex-wrap">
            {canRetry && (
              <button
                onClick={this.handleRetry}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            )}
            
            <button
              onClick={this.handleRefresh}
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors"
            >
              Refresh Page
            </button>
            
            {eventId && !isOffline && (
              <button
                onClick={this.handleReportFeedback}
                className="border border-border text-foreground px-4 py-2 rounded-md hover:bg-accent transition-colors"
              >
                Report Feedback
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return this.renderErrorContent();
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 