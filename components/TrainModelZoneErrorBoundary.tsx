'use client';

import { Component, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Isolates TrainModelZone errors so they don't crash the entire train page.
 * Shows a retry button and error details for debugging.
 */
export class TrainModelZoneErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('TrainModelZoneErrorBoundary caught:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
    console.error('=== TrainModelZone CRASH ===', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center gap-4 p-8 border border-destructive/30 rounded-lg bg-destructive/5">
          <div className="rounded-full bg-destructive/10 p-3">
            <svg className="h-6 w-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-medium text-sm">Upload form failed to load</p>
            <p className="text-xs text-muted-foreground mt-1">
              This might be a temporary issue. Try refreshing the page.
            </p>
          </div>

          {/* Debug info */}
          {this.state.error && (
            <details className="text-left max-w-md w-full">
              <summary className="text-[10px] text-muted-foreground cursor-pointer">
                Error details
              </summary>
              <pre className="mt-1 p-2 bg-muted rounded text-[10px] overflow-auto max-h-32 whitespace-pre-wrap break-all">
                {this.state.error.name}: {this.state.error.message}
                {this.state.error.stack ? '\n\n' + this.state.error.stack : ''}
              </pre>
            </details>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={this.handleRetry}>
              Retry
            </Button>
            <Button size="sm" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
