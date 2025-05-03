// SettingsService.ts
import {UNSPLASH_ACCESS_KEY} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {DailyBackgrounds} from '../types';
import {STORAGE_KEY_BACKGROUNDS} from '../utils/constants';

export const BackgroundService = {
  async load(): Promise<DailyBackgrounds | null> {
    const cached = await AsyncStorage.getItem(STORAGE_KEY_BACKGROUNDS);
    if (cached) {
      try {
        const {date, light, dark} = JSON.parse(cached);
        return {date, light, dark};
      } catch (error) {
        console.error('Failed to load background', error);
      }
    }
    return null;
  },

  async save(data: DailyBackgrounds) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_BACKGROUNDS, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to save background', err);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY_BACKGROUNDS);
    } catch (err) {
      console.error('Failed to clear background', err);
    }
  },

  async fetchUnsplashImage(query: string): Promise<string | null> {
    try {
      const res = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
          query,
          orientation: 'portrait',
        },
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      });
      return res.data?.urls?.regular ?? null;
    } catch (err) {
      console.warn('Unsplash fetch failed:', query, err);
      return null;
    }
  },
};
