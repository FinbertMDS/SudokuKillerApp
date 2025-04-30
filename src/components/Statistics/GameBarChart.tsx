import { Dimensions, ScrollView, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';
import { useTheme } from '../../context/ThemeContext';
import { DailyStats } from '../../types';
import { CHART_WIDTH } from '../../utils/constants';

const screenWidth = Dimensions.get('window').width;

type GameBarChartProps = {
  dailyStats: DailyStats[];
  chartConfig: AbstractChartConfig;
};

const GameBarChart = ({ dailyStats, chartConfig }: GameBarChartProps) => {
  const { theme } = useTheme();

  if (dailyStats.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>Games per Day</Text>
        <Text style={[{ color: theme.text }]}>No data available</Text>
      </View>
    );
  }

  const labels = dailyStats.map(s => s.date.slice(5)); // mm-dd
  const data = dailyStats.map(s => s.games);
  const chartWidth = Math.max(dailyStats.length * CHART_WIDTH, screenWidth);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Games per Day</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <BarChart
          data={{
            labels,
            datasets: [{ data }],
          }}
          width={chartWidth}
          height={220}
          fromZero
          chartConfig={chartConfig}
          style={styles.chart}
          showValuesOnTopOfBars
          yAxisLabel={''}
          yAxisSuffix={''}
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

export default GameBarChart;
