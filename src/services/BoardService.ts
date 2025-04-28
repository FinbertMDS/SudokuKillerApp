import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedGame } from '../types';

const STORAGE_KEY = 'savedGame';

export const BoardService = {
  async save(state: SavedGame) {
    try {
      let data = await this.load();
      if (data) {
        data = {
          ...data,
          ...state,
          lastSaved: new Date(),
        };
      } else {
        data = {
          ...state,
          lastSaved: new Date(),
        };
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log('Game state saved successfully');
    } catch (e) {
      console.error('Failed to save game:', e);
    }
  },

  async load(): Promise<SavedGame | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to load game:', e);
      return null;
    }
  },

  async clear() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      console.log('Saved game cleared');
    } catch (e) {
      console.error('Failed to clear saved game:', e);
    }
  }
};
