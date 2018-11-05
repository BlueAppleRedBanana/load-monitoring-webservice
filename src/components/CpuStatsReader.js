import React from 'react';

import { parseTickCpuLoad } from '../utils/statHelper';
import AlertHistoryList from "./AlertHistoryList";
import BarChart from "./BarChart";
import { VictoryChart, VictoryBar, VictoryAxis, VictoryTheme } from 'victory';
import moment from "moment";
import { last, get } from 'lodash';

export default class CpuStatsReader extends React.Component {
    constructor() {
        super();
        const loads = [];
        const defaultState = {
            loadHistoryForChart: loads,
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
        fetch('/stats')
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
                if (data.isAlertUpdated) {
                    alertHistory.push({
                        timestamp: data.timestamp,
                        message: data.alert
                            ? 'alert triggered'
                            : 'alert disabled',
                        load: parseTickCpuLoad(data.cpuStat),
                    });
                    if (alertHistory.length > 100) {
                        loadHistory.shift();
                    }
                }

                console.log(this.state);
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
        fetch('/statsAll')
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
            <div>
                <VictoryChart
                    theme={VictoryTheme.material}
                    domainPadding={{
                        x: 20,
                        y: 0,
                    }}
                    padding={{
                        top: 0,
                        bottom: 32,
                        right: 12,
                        left: 40,
                    }}
                >
                    <VictoryAxis
                        independentAxis
                        style={{
                            grid: { stroke: 'none' },
                            ticks: { stroke: "grey", size: 5 },
                            tickLabels: { fontSize: 8, padding: 5 }
                        }}
                        tickCount={10}
                        tickFormat={x => moment(x).format('H:mm:ss')}
                    />
                    <VictoryAxis
                        dependentAxis
                    />
                    <VictoryBar data={this.state.loadHistoryForChart}/>
                </VictoryChart>
                <AlertHistoryList alertHistory={this.state.alertHistory}/>
            </div>
        );
    }
}
