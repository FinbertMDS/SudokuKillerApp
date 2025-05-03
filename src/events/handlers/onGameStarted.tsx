import {BoardService} from '../../services/BoardService';
import {GameStatsManager} from '../../services/GameStatsManager';
import {GameStartedCoreEvent} from '../types';

export const handleGameStarted = async ({initGame}: GameStartedCoreEvent) => {
  if (initGame) {
    await BoardService.save(initGame);
    await GameStatsManager.recordGameStart(initGame.savedLevel);
  }
};
