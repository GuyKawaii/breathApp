import React from 'react';
import { Dimensions } from 'react-native';
import { StackedBarChart } from 'react-native-chart-kit';

const BreathBarChart = ({ chartData }) => {
    const screenWidth = Dimensions.get("window").width;

    const graphStyle = {
        borderRadius: 2,
        padding: 10,
    };

    const chartConfig = {
        backgroundColor: '#1e90ff',
        backgroundGradientFrom: '#1e90ff',
        backgroundGradientTo: '#87ceeb',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
            borderRadius: 16,
        },
    };

    return (
        <StackedBarChart
            style={graphStyle}
            data={{
                labels: chartData.labels,
                data: chartData.data,
                barColors: ["#bfc3c9", "#b0b1b3", "#a1a0a2", "#929091", "#838181", "#757272", "#686464", "#5b5757", "#4e4a4a"],
            }}
            width={screenWidth - 15}
            height={400}
            chartConfig={chartConfig}
        />
    );
};

export default BreathBarChart;
