import React from 'react';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryTheme } from 'victory';
import moment from 'moment';

const CpuLoadBarChart = ({ loadHistoryForChart, alertThreshold }) => {
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
                independentAxis
                style={{
                    grid: { stroke: 'none' },
                    ticks: { stroke: "grey", size: 5 },
                    tickLabels: { fontSize: 8, padding: 5 }
                }}
                tickCount={5}
                tickFormat={x => moment(x).format('H:mm:ss')}
            />
            <VictoryAxis
                dependentAxis
            />

            <VictoryBar data={loadHistoryForChart}/>
        </VictoryChart>
    );
};

export default CpuLoadBarChart;