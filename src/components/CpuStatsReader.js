import React from 'react';
import { VictoryChart, VictoryBar } from 'victory'

export default class CpuStatsReader extends React.Component {
    constructor() {
        super();
        const loads = [];
        const defaultState = {
            loadHistory: loads,
            intervalId: null,
            isLoading: false,
            error: null,
        };
        this.state = defaultState;
    }

    parseTickLoad(data) {
        const cpuStat = data.cpuStat;
        const load = (cpuStat.loadavg['1m'] / cpuStat.cpus.length);
        const timestamp = data.timestamp;
        console.log(this.state);

        return { x: timestamp, y: load };
    }

    pollTickLoad() {
        fetch('/stats')
            .then(res => res.json())
            .then(data => {
                const tickLoad = this.parseTickLoad(data);
                const history = this.state.loadHistory;
                history.push(tickLoad);
                if (history.length > 600) {
                    history.shift();
                }
                this.setState({
                    isLoading: false,
                    loadHistory: history,
                });
            })
            .catch(error => {
                this.setState({
                    isLoading: false
                });
                throw error;
            });
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        fetch('/statsAll')
            .then(res => res.json())
            .then(data => {
                const history = [];
                data.forEach(tickData => {
                    const tickLoad = this.parseTickLoad(tickData);
                    history.push(tickLoad);
                });
                this.setState({
                    isLoading: false,
                    loadHistory: history,
                });
                return true;
            })
            .then(success => {
                if (!success) {
                    console.log('initial load failed');
                }
                let intervalId = setInterval(this.pollTickLoad.bind(this), 1000);
                this.setState({ intervalId: intervalId });
            });
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

    render() {
        return (
            <VictoryChart>
                <VictoryBar data={this.state.loadHistory}/>
            </VictoryChart>
        );
    }
}