import {AppSettings, GameLogEntry, InitGame, Level} from '../../types';

export type DynamicEvents = Record<string, any>;
export type AppEvents = CoreEvents & DynamicEvents;

export type InitGameCoreEvent = {
  level: Level;
};

export type GameStartedCoreEvent = {
  initGame: InitGame;
};

export type GameEndedCoreEvent = {
  id: string;
  level: Level;
  timePlayed: number;
  mistakes: number;
};

export type StatisticsUpdatedCoreEvent = {
  logs: GameLogEntry[];
};

export type CoreEvents = {
  initGame: InitGameCoreEvent;
  gameStarted: GameStartedCoreEvent;
  gameEnded: GameEndedCoreEvent;
  statisticsUpdated: StatisticsUpdatedCoreEvent;
  settingsUpdated: AppSettings;
  clearStorage: void;
};
