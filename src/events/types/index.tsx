import {AppSettings, GameLogEntry, InitGame, Level} from '../../types';

export type DynamicEvents = Record<string, any>;
export type AppEvents = CoreEvents & DynamicEvents;

export type GameStartedCoreEvent = {
  initGame: InitGame | null;
};

export type GameEndedCoreEvent = {
  id: string;
  level: Level;
  timePlayed: number;
  mistakes: number;
};

export type CoreEvents = {
  gameStarted: GameStartedCoreEvent;
  gameEnded: GameEndedCoreEvent;
  statisticsUpdated: GameLogEntry[];
  settingsUpdated: AppSettings;
  clearStorage: void;
};
