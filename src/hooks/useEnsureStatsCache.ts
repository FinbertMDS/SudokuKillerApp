import {useEffect} from 'react';

// Giả định bạn có sẵn hàm này để lấy tất cả logs
import {GameStatsManager} from '../services/GameStatsManager';
import {playerProfileStorage, statsStorage} from '../storage';
import {TimeRange} from '../types';

export function useEnsureStatsCache() {
  const updateStatsCache = async (): Promise<boolean> => {
    try {
      const needsUpdate = await GameStatsManager.shouldUpdateStatsCache();

      if (needsUpdate) {
        const affectedRanges: TimeRange[] = [
          'today',
          'week',
          'month',
          'year',
          'all',
        ];

        const allLogs = await GameStatsManager.getLogs();
        const userId = playerProfileStorage.getCurrentPlayerId();
        await GameStatsManager.updateStatsWithAllCache(
          allLogs,
          affectedRanges,
          userId,
        );

        statsStorage.setLastStatsCacheUpdate();
        statsStorage.setLastStatsCacheUpdateUserId(
          playerProfileStorage.getCurrentPlayerId(),
        );
      }
      return needsUpdate;
    } catch (err) {
      console.warn('Failed to ensure stats cache:', err);
    }
    return false;
  };

  useEffect(() => {
    updateStatsCache();
  }, []);

  return {
    updateStatsCache,
  };
}
