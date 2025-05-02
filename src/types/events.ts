import {AppSettings} from '.';

export type CoreEvents = {
  gameStarted: {level: string; timestamp: number};
  gameEnded: {level: string; timePlayed: number; mistakes: number};
  statisticsUpdated: void;
  settingsUpdated: AppSettings;
};

export const CORE_EVENTS = {
  gameStarted: 'gameStarted',
  gameEnded: 'gameEnded',
  statisticsUpdated: 'statisticsUpdated',
  settingsUpdated: 'settingsUpdated',
} as const;
