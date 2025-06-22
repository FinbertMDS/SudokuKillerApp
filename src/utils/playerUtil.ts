import uuid from 'react-native-uuid';
import {PlayerProfile} from '../types/player';
import {DEFAULT_PLAYER_ID} from './constants';

const generatePlayerId = () => {
  let id = uuid.v4().toString();
  while (id === DEFAULT_PLAYER_ID) {
    id = uuid.v4().toString();
  }
  return id;
};

export const createNewPlayer = (name: string): PlayerProfile => ({
  id: generatePlayerId(),
  name,
  avatarColor: '#000000', //getRandomColor(),
  createdAt: new Date().toISOString(),
  totalGames: 0,
});
