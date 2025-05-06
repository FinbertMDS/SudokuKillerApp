import {storage} from '.';
import {InitGame, SavedGame} from '../types';
import {
  STORAGE_KEY_INIT_GAME,
  STORAGE_KEY_SAVED_GAME,
} from '../utils/constants';

export const saveInitGame = (game: InitGame) =>
  storage.set(STORAGE_KEY_INIT_GAME, JSON.stringify(game));

export const getInitGame = (): InitGame | null => {
  const json = storage.getString(STORAGE_KEY_INIT_GAME);
  return json ? JSON.parse(json) : null;
};

export const saveSavedGame = (game: SavedGame) =>
  storage.set(STORAGE_KEY_SAVED_GAME, JSON.stringify(game));

export const getSavedGame = (): SavedGame | null => {
  const json = storage.getString(STORAGE_KEY_SAVED_GAME);
  return json ? JSON.parse(json) : null;
};

export const clearGameData = () => {
  storage.delete(STORAGE_KEY_INIT_GAME);
  storage.delete(STORAGE_KEY_SAVED_GAME);
};
