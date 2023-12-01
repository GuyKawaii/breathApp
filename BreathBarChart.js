import React from 'react';
import { Dimensions } from 'react-native';
import { StackedBarChart } from 'react-native-chart-kit';

const BreathBarChart = ({ chartData }) => {
  const screenWidth = Dimensions.get("window").width;

  const graphStyle = {
    marginVertical: 8,
    borderRadius: 16,
    padding: 10,
    backgroundColor: '#f5f7fa',
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
        barColors: ["#dfe4ea", "#ced6e0", "#a4b0be"]
      }}
      width={screenWidth - 15}
      height={400}
      chartConfig={chartConfig}
    />
  );
};

export default BreathBarChart;
