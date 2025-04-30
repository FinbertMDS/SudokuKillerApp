// useGameStats.ts

import { useCallback } from 'react';
import { GameStatsManager } from '../services/GameStatsManager';
import { Level } from '../types';

export function useGameStats(level: Level) {
  const startGame = useCallback(() => {
    GameStatsManager.recordGameStart(level);
  }, [level]);

  const completeGame = useCallback((timeSeconds: number) => {
    GameStatsManager.recordGameWin(level, timeSeconds);
  }, [level]);

  const clearStats = useCallback(() => {
    GameStatsManager.resetStats();
  }, []);

  const fetchStats = useCallback(async () => {
    return await GameStatsManager.getStats();
  }, []);

  return {
    startGame,
    completeGame,
    clearStats,
    fetchStats,
  };
}
