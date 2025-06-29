import {Level} from '../types';

export const LEVELS = ['easy', 'medium', 'hard', 'expert'] as const;
export const LEVEL_PRIORITY: Level[] = LEVELS.slice().reverse();
export const LEVEL_WEIGHT: Record<string, number> = {
  expert: 4,
  hard: 3,
  medium: 2,
  easy: 1,
};

export const SHOW_UNSPLASH_IMAGE_INFO = false;
export const IS_UI_TESTING = false;

export const MAX_TIMEPLAYED = 3 * 60 * 60; // in seconds
export const MAX_MISTAKES = 5;
export const MAX_HINTS = 5;

export const LANGUAGES = [
  {code: 'en', label: 'English'},
  {code: 'vi', label: 'Tiếng Việt'},
  {code: 'ja', label: '日本語'},
];

export const CELLS_TO_REMOVE_RANGE: Record<Level, number[]> = {
  easy: [30, 34],
  medium: [40, 46],
  hard: [50, 54],
  expert: [60, 64],
};
