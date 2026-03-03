'use client'
import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Client-side error caught by ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <div className='text-xl flex-col center min-h-screen'>
              <p>  Something went wrong.</p>
                <p className=' mt-3 text-sm'>Try again later !!</p>
            </div>;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;