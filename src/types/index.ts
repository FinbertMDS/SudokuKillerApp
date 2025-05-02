import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export type Cell = {
  row: number;
  col: number;
};

export type CellValue = number | null;

export interface Cage {
  sum: number;
  cells: [number, number][];
}

export type RootStackParamList = {
  HomeTabs: undefined;
  Board: InitGame | SavedGame;
  Options: undefined;
  Settings: undefined;
  HowToPlay: undefined;
};

export type InitGame = {
  initialBoard: CellValue[][];
  solvedBoard: number[][];
  cages: {cells: [number, number][]; sum: number}[];
  savedLevel: Level;
};

export type SavedGame = {
  savedBoard: CellValue[][];
  savedMistake: number;
  savedTimePlayed: number;
  savedHistory: CellValue[][][];
  savedNotes: string[][][];
  lastSaved: Date;
};

export type BoardScreenRouteProp = RouteProp<RootStackParamList, 'Board'>;

export type BoardScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Board'
>;

export type Level = 'easy' | 'medium' | 'hard' | 'expert';

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

export type OptionMenuItem = {
  icon: string;
  label: string;
  screen?: keyof RootStackParamList;
  onPress?: () => void;
};
