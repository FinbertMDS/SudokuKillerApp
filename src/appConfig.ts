import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const appConfig = {
  iosAppId: '1234567890',
  androidPackageName: DeviceInfo.getBundleId(),
  developerMail: 'ngovanhuy.cntt2@gmail.com',
  version: DeviceInfo.getVersion(),
  buildNumber: DeviceInfo.getBuildNumber(),
  getStoreUrl: () =>
    Platform.select({
      ios: `https://apps.apple.com/app/id${appConfig.iosAppId}`,
      android: `https://play.google.com/store/apps/details?id=${appConfig.androidPackageName}`,
    }),
};
