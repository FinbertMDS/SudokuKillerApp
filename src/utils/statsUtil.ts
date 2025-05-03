import {format, parseISO} from 'date-fns';
import {TFunction} from 'i18next';
import {ColorSchemeName} from 'react-native';
import {DailyStats, GameLogEntry, GameStats, Level, TimeRange} from '../types';
import {getLevelColor, levelColors} from './colorUtil';
import {LEVELS} from './constants';
import {formatShortChartDate, isInTimeRange} from './dateUtil';

export function getDailyStatsFromLogs(logs: GameLogEntry[]): DailyStats[] {
  if (logs.length === 0) {
    return [];
  }

  const map = new Map<string, {games: number; totalTimeSeconds: number}>();

  logs.forEach(log => {
    const date = format(parseISO(log.date), 'yyyy-MM-dd');
    const durationSeconds = log.durationSeconds;

    if (!map.has(date)) {
      map.set(date, {games: 1, totalTimeSeconds: durationSeconds});
    } else {
      const current = map.get(date)!;
      current.games += 1;
      current.totalTimeSeconds += durationSeconds;
    }
  });

  const sorted = Array.from(map.entries()).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return sorted.map(([date, {games, totalTimeSeconds}]) => ({
    date,
    games,
    totalTimeSeconds,
  }));
}

export function getStatsFromLogs(
  logs: GameLogEntry[],
  filter: TimeRange,
): Record<Level, GameStats> {
  const statsByLevel: Record<Level, GameStats> = {
    easy: createEmptyStats(),
    medium: createEmptyStats(),
    hard: createEmptyStats(),
    expert: createEmptyStats(),
  };

  const filtered = logs.filter(log => isInTimeRange(log.date, filter));

  for (const log of filtered) {
    const level = log.level;
    const stats = statsByLevel[level];

    stats.gamesStarted += 1;

    if (log.completed) {
      stats.gamesCompleted += 1;
      stats.totalTimeSeconds += log.durationSeconds;

      if (
        stats.bestTimeSeconds === null ||
        log.durationSeconds < stats.bestTimeSeconds
      ) {
        stats.bestTimeSeconds = log.durationSeconds;
      }
    }
  }

  for (const level of Object.keys(statsByLevel) as Level[]) {
    const stats = statsByLevel[level];
    if (stats.gamesCompleted > 0) {
      stats.averageTimeSeconds = Math.floor(
        stats.totalTimeSeconds / stats.gamesCompleted,
      );
    }
  }

  return statsByLevel;
}

export function createEmptyStats(): GameStats {
  return {
    gamesStarted: 0,
    gamesCompleted: 0,
    bestTimeSeconds: null,
    averageTimeSeconds: null,
    totalTimeSeconds: 0,
  };
}

export function convertToPieData(
  logs: GameLogEntry[],
  scheme: ColorSchemeName = 'light',
) {
  if (logs.length === 0) {
    return [];
  }

  const levelMap: Record<Level, number> = {
    easy: 0,
    medium: 0,
    hard: 0,
    expert: 0,
  };

  logs.forEach(log => {
    levelMap[log.level]++;
  });

  return Object.entries(levelMap)
    .map(([level, count]) => ({
      name: level.charAt(0).toUpperCase() + level.slice(1),
      count,
      color: getLevelColor(level as Level, scheme),
      legendFontColor: scheme === 'dark' ? '#fff' : '#333',
      legendFontSize: 12,
    }))
    .filter(item => item.count > 0);
}

export function convertToStackedData(
  logs: GameLogEntry[],
  scheme: ColorSchemeName = 'light',
  t: TFunction,
) {
  if (logs.length === 0) {
    return null;
  }

  const dateMap = new Map<string, Record<Level, number>>();

  logs.forEach(log => {
    const date = format(parseISO(log.date), 'yyyy-MM-dd');
    if (!dateMap.has(date)) {
      dateMap.set(date, {easy: 0, medium: 0, hard: 0, expert: 0});
    }
    dateMap.get(date)![log.level]++;
  });

  const sorted = Array.from(dateMap.entries()).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return {
    labels: sorted.map(([date]) => formatShortChartDate(date)),
    legend: LEVELS.map(level => t(`level.${level}`)),
    data: sorted.map(([, counts]) => LEVELS.map(l => counts[l])),
    barColors: LEVELS.map(level => levelColors[level][scheme!]),
  };
}
