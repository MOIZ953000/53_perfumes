import { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorPage } from '../pages/ErrorPage';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Treppan ErrorBoundary caught runtime exception]:', error, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorPage code={500} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
