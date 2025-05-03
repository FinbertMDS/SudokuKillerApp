import {BoardService} from '../../services/BoardService';
import {GameStatsManager} from '../../services/GameStatsManager';
import {GameEndedCoreEvent} from '../types';

export const handleGameEnded = async ({
  level,
  timePlayed,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mistakes,
}: GameEndedCoreEvent) => {
  await BoardService.clear();
  await GameStatsManager.recordGameWin(level, timePlayed);
};
