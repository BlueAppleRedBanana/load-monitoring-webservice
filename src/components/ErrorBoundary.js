import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
        this.setState({ hasError: true, error });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div>
                    <h1>Something went wrong.</h1>
                    {this.state.error}
                </div>
            );
        }

        return this.props.children;
    }
}