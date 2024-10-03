import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from './Card';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
                    <Card className='p-6 flex flex-col items-center justify-center'>
                        <h1>Something went wrong.</h1>
                        <p>Check the console for more information.</p>
                    </Card>
                </div>
            )
        }

        return this.props.children;
    }
}

export default ErrorBoundary;