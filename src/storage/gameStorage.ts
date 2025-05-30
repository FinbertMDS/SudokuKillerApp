import {storage} from '.';
import {InitGame, SavedGame} from '../types';
import {
  STORAGE_KEY_INIT_GAME,
  STORAGE_KEY_SAVED_GAME,
} from '../utils/constants';

const saveInitGame = (game: InitGame) => {
  try {
    storage.set(STORAGE_KEY_INIT_GAME, JSON.stringify(game));
  } catch (_) {}
};

const getInitGame = (): InitGame | null => {
  try {
    const json = storage.getString(STORAGE_KEY_INIT_GAME);
    return json ? JSON.parse(json) : null;
  } catch (_) {
    return null;
  }
};

const saveSavedGame = (game: SavedGame) => {
  try {
    storage.set(STORAGE_KEY_SAVED_GAME, JSON.stringify(game));
  } catch (_) {}
};

const getSavedGame = (): SavedGame | null => {
  try {
    const json = storage.getString(STORAGE_KEY_SAVED_GAME);
    return json ? JSON.parse(json) : null;
  } catch (_) {
    return null;
  }
};

const clearGameData = () => {
  try {
    storage.delete(STORAGE_KEY_INIT_GAME);
    storage.delete(STORAGE_KEY_SAVED_GAME);
  } catch (_) {}
};

const clearSavedGameData = () => {
  try {
    storage.delete(STORAGE_KEY_SAVED_GAME);
  } catch (_) {}
};

export const gameStorage = {
  saveInitGame,
  getInitGame,
  saveSavedGame,
  getSavedGame,
  clearGameData,
  clearSavedGameData,
};
