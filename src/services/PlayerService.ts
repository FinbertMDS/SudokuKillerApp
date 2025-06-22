import {playerProfileStorage} from '../storage';
import {createDefaultPlayer} from '../utils/playerUtil';

export const PlayerService = {
  async createDefaultPlayerIfNeeded(): Promise<void> {
    const players = playerProfileStorage.getAllPlayers();
    if (players.length === 0) {
      const player = createDefaultPlayer();
      playerProfileStorage.savePlayers([player]);
      playerProfileStorage.setCurrentPlayerId(player.id);
    }
  },

  async clear(): Promise<void> {
    playerProfileStorage.clearAll();
  },
};
