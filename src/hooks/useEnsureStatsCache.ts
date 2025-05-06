import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect} from 'react';

// Giả định bạn có sẵn hàm này để lấy tất cả logs
import {GameStatsManager} from '../services/GameStatsManager';
import {TimeRange} from '../types';
import {STORAGE_KEY_LAST_STATS_CACHE_UPDATE} from '../utils/constants';
import {getTodayDateString} from '../utils/dateUtil';

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
        await GameStatsManager.updateStatsWithAllCache(allLogs, affectedRanges);

        await AsyncStorage.setItem(
          STORAGE_KEY_LAST_STATS_CACHE_UPDATE,
          getTodayDateString(),
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
