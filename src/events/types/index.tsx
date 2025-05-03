import {AppSettings, InitGame, Level} from '../../types';

export type DynamicEvents = Record<string, any>;
export type AppEvents = CoreEvents & DynamicEvents;

export type GameStartedCoreEvent = {
  initGame: InitGame | null;
};

export type GameEndedCoreEvent = {
  level: Level;
  timePlayed: number;
  mistakes: number;
};

export type CoreEvents = {
  gameStarted: GameStartedCoreEvent;
  gameEnded: GameEndedCoreEvent;
  statisticsUpdated: void;
  settingsUpdated: AppSettings;
  clearStorage: void;
};
