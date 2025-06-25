import {BoardService} from '../../services/BoardService';
import {GameStatsManager} from '../../services/GameStatsManager';
import {TimeRange} from '../../types';

export const handleSwitchPlayer = async (playerId: string) => {
  const savedGame = await BoardService.loadSaved();
  if (savedGame) {
    let log = await GameStatsManager.getLog(savedGame.savedId);
    if (log) {
      log = {
        ...log,
        completed: false,
        endTime: new Date().toISOString(),
        durationSeconds: savedGame.savedTimePlayed,
        mistakes: savedGame.savedMistake,
        hintCount: savedGame.savedHintCount,
      };
      await GameStatsManager.saveLog(log, true);
    }
  }

  await BoardService.clear();

  const affectedRanges: TimeRange[] = ['today', 'week', 'month', 'year', 'all'];

  const allLogsByPlayerId = await GameStatsManager.getLogsByPlayerId(playerId);
  await GameStatsManager.updateStatsWithAllCache(
    allLogsByPlayerId,
    affectedRanges,
    playerId,
  );

  await GameStatsManager.updateStatsDone();
};
