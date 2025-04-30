import { Dimensions, ScrollView, Text, View } from 'react-native';
import { StackedBarChart } from 'react-native-chart-kit';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';
import { useTheme } from '../../context/ThemeContext';
import { DailyStatsStackedData } from '../../types';
import { CHART2_WIDTH } from '../../utils/constants';

const screenWidth = Dimensions.get('window').width;

type GameStackedBarChartProps = {
  stackedData: DailyStatsStackedData | null;
  chartConfig: AbstractChartConfig;
};

const GameStackedBarChart = ({ stackedData, chartConfig }: GameStackedBarChartProps) => {
  const { theme } = useTheme();

  if (!stackedData) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>Game Distribution by Level</Text>
        <Text style={[{ color: theme.text }]}>No data available</Text>
      </View>
    );
  }
  const chartWidth = Math.max(stackedData.labels.length * CHART2_WIDTH, screenWidth);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Game Distribution by Level</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <StackedBarChart
          data={stackedData}
          width={chartWidth}
          height={220}
          chartConfig={{
            ...chartConfig,
          }}
          style={styles.chart}
          hideLegend={false}
        />
      </ScrollView>
    </View>
  );
};

const styles = {
  container: {
    padding: 24,
  },
  title: {
    fontSize: 18,
    marginBottom: 6,
  },
  chart: {
    borderRadius: 12,
  },
};

export default GameStackedBarChart;
