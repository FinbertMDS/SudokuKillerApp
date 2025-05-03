import {CORE_EVENTS} from '..';
import {BoardService} from '../../services/BoardService';
import {GameStatsManager} from '../../services/GameStatsManager';
import eventBus from '../eventBus';
import {GameStartedCoreEvent} from '../types';

export const handleGameStarted = async ({initGame}: GameStartedCoreEvent) => {
  if (initGame) {
    await BoardService.save(initGame);
    const updatedLog = await GameStatsManager.recordGameStart(initGame!);
    eventBus.emit(CORE_EVENTS.statisticsUpdated, [updatedLog]);
  }
};
