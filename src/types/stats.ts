import {Level} from './game';

export interface GameStats {
  gamesStarted: number;
  gamesCompleted: number;
  bestTimeSeconds: number | null;
  averageTimeSeconds: number | null;
  totalTimeSeconds: number;
}

export interface GameLogEntry {
  level: Level;
  date: string; // 'YYYY-MM-DD'
  durationSeconds: number;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  games: number;
  totalTimeSeconds: number;
}

export interface DailyStatsPieData {
  name: string;
  count: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

export interface DailyStatsStackedData {
  labels: string[];
  legend: string[];
  data: number[][];
  barColors: string[];
}
