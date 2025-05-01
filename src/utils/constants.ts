import {Level} from '../types';

export const LEVELS = ['easy', 'medium', 'hard', 'expert'] as Level[];

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
export const STORAGE_KEY_LANG_KEY_DEFAULT = 'defaultLanguage';
export const STORAGE_KEY_LANG_KEY_PREFERRED = 'preferredLanguage';

export const CHART_WIDTH = 60;
export const CHART2_WIDTH = 70;

export const LANGUAGES = [
  {code: 'en', label: 'English'},
  {code: 'vi', label: 'Tiếng Việt'},
  {code: 'ja', label: '日本語'},
];
