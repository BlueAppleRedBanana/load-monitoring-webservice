import React from 'react';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryTheme } from 'victory';
import moment from 'moment';

const sampleData = [
    { x: 1, y: 10 },
    { x: 2, y: 20 },
];

export default class BarChart extends React.Component {
    constructor(props) {
        super();
        this.state = {
            data: props.data,
        };
    }

    // shouldComponentUpdate(nextProps, nextState){
    //     const lastTick =  last(nextState.data);
    //     return get(lastTick, 'timestamp') !== get(last(this.state.data), 'timestamp');
    // }

    render() {
        return (
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
                    style={{ grid: { stroke: 'none' } }}
                    tickCount={10}
                    tickFormat={x => moment(x).format('H:mm:ss')}
                />
                <VictoryAxis
                    dependentAxis
                />
                <VictoryBar data={this.state.data}/>
            </VictoryChart>
        );
    }
}