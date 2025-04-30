import { Level } from '../types';

export const LEVELS = [
  'easy',
  'medium',
  'hard',
  'expert',
] as Level[];

export const SCREENS = {
  MAIN: 'Main',
  BOARD: 'Board',
  SETTINGS: 'Settings',
  STATISTICS: 'Statistics',
} as const;

export const BOARD_SIZE = 9;
export const CELL_SIZE = 40;
export const MAX_TIMEPLAYED = 2 * 60 * 60; // in seconds
export const MAX_MISTAKES = 5;
export const CAGE_PADDING = 3;

export const ANIMATION_DURATION = 300; // in ms
export const ANIMATION_CELL_KEY_SEPARATOR = '-';
export const ANIMATION_TYPE = {
  ROW: 1,
  COL: 2,
  ROW_COL: 3,
  NONE: 0,
} as const;

// Game Storage Keys
export const STORAGE_KEY_INIT_GAME = 'initGame';
export const STORAGE_KEY_SAVED_GAME = 'savedGame';
export const STORAGE_KEY_GAME_STATS = 'gameStats';
export const STORAGE_KEY_GAME_LOGS = 'gameLogs';

export const CHART_WIDTH = 60;
export const CHART2_WIDTH = 70;

export const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientTo: '#08130D',
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: () => '#ccc',
};
// const chartConfig = {
//   backgroundGradientFrom: '#1E1E1E',
//   backgroundGradientTo: '#1E1E1E',
//   decimalPlaces: 0,
//   color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
//   labelColor: () => '#ccc',
// };
