import React, { Component } from 'react';
import ErrorBoundary from './ErrorBoundary';
import CpuStatsReader from './CpuStatsReader';

class App extends Component {
    render() {
        return (
            <ErrorBoundary>
                <div className="App">
                    <header className="App-header">
                    <p>
                    Edit <code>src/App.js</code> and save to reload.
                    </p>
                    </header>
                    <ErrorBoundary>
                        <CpuStatsReader />
                    </ErrorBoundary>
                </div>
            </ErrorBoundary>
        );
    }
}

export default App;
