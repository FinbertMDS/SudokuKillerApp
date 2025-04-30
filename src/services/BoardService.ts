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
        const savedGame = await this.loadSaved();
        if (savedGame) {
          let updatedSavedGame: SavedGame = {
            ...savedGame,
            ...state,
            lastSaved: new Date(),
          };
          await AsyncStorage.setItem(STORAGE_KEY_SAVED_GAME, JSON.stringify(updatedSavedGame));
        } else {
          await AsyncStorage.setItem(STORAGE_KEY_SAVED_GAME, JSON.stringify(state));
        }
      }
    } catch (e) {
      console.error('Failed to save game:', e);
    }
  },

  async saveTimePlayed(seconds: number) {
    try {
      const savedGame = await this.loadSaved();
      if (savedGame) {
        savedGame.savedTimePlayed = seconds; // Update the saved elapsed time
        await AsyncStorage.setItem(STORAGE_KEY_SAVED_GAME, JSON.stringify(savedGame));
      }
    } catch (e) {
      console.error('Failed to save time played:', e);
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

  async loadSavedTimePlayed(): Promise<number> {
    try {
      const savedGame = await this.loadSaved();
      if (savedGame) {
        return savedGame.savedTimePlayed;
      }
      return 0; // Default to 0 if no saved game is found
    } catch (e) {
      console.error('Failed to load saved time played:', e);
      return 0; // Default to 0 in case of error
    }
  },
  async loadSavedMistakeCount(): Promise<number> {
    try {
      const savedGame = await this.loadSaved();
      if (savedGame) {
        return savedGame.savedMistakeCount;
      }
      return 0; // Default to 0 if no saved game is found
    } catch (e) {
      console.error('Failed to load saved mistake count:', e);
      return 0; // Default to 0 in case of error
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

  async clearSavedTimePlayed() {
    try {
      const savedGame = await this.loadSaved();
      if (savedGame) {
        savedGame.savedTimePlayed = 0; // Reset the saved elapsed time
        await AsyncStorage.setItem(STORAGE_KEY_SAVED_GAME, JSON.stringify(savedGame));
      }
    } catch (e) {
      console.error('Failed to clear time played:', e);
    }
  },
};
