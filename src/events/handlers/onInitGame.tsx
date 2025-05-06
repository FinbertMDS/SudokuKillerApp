import {CORE_EVENTS} from '..';
import {generateBoard} from '../../utils/boardUtil';
import eventBus from '../eventBus';
import {InitGameCoreEvent} from '../types';

export const handleInitGame = async (payload: InitGameCoreEvent) => {
  const initGame = generateBoard(payload.level);
  eventBus.emit(CORE_EVENTS.gameStarted, {initGame});
};
