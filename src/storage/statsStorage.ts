import {storage} from '.';
import {DailyStats, GameLogEntry, GameStatsCache} from '../types';
import {
  STORAGE_KEY_DAILY_STATS,
  STORAGE_KEY_GAME_LOGS,
  STORAGE_KEY_GAME_STATS_CACHE,
  STORAGE_KEY_LAST_STATS_CACHE_UPDATE,
} from '../utils/constants';
import {getTodayDateString} from '../utils/dateUtil';

export const saveGameLogs = (logs: GameLogEntry[]) =>
  storage.set(STORAGE_KEY_GAME_LOGS, JSON.stringify(logs));

export const getGameLogs = (): GameLogEntry[] => {
  const json = storage.getString(STORAGE_KEY_GAME_LOGS);
  return json ? JSON.parse(json) : [];
};

export const saveStatsCache = (cache: GameStatsCache) =>
  storage.set(STORAGE_KEY_GAME_STATS_CACHE, JSON.stringify(cache));

export const getStatsCache = (): GameStatsCache => {
  const json = storage.getString(STORAGE_KEY_GAME_STATS_CACHE);
  return json ? JSON.parse(json) : {};
};

export const saveDailyStats = (dailyStats: DailyStats[]) =>
  storage.set(STORAGE_KEY_DAILY_STATS, JSON.stringify(dailyStats));

export const getDailyStats = (): DailyStats[] => {
  const json = storage.getString(STORAGE_KEY_DAILY_STATS);
  return json ? JSON.parse(json) : [];
};

export const setLastStatsCacheUpdate = () => {
  const today = getTodayDateString(); // ví dụ: '2025-05-07'
  storage.set(STORAGE_KEY_LAST_STATS_CACHE_UPDATE, today);
};

export const getLastStatsCacheUpdate = (): string | null => {
  return storage.getString(STORAGE_KEY_LAST_STATS_CACHE_UPDATE) || null;
};

export const clearStatsData = () => {
  storage.delete(STORAGE_KEY_DAILY_STATS);
  storage.delete(STORAGE_KEY_GAME_LOGS);
  storage.delete(STORAGE_KEY_GAME_STATS_CACHE);
  storage.delete(STORAGE_KEY_LAST_STATS_CACHE_UPDATE);
};
