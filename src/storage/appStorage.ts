import {AppSettings, DailyBackgrounds, DailyQuotes} from '../types';
import {
  STORAGE_KEY_BACKGROUNDS,
  STORAGE_KEY_HAS_PLAYED,
  STORAGE_KEY_LANG_KEY_DEFAULT,
  STORAGE_KEY_LANG_KEY_PREFERRED,
  STORAGE_KEY_QUOTES,
  STORAGE_KEY_SETTINGS,
} from '../utils/constants';
import {storage} from './mmkv';

// STORAGE_KEY_LANG_KEY_DEFAULT
const getLangKeyDefault = (): string | null => {
  return storage.getString(STORAGE_KEY_LANG_KEY_DEFAULT) || null;
};
const saveLangKeyDefault = (key: string) => {
  storage.set(STORAGE_KEY_LANG_KEY_DEFAULT, key);
};
const clearLangKeyDefault = () => {
  storage.delete(STORAGE_KEY_LANG_KEY_DEFAULT);
};

// STORAGE_KEY_LANG_KEY_PREFERRED
const getLangKeyPreferred = (): string | null => {
  return storage.getString(STORAGE_KEY_LANG_KEY_PREFERRED) || null;
};
const saveLangKeyPreferred = (key: string) => {
  storage.set(STORAGE_KEY_LANG_KEY_PREFERRED, key);
};
const clearLangKeyPreferred = () => {
  storage.delete(STORAGE_KEY_LANG_KEY_PREFERRED);
};

// STORAGE_KEY_SETTINGS
const getSettings = (): AppSettings | null => {
  const json = storage.getString(STORAGE_KEY_SETTINGS);
  return json ? JSON.parse(json) : null;
};
const setSettings = (data: AppSettings) => {
  storage.set(STORAGE_KEY_SETTINGS, JSON.stringify(data));
};
const clearSettings = () => {
  storage.delete(STORAGE_KEY_SETTINGS);
};

// STORAGE_KEY_BACKGROUNDS
const getBackgrounds = (): DailyBackgrounds | null => {
  const json = storage.getString(STORAGE_KEY_BACKGROUNDS);
  return json ? JSON.parse(json) : null;
};
const setBackgrounds = (data: DailyBackgrounds) => {
  storage.set(STORAGE_KEY_BACKGROUNDS, JSON.stringify(data));
};
const clearBackgrounds = () => {
  storage.delete(STORAGE_KEY_BACKGROUNDS);
};

// STORAGE_KEY_QUOTES
const getQuotes = (): DailyQuotes | null => {
  const json = storage.getString(STORAGE_KEY_QUOTES);
  return json ? JSON.parse(json) : null;
};
const setQuotes = (data: DailyQuotes) => {
  storage.set(STORAGE_KEY_QUOTES, JSON.stringify(data));
};
const clearQuotes = () => {
  storage.delete(STORAGE_KEY_QUOTES);
};

// STORAGE_KEY_HAS_PLAYED
const getHasPlayed = (): boolean => {
  return storage.getBoolean(STORAGE_KEY_HAS_PLAYED) || false;
};
const setHasPlayed = (value: boolean) => {
  storage.set(STORAGE_KEY_HAS_PLAYED, value);
};
const clearHasPlayed = () => {
  storage.delete(STORAGE_KEY_HAS_PLAYED);
};

const clearAll = () => {
  clearLangKeyDefault();
  clearLangKeyPreferred();
  clearSettings();
  clearBackgrounds();
  clearQuotes();
  clearHasPlayed();
};

export const appStorage = {
  getLangKeyDefault,
  saveLangKeyDefault,
  clearLangKeyDefault,
  getLangKeyPreferred,
  saveLangKeyPreferred,
  clearLangKeyPreferred,
  getSettings,
  setSettings,
  clearSettings,
  getBackgrounds,
  setBackgrounds,
  clearBackgrounds,
  getQuotes,
  setQuotes,
  clearQuotes,
  getHasPlayed,
  setHasPlayed,
  clearHasPlayed,
  clearAll,
};
