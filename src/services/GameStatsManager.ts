// GameStatsManager.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Level } from '../types';
import { STORAGE_KEY_GAME_STATS } from '../utils/constants';

export interface GameStats {
  gamesStarted: number;
  gamesCompleted: number;
  bestTimeSeconds: number | null;
  averageTimeSeconds: number | null;
  totalTimeSeconds: number;
}

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
};

