import {PlayerService} from '../../services/PlayerService';

export const handleSwitchPlayer = async (playerId: string) => {
  await PlayerService.handleSwitchPlayer(playerId);
};
