// utils/getDailyBackground.ts
import {BackgroundService} from '../services/BackgroundService';
import {DailyBackgrounds} from '../types';
import {UNSPLASH_KEYWORDS_DARK, UNSPLASH_KEYWORDS_LIGHT} from './constants';

const getRandomKeyword = (list: string[]) =>
  list[Math.floor(Math.random() * list.length)];

export const getDailyBackgrounds = async (): Promise<DailyBackgrounds> => {
  const today = new Date().toISOString().split('T')[0];
  const cached = await BackgroundService.load();
  if (cached) {
    const {date, light, dark} = cached;
    if ((__DEV__ || date === today) && light && dark) {
      return {light, dark};
    }
  }

  const [lightData, darkData] = await Promise.all([
    BackgroundService.fetchUnsplashImage(
      getRandomKeyword(UNSPLASH_KEYWORDS_LIGHT),
    ),
    BackgroundService.fetchUnsplashImage(
      getRandomKeyword(UNSPLASH_KEYWORDS_DARK),
    ),
  ]);

  if (lightData && darkData) {
    const result = {date: today, light: lightData, dark: darkData};
    await BackgroundService.save(result);
    return {light: lightData, dark: darkData};
  } else {
    const oldCached = await BackgroundService.load();
    if (oldCached) {
      const {light, dark} = oldCached;
      if (light && dark) {
        return {light, dark};
      }
    }
  }
  return {light: null, dark: null};
};
