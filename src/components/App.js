import React, { Component } from 'react';
import BarChart from "./BarChart";

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                <p>
                Edit <code>src/App.js</code> and save to reload.
                </p>
                </header>
                <BarChart/>
            </div>
        );
    }
}

export default App;
