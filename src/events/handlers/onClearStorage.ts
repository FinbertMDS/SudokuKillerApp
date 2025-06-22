import {BackgroundService} from '../../services/BackgroundService';
import {BoardService} from '../../services/BoardService';
import {GameStatsManager} from '../../services/GameStatsManager';
import {PlayerService} from '../../services/PlayerService';
import {SettingsService} from '../../services/SettingsService';

export const handleClearStorage = async () => {
  BoardService.clear();
  GameStatsManager.resetStatistics();
  SettingsService.clear();
  if (!__DEV__) {
    BackgroundService.clear();
  }
  await PlayerService.clear();
  await PlayerService.createDefaultPlayerIfNeeded();
};
