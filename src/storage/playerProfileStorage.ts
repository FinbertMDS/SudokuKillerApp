// storage/playerProfileStorage.ts
import {storage} from '.';
import {PlayerProfile} from '../types/player';
import {
  DEFAULT_PLAYER_ID,
  STORAGE_KEY_CURRENT_PLAYER_ID,
  STORAGE_KEY_PLAYERS,
} from '../utils/constants';

const getAllPlayers = (): PlayerProfile[] => {
  const raw = storage.getString(STORAGE_KEY_PLAYERS);
  return raw ? JSON.parse(raw) : [];
};

const savePlayers = (players: PlayerProfile[]) => {
  storage.set(STORAGE_KEY_PLAYERS, JSON.stringify(players));
};

const getCurrentPlayerId = (): string => {
  const id = storage.getString(STORAGE_KEY_CURRENT_PLAYER_ID);
  return id || DEFAULT_PLAYER_ID;
};

const setCurrentPlayerId = (id: string) =>
  storage.set(STORAGE_KEY_CURRENT_PLAYER_ID, id);

const getCurrentPlayer = (): PlayerProfile | null => {
  const id = getCurrentPlayerId();
  const all = getAllPlayers();
  return all.find(p => p.id === id) || null;
};

const clearAll = () => {
  try {
    storage.delete(STORAGE_KEY_PLAYERS);
    storage.delete(STORAGE_KEY_CURRENT_PLAYER_ID);
  } catch (_) {}
};

export const playerProfileStorage = {
  getAllPlayers,
  savePlayers,
  getCurrentPlayerId,
  setCurrentPlayerId,
  getCurrentPlayer,
  clearAll,
};
