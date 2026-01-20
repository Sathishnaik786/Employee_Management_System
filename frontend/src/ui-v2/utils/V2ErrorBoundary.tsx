import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * V2ErrorBoundary
 * 
 * A specialized error boundary for the UI-V2 rollout.
 * Ensures that if a new dashboard crashes, it doesn't take down the entire app,
 * and provides a gentle recovery option.
 */
class V2ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error in V2 Dashboard:', error, errorInfo);
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '300px',
                    color: '#6b7280',
                    fontFamily: 'sans-serif',
                    textAlign: 'center'
                }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                        Dashboard temporarily unavailable
                    </h2>
                    <p style={{ fontSize: '14px', marginBottom: '24px', maxWidth: '400px' }}>
                        We encountered an issue displaying the new dashboard experience.
                    </p>
                    <button
                        onClick={this.handleRetry}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#fff',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: '#374151',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default V2ErrorBoundary;
