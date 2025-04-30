import { ColorSchemeName } from 'react-native';
import { DailyStats, GameLogEntry, Level } from '../types';
import { getLevelColor, levelColors } from './colorUtil';
import { LEVELS } from './constants';

export function convertLogsToStats(logs: GameLogEntry[]): DailyStats[] {
  if (logs.length === 0) {
    return [];
  }

  const map = new Map<string, { games: number; totalTimeSeconds: number }>();

  logs.forEach(log => {
    const { date, durationSeconds } = log;
    if (!map.has(date)) {
      map.set(date, { games: 1, totalTimeSeconds: durationSeconds });
    } else {
      const current = map.get(date)!;
      current.games += 1;
      current.totalTimeSeconds += durationSeconds;
    }
  });

  const sorted = Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));

  return sorted.map(([date, { games, totalTimeSeconds }]) => ({ date, games, totalTimeSeconds }));
}

export function convertToPieData(logs: GameLogEntry[], scheme: ColorSchemeName = 'light') {
  if (logs.length === 0) {
    return [];
  }

  const levelMap: Record<Level, number> = { easy: 0, medium: 0, hard: 0, expert: 0 };

  logs.forEach(log => {
    levelMap[log.level]++;
  });

  return Object.entries(levelMap).map(([level, count]) => ({
    name: level.charAt(0).toUpperCase() + level.slice(1),
    count,
    color: getLevelColor(level as Level, scheme),
    legendFontColor: scheme === 'dark' ? '#fff' : '#333',
    legendFontSize: 12,
  })).filter(item => item.count > 0);
}

export function convertToStackedData(logs: GameLogEntry[], scheme: ColorSchemeName = 'light') {
  if (logs.length === 0) {
    return null;
  }

  const dateMap = new Map<string, Record<Level, number>>();

  logs.forEach(({ date, level }) => {
    if (!dateMap.has(date)) {
      dateMap.set(date, { easy: 0, medium: 0, hard: 0, expert: 0 });
    }
    dateMap.get(date)![level]++;
  });

  const sorted = Array.from(dateMap.entries()).sort(([a], [b]) => a.localeCompare(b));

  return {
    labels: sorted.map(([date]) => date.slice(5)),
    legend: LEVELS.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
    data: sorted.map(([, counts]) => LEVELS.map(l => counts[l])),
    barColors: LEVELS.map(level => levelColors[level][scheme!]),
  };
}
