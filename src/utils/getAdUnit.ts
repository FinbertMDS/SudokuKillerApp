import {AD_UNIT_BANNER, AD_UNIT_INTERSTITIAL, AD_UNIT_REWARDED} from '@env';
import {TestIds} from 'react-native-google-mobile-ads';

type AdType = 'banner' | 'interstitial' | 'rewarded';

const PROD_AD_UNITS: Record<AdType, string> = {
  banner: AD_UNIT_BANNER,
  interstitial: AD_UNIT_INTERSTITIAL,
  rewarded: AD_UNIT_REWARDED,
};

const DEV_AD_UNITS: Record<AdType, string> = {
  banner: TestIds.BANNER,
  interstitial: TestIds.INTERSTITIAL,
  rewarded: TestIds.REWARDED,
};

export function getAdUnit(type: AdType): string {
  if (__DEV__) {
    return DEV_AD_UNITS[type];
  }
  return PROD_AD_UNITS[type];
}
