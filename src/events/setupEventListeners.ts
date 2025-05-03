import {CORE_EVENTS} from '.';
import eventBus from './eventBus';
import {handleClearStorage} from './handlers/onClearStorage';
import {handleGameEnded} from './handlers/onGameEnded';
import {handleGameStarted} from './handlers/onGameStarted';
import {handleUpdateStatistics} from './handlers/onUpdateStatistics';

export const setupEventListeners = () => {
  eventBus.on(CORE_EVENTS.gameStarted, handleGameStarted);
  eventBus.on(CORE_EVENTS.gameEnded, handleGameEnded);
  eventBus.on(CORE_EVENTS.statisticsUpdated, handleUpdateStatistics);
  eventBus.on(CORE_EVENTS.clearStorage, handleClearStorage);
};
