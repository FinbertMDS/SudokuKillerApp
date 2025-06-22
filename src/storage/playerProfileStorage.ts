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

const clearPlayers = () => {
  try {
    storage.delete(STORAGE_KEY_PLAYERS);
  } catch (_) {}
};

const getCurrentPlayerId = (): string => {
  const id = storage.getString(STORAGE_KEY_CURRENT_PLAYER_ID);
  return id || DEFAULT_PLAYER_ID;
};

const setCurrentPlayerId = (id: string) =>
  storage.set(STORAGE_KEY_CURRENT_PLAYER_ID, id);

const clearCurrentPlayerId = () => {
  try {
    storage.delete(STORAGE_KEY_CURRENT_PLAYER_ID);
  } catch (_) {}
};

const getCurrentPlayer = (): PlayerProfile | null => {
  const id = getCurrentPlayerId();
  const all = getAllPlayers();
  return all.find(p => p.id === id) || null;
};

const getPlayerById = (id: string): PlayerProfile | null => {
  const all = getAllPlayers();
  return all.find(p => p.id === id) || null;
};

const updatePlayer = (player: PlayerProfile) => {
  const all = getAllPlayers();
  const updated = all.map(p => (p.id === player.id ? player : p));
  savePlayers(updated);
};

const clearAll = () => {
  try {
    clearPlayers();
    clearCurrentPlayerId();
  } catch (_) {}
};

export const playerProfileStorage = {
  getAllPlayers,
  savePlayers,
  getCurrentPlayerId,
  setCurrentPlayerId,
  getCurrentPlayer,
  clearCurrentPlayerId,
  clearPlayers,
  clearAll,
  getPlayerById,
  updatePlayer,
};
