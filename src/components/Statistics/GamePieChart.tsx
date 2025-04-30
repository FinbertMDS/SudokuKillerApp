import { Dimensions, ScrollView, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';
import { useTheme } from '../../context/ThemeContext';
import { DailyStatsPieData } from '../../types';

const screenWidth = Dimensions.get('window').width;

type GamePieChartProps = {
  levelCounts: DailyStatsPieData[];
  chartConfig: AbstractChartConfig;
};

const GamePieChart = ({ levelCounts, chartConfig }: GamePieChartProps) => {
  const { theme } = useTheme();

  if (levelCounts.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>Game Distribution by Level</Text>
        <Text style={[{ color: theme.text }]}>No data available</Text>
      </View>
    );
  }

  const chartWidth = screenWidth - 32;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Game Distribution by Level</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <PieChart
          data={levelCounts}
          width={chartWidth}
          height={220}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="0"
          chartConfig={chartConfig}
          style={styles.chart}
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

export default GamePieChart;
