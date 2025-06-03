import {storage} from '.';
import {DailyStats, GameLogEntry, GameStatsCache} from '../types';
import {
  STORAGE_KEY_DAILY_STATS,
  STORAGE_KEY_GAME_LOGS,
  STORAGE_KEY_GAME_STATS_CACHE,
  STORAGE_KEY_LAST_STATS_CACHE_UPDATE,
} from '../utils/constants';
import {getTodayDateString} from '../utils/dateUtil';

const saveGameLogs = (logs: GameLogEntry[]) => {
  try {
    storage.set(STORAGE_KEY_GAME_LOGS, JSON.stringify(logs));
  } catch (_) {}
};

const getGameLogs = (): GameLogEntry[] => {
  try {
    const json = storage.getString(STORAGE_KEY_GAME_LOGS);
    return json ? JSON.parse(json) : [];
  } catch (_) {
    return [];
  }
};

const saveStatsCache = (cache: GameStatsCache) => {
  try {
    storage.set(STORAGE_KEY_GAME_STATS_CACHE, JSON.stringify(cache));
  } catch (_) {}
};

const getStatsCache = (): GameStatsCache => {
  try {
    const json = storage.getString(STORAGE_KEY_GAME_STATS_CACHE);
    return json ? JSON.parse(json) : {};
  } catch (_) {
    return {};
  }
};

const saveDailyStats = (dailyStats: DailyStats[]) => {
  try {
    storage.set(STORAGE_KEY_DAILY_STATS, JSON.stringify(dailyStats));
  } catch (_) {}
};

const getDailyStats = (): DailyStats[] => {
  try {
    const json = storage.getString(STORAGE_KEY_DAILY_STATS);
    return json ? JSON.parse(json) : [];
  } catch (_) {
    return [];
  }
};

const setLastStatsCacheUpdate = () => {
  const today = getTodayDateString();
  try {
    storage.set(STORAGE_KEY_LAST_STATS_CACHE_UPDATE, today);
  } catch (_) {}
};

const getLastStatsCacheUpdate = (): string | null => {
  try {
    return storage.getString(STORAGE_KEY_LAST_STATS_CACHE_UPDATE) || null;
  } catch (_) {
    return null;
  }
};

const clearStatsData = () => {
  try {
    storage.delete(STORAGE_KEY_DAILY_STATS);
    storage.delete(STORAGE_KEY_GAME_LOGS);
    storage.delete(STORAGE_KEY_GAME_STATS_CACHE);
    storage.delete(STORAGE_KEY_LAST_STATS_CACHE_UPDATE);
  } catch (_) {}
};

export const statsStorage = {
  saveGameLogs,
  getGameLogs,
  saveStatsCache,
  getStatsCache,
  saveDailyStats,
  getDailyStats,
  setLastStatsCacheUpdate,
  getLastStatsCacheUpdate,
  clearStatsData,
};
