export * from './setupEventListeners';

export const CORE_EVENTS = {
  gameStarted: 'gameStarted',
  gameEnded: 'gameEnded',
  statisticsUpdated: 'statisticsUpdated',
  settingsUpdated: 'settingsUpdated',
  clearStorage: 'clearStorage',
} as const;
