import React from 'react';

import { parseTickCpuLoad } from '../utils/statHelper';
import AlertHistoryList from "./AlertHistoryList";
import CpuLoadBarChart from "./CpuLoadBarChart";

export default class CpuStatsReader extends React.Component {
    constructor() {
        super();
        const defaultState = {
            alertThreshold: undefined,
            loadHistoryForChart: [],
            intervalId: null,
            isLoading: false,
            error: null,
            alertHistory: [],
        };
        this.state = defaultState;
    }

    getTickLoadForChart(data) {
        const load = parseTickCpuLoad(data.cpuStat);
        const timestamp = data.timestamp;
        return { x: timestamp, y: load };
    }

    pollTickLoad() {
        fetch('/getLatestData')
            .then(res => res.json())
            .then(data => {

                // get load
                const tickLoadForChart = this.getTickLoadForChart(data);

                // manage cpu load history
                const loadHistory = this.state.loadHistoryForChart;
                loadHistory.push(tickLoadForChart);
                if (loadHistory.length > 600) {
                    loadHistory.shift();
                }

                // manage alert history
                const alertHistory = this.state.alertHistory;
                if (data.alert) {
                    alertHistory.push(data.alert);
                }

                this.setState({
                    isLoading: false,
                    loadHistoryForChart: loadHistory,
                    alertHistory: alertHistory,
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

        fetch('/getAlertThreshold')
            .then(res => res.json())
            .then(data => this.setState({ alertThreshold: data }));

        // initial load to catch up the past history
        // it grabs list of tick data
        fetch('/getAllData')
            .then(res => res.json())
            .then(data => {
                const history = [];
                data.forEach(tickData => {
                    const tickLoad = this.getTickLoadForChart(tickData);
                    history.push(tickLoad);
                });
                this.setState({
                    isLoading: false,
                    loadHistoryForChart: history,
                });
            })
            .then(() => {
                // Run polling.
                // this will be a separated process,
                // so we have to bind `this` to the poll function
                let intervalId = setInterval(this.pollTickLoad.bind(this), 1000);
                this.setState({ intervalId: intervalId });
            });

        fetch('/getAllAlertHistory')
            .then(res => res.json())
            .then(data => {
                this.setState({ alertHistory: data });
            });

    }

    componentWillUnmount() {
        // kill the interval process to prevent zombie process.
        clearInterval(this.state.intervalId);
    }

    render() {
        return (
            <div>
                <CpuLoadBarChart
                    loadHistoryForChart={this.state.loadHistoryForChart}
                    alertThreshold={this.alertThreshold}
                />
                <AlertHistoryList alertHistory={this.state.alertHistory}/>
            </div>
        );
    }
}
