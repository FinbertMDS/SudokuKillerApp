import {storage} from '.';
import {InitGame, SavedGame} from '../types';
import {
  STORAGE_KEY_INIT_GAME,
  STORAGE_KEY_SAVED_GAME,
} from '../utils/constants';

const saveInitGame = (game: InitGame) =>
  storage.set(STORAGE_KEY_INIT_GAME, JSON.stringify(game));

const getInitGame = (): InitGame | null => {
  const json = storage.getString(STORAGE_KEY_INIT_GAME);
  return json ? JSON.parse(json) : null;
};

const saveSavedGame = (game: SavedGame) =>
  storage.set(STORAGE_KEY_SAVED_GAME, JSON.stringify(game));

const getSavedGame = (): SavedGame | null => {
  const json = storage.getString(STORAGE_KEY_SAVED_GAME);
  return json ? JSON.parse(json) : null;
};

const clearGameData = () => {
  storage.delete(STORAGE_KEY_INIT_GAME);
  storage.delete(STORAGE_KEY_SAVED_GAME);
};

export const gameStorage = {
  saveInitGame,
  getInitGame,
  saveSavedGame,
  getSavedGame,
  clearGameData,
};
