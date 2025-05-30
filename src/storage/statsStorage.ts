import {storage} from '.';
import {
  DailyStats,
  GameLogEntry,
  GameLogEntryV2,
  GameStatsCache,
} from '../types';
import {
  STORAGE_KEY_DAILY_STATS,
  STORAGE_KEY_GAME_LOGS,
  STORAGE_KEY_GAME_STATS_CACHE,
  STORAGE_KEY_LAST_STATS_CACHE_UPDATE,
} from '../utils/constants';
import {getTodayDateString} from '../utils/dateUtil';

const saveGameLogs = (logs: GameLogEntry[]) =>
  storage.set(STORAGE_KEY_GAME_LOGS, JSON.stringify(logs));

const getGameLogs = (): GameLogEntry[] => {
  const json = storage.getString(STORAGE_KEY_GAME_LOGS);
  return json ? JSON.parse(json) : [];
};

const saveGameLogsV2 = (logs: GameLogEntryV2[]) =>
  storage.set(STORAGE_KEY_GAME_LOGS, JSON.stringify(logs));

const getGameLogsV2 = (): GameLogEntryV2[] => {
  const json = storage.getString(STORAGE_KEY_GAME_LOGS);
  return json ? JSON.parse(json) : [];
};

const saveStatsCache = (cache: GameStatsCache) =>
  storage.set(STORAGE_KEY_GAME_STATS_CACHE, JSON.stringify(cache));

const getStatsCache = (): GameStatsCache => {
  const json = storage.getString(STORAGE_KEY_GAME_STATS_CACHE);
  return json ? JSON.parse(json) : {};
};

const saveDailyStats = (dailyStats: DailyStats[]) =>
  storage.set(STORAGE_KEY_DAILY_STATS, JSON.stringify(dailyStats));

const getDailyStats = (): DailyStats[] => {
  const json = storage.getString(STORAGE_KEY_DAILY_STATS);
  return json ? JSON.parse(json) : [];
};

const setLastStatsCacheUpdate = () => {
  const today = getTodayDateString();
  storage.set(STORAGE_KEY_LAST_STATS_CACHE_UPDATE, today);
};

const getLastStatsCacheUpdate = (): string | null => {
  return storage.getString(STORAGE_KEY_LAST_STATS_CACHE_UPDATE) || null;
};

const clearStatsData = () => {
  storage.delete(STORAGE_KEY_DAILY_STATS);
  storage.delete(STORAGE_KEY_GAME_LOGS);
  storage.delete(STORAGE_KEY_GAME_STATS_CACHE);
  storage.delete(STORAGE_KEY_LAST_STATS_CACHE_UPDATE);
};

export const statsStorage = {
  saveGameLogs,
  getGameLogs,
  saveGameLogsV2,
  getGameLogsV2,
  saveStatsCache,
  getStatsCache,
  saveDailyStats,
  getDailyStats,
  setLastStatsCacheUpdate,
  getLastStatsCacheUpdate,
  clearStatsData,
};
