import {GameStatsManager} from '../../services/GameStatsManager';
import {GameLogEntryV2, TimeRange} from '../../types/stats';
import {DEFAULT_PLAYER_ID} from '../../utils/constants';
import {statsStorage} from '../statsStorage';

export async function migrateGameLogsEntryV2() {
  console.log('[MIGRATION] Migrating game logs entry v2...');
  const rawLogs = statsStorage.getGameLogs();
  const migrated = rawLogs.map(
    entry =>
      ({
        ...entry,
        playerId: DEFAULT_PLAYER_ID,
      } as GameLogEntryV2),
  );
  statsStorage.saveGameLogsV2(migrated);

  // update last stats cache update user id
  const affectedRanges: TimeRange[] = ['today', 'week', 'month', 'year', 'all'];

  const allLogs = await GameStatsManager.getLogs();
  await GameStatsManager.updateStatsWithAllCache(
    allLogs,
    affectedRanges,
    DEFAULT_PLAYER_ID,
  );

  statsStorage.setLastStatsCacheUpdate();
  statsStorage.setLastStatsCacheUpdateUserId(DEFAULT_PLAYER_ID);

  console.log('[MIGRATION] Game logs entry v2 migrated');
}
