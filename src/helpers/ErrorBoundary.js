import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // Optionally send error to logging service
    // e.g., Sentry, LogRocket, etc.
    if (typeof window !== 'undefined' && window.logError) {
      window.logError(error, errorInfo);
    }
  }

  handleReset() {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="wmcads-container wmcads-m-t-lg wmcads-m-b-lg">
          <main className="wmcads-container--main" role="main" aria-label="Error message">
            <div className="wmcads-col-1">
              <div className="wmcads-msg-summary wmcads-msg-summary--error wmcads-m-b-lg" role="alert" aria-live="assertive">
                <div className="wmcads-msg-summary__header">
                  <svg className="wmcads-msg-summary__icon" aria-hidden="true" focusable="false">
                    <use href="#wmcads-general-warning-triangle"></use>
                  </svg>
                  <h3 className="wmcads-msg-summary__title" id="error-title">Something went wrong</h3>
                </div>
                <div className="wmcads-msg-summary__info" aria-describedby="error-title">
                  <p>We encountered an unexpected error while displaying this content. Our team has been notified. Please try refreshing the page.</p>
                  {process.env.NODE_ENV === 'development' && this.state.error && (
                    <details
                      style={{
                        marginTop: '16px',
                        padding: '12px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        border: '1px solid #e0e0e0',
                      }}
                      aria-label="Error details for developers"
                    >
                      <summary 
                        style={{ 
                          fontWeight: 'bold', 
                          cursor: 'pointer',
                          color: '#231f20',
                          fontSize: '14px',
                        }}
                      >
                        🔍 Error Details (Development Only)
                      </summary>
                      <pre
                        style={{
                          marginTop: '12px',
                          overflow: 'auto',
                          fontSize: '12px',
                          backgroundColor: '#fff',
                          padding: '12px',
                          borderRadius: '2px',
                          border: '1px solid #e0e0e0',
                          fontFamily: 'Monaco, Menlo, monospace',
                          maxHeight: '300px',
                        }}
                        aria-label="Technical error information"
                      >
                        {this.state.error.toString()}
                        {'\n\n'}
                        {this.state.errorInfo?.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={this.handleReset}
                  className="wmcads-btn wmcads-btn--primary"
                  aria-label="Try again to reload the content"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="wmcads-btn wmcads-btn--secondary"
                  aria-label="Refresh the entire page"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </main>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
