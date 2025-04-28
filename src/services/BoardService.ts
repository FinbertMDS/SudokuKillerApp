import AsyncStorage from '@react-native-async-storage/async-storage';
import { InitGame, SavedGame } from '../types';

const STORAGE_KEY_INIT_GAME = 'initGame';
const STORAGE_KEY_SAVED_GAME = 'savedGame';

export const BoardService = {
  async save(state: SavedGame | InitGame) {
    try {
      if ('initialBoard' in state) {
        await AsyncStorage.setItem(STORAGE_KEY_INIT_GAME, JSON.stringify(state));
      } else if ('savedBoard' in state) {
        await AsyncStorage.setItem(STORAGE_KEY_SAVED_GAME, JSON.stringify(state));
      }
    } catch (e) {
      console.error('Failed to save game:', e);
    }
  },

  async loadInit(): Promise<InitGame | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY_INIT_GAME);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to load game:', e);
      return null;
    }
  },

  async loadSaved(): Promise<SavedGame | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY_SAVED_GAME);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to load game:', e);
      return null;
    }
  },

  async clear() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY_INIT_GAME);
      await AsyncStorage.removeItem(STORAGE_KEY_SAVED_GAME);
    } catch (e) {
      console.error('Failed to clear saved game:', e);
    }
  },
};
