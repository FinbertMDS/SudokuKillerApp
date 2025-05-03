// StatisticsScreen.tsx

import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {GameLogEntry} from '../../types';
import {getChartConfig} from '../../utils/colorUtil';
import {
  convertToPieData,
  convertToStackedData,
  getDailyStatsFromLogs,
} from '../../utils/statsUtil';
import ChartsStatsNotice from './ChartsStatsNotice';
import GameBarChart from './GameBarChart';
import GamePieChart from './GamePieChart';
import GameStackedBarChart from './GameStackedBarChart';
import TimeLineChart from './TimeLineChart';

type ChartsStatsProps = {
  logs: GameLogEntry[];
};

const ChartsStats = ({logs}: ChartsStatsProps) => {
  const {mode, theme} = useTheme();
  const {t} = useTranslation();
  const dailyStats = useMemo(() => getDailyStatsFromLogs(logs), [logs]);
  const levelCounts = useMemo(() => convertToPieData(logs, mode), [logs, mode]);
  const stackedData = useMemo(
    () => convertToStackedData(logs, mode, t),
    [logs, mode, t],
  );
  const chartConfig = useMemo(() => getChartConfig(mode), [mode]);

  return (
    <ScrollView style={{backgroundColor: theme.background}}>
      <GameBarChart dailyStats={dailyStats} chartConfig={chartConfig} />
      <TimeLineChart dailyStats={dailyStats} chartConfig={chartConfig} />
      <GamePieChart levelCounts={levelCounts} chartConfig={chartConfig} />
      <GameStackedBarChart
        stackedData={stackedData}
        chartConfig={chartConfig}
      />
      <ChartsStatsNotice />
    </ScrollView>
  );
};

export default ChartsStats;
