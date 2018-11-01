import React from 'react';
import { VictoryChart, VictoryBar } from 'victory'

const sampleData = [
    { x: 1, y: 10 },
    { x: 2, y: 20 },
];

const BarChart = (data = sampleData) => {
    return (
        <VictoryChart>
            <VictoryBar data={data}/>
        </VictoryChart>
    )
};

export default BarChart;