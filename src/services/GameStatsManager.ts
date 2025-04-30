// GameStatsManager.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyStats, GameLogEntry, GameStats, Level } from '../types';
import { STORAGE_KEY_GAME_LOGS, STORAGE_KEY_GAME_STATS } from '../utils/constants';

export const GameStatsManager = {
  async getStats(): Promise<Record<Level, GameStats>> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY_GAME_STATS);
      if (json) {
        return JSON.parse(json);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }

    // Initialize default stats if none exist
    return {
      easy: this.createEmptyStats(),
      medium: this.createEmptyStats(),
      hard: this.createEmptyStats(),
      expert: this.createEmptyStats(),
    };
  },

  async saveStats(stats: Record<Level, GameStats>) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_GAME_STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  },

  async getLogs(): Promise<GameLogEntry[]> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY_GAME_LOGS);
      if (json) {
        return JSON.parse(json);
      }
    } catch (error) {
      console.error('Error loading logs:', error);
    }
    return [];
  },

  async saveLog(log: GameLogEntry) {
    try {
      const existing = await this.getLogs();
      existing.push(log);
      await AsyncStorage.setItem(STORAGE_KEY_GAME_LOGS, JSON.stringify(existing));
    } catch (error) {
      console.error('Error saving logs:', error);
    }
  },

  async saveLogs(logs: GameLogEntry[]) {
    try {
      const existing = await this.getLogs();
      const updated = [...existing, ...logs];
      await AsyncStorage.setItem(STORAGE_KEY_GAME_LOGS, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving logs:', error);
    }
  },

  createEmptyStats(): GameStats {
    return {
      gamesStarted: 0,
      gamesCompleted: 0,
      bestTimeSeconds: null,
      averageTimeSeconds: null,
      totalTimeSeconds: 0,
    };
  },

  async recordGameStart(level: Level) {
    const stats = await this.getStats();
    stats[level].gamesStarted++;
    await this.saveStats(stats);
  },

  async recordGameWin(level: Level, timeSeconds: number) {
    const stats = await this.getStats();
    const s = stats[level];

    s.gamesCompleted++;
    s.totalTimeSeconds += timeSeconds;

    if (s.bestTimeSeconds === null || timeSeconds < s.bestTimeSeconds) {
      s.bestTimeSeconds = timeSeconds;
    }

    if (s.gamesCompleted > 0) {
      s.averageTimeSeconds = Math.floor(s.totalTimeSeconds / s.gamesCompleted);
    }

    await this.saveStats(stats);

    // 👉 Record daily log
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    const newEntry: GameLogEntry = {
      level,
      date: today,
      durationSeconds: timeSeconds,
    };

    await this.saveLog(newEntry);
  },

  async resetStats() {
    const defaultStats = {
      easy: this.createEmptyStats(),
      medium: this.createEmptyStats(),
      hard: this.createEmptyStats(),
      expert: this.createEmptyStats(),
    };
    await this.saveStats(defaultStats);
  },

  async getDailyStats(): Promise<DailyStats[]> {
    const logs: GameLogEntry[] = await this.getLogs();

    if (logs.length === 0) {
      return [];
    }
    const map = new Map<string, { games: number; time: number }>();

    for (const entry of logs) {
      if (!map.has(entry.date)) {
        map.set(entry.date, { games: 0, time: 0 });
      }
      const stat = map.get(entry.date)!;
      stat.games += 1;
      stat.time += entry.durationSeconds;
    }

    const result: DailyStats[] = [];
    for (const [date, data] of map.entries()) {
      result.push({
        date,
        games: data.games,
        totalTimeSeconds: data.time,
      });
    }

    // Sắp xếp theo ngày gần nhất lên đầu
    return result.sort((a, b) => b.date.localeCompare(a.date));
  },

  async resetStatistics() {
    try {
      await this.resetStats();
      await AsyncStorage.removeItem(STORAGE_KEY_GAME_LOGS);
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  },
};

