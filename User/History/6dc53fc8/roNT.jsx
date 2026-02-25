import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 z-[9999] bg-red-50 p-8 flex flex-col items-center justify-center overflow-auto">
                    <h2 className="text-3xl font-bold text-red-600 mb-4">React Render Crash Detected</h2>
                    <p className="text-red-500 font-bold mb-4">{this.state.error && this.state.error.toString()}</p>
                    <pre className="bg-white p-4 rounded shadow text-xs text-slate-800 break-all w-full max-w-4xl max-h-[60vh] overflow-auto">
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </pre>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg font-bold"
                    >
                        Dismiss
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
