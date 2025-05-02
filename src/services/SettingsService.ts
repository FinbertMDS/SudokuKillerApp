// SettingsService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppSettings} from '../types';
import {DEFAULT_SETTINGS, STORAGE_KEY_SETTINGS} from '../utils/constants';

export const SettingsService = {
  normalizeSettings(settings: AppSettings): AppSettings {
    const normalized = {...settings};

    // Nếu mistakeLimit bị tắt ➝ autoCheckMistake cũng phải tắt
    if (!normalized.mistakeLimit) {
      normalized.autoCheckMistake = false;
    }

    return normalized;
  },

  async save(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY_SETTINGS,
        JSON.stringify(settings),
      );
    } catch (err) {
      console.error('Failed to save settings', err);
    }
  },

  async load(): Promise<AppSettings> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY_SETTINGS);
      if (json) {
        return JSON.parse(json) as AppSettings;
      }
    } catch (err) {
      console.error('Failed to load settings', err);
    }
    return DEFAULT_SETTINGS;
  },

  async update(partial: Partial<AppSettings>): Promise<void> {
    const current = await SettingsService.load();
    const updated = {...current, ...partial};
    await SettingsService.save(updated);
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY_SETTINGS);
    } catch (err) {
      console.error('Failed to clear settings', err);
    }
  },
};
