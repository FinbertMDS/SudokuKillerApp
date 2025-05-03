import {GameStatsManager} from '../../services/GameStatsManager';

export const handleUpdateStatistics = async () => {
  const allLogs = await GameStatsManager.getLogs();
  await GameStatsManager.updateStatsWithCache(allLogs, [
    'today',
    'week',
    'month',
    'year',
    'all',
  ]);
};
