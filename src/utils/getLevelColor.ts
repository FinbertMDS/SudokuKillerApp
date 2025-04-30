// getLevelColor.ts

import { ColorSchemeName } from 'react-native';
import { Level } from '../types';

const levelColors: Record<Level, { light: string; dark: string }> = {
  easy: {
    light: '#4ade80', // green-400
    dark: '#22c55e',  // green-500
  },
  medium: {
    light: '#60a5fa', // blue-400
    dark: '#3b82f6',  // blue-500
  },
  hard: {
    light: '#facc15', // yellow-400
    dark: '#eab308',  // yellow-500
  },
  expert: {
    light: '#f87171', // red-400
    dark: '#ef4444',  // red-500
  },
};

export function getLevelColor(level: Level, scheme: ColorSchemeName = 'light'): string {
  return levelColors[level][scheme!];
}
