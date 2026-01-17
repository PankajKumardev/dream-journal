"use client";

import React, { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console and potentially to external service
    console.error("Error Boundary caught an error:", error, errorInfo);
    
    // TODO: Send to error tracking service
    // logger.error("React Error Boundary", error, { componentStack: errorInfo.componentStack });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
          <div className="max-w-md text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-serif text-foreground">
                Something went wrong
              </h2>
              <p className="text-muted-foreground text-sm">
                An unexpected error occurred. Please try refreshing the page.
              </p>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="text-left p-4 bg-muted rounded-lg overflow-auto max-h-32">
                <code className="text-xs text-destructive">
                  {this.state.error.message}
                </code>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={this.handleReset}
                className="rounded-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button
                onClick={() => window.location.reload()}
                className="rounded-full"
              >
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary for function components
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}
