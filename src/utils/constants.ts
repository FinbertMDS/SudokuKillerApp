export const DIFFICULTY_ALL = [
  'easy',
  'medium',
  'hard',
  'expert',
];

export const SCREENS = {
  MAIN: 'Main',
  BOARD: 'Board',
  SETTINGS: 'Settings',
  STATISTICS: 'Statistics',
} as const;

export const BOARD_SIZE = 9;
export const CELL_SIZE = 40;
export const TIMEOUT_DURATION = 2 * 60 * 60 * 1000; // 2h
export const MAX_MISTAKES = 5;
export const CAGE_PADDING = 3;
