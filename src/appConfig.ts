import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const appConfig = {
  iosAppId: '1234567890', // <- App Store ID tự điền
  androidPackageName: DeviceInfo.getBundleId(), // hoặc lấy từ native code
  developerMail: 'ngovanhuy.cntt2@gmail.com', // <- Địa chỉ email của developer
  version: DeviceInfo.getVersion(),
  buildNumber: DeviceInfo.getBuildNumber(),
  getStoreUrl: () =>
    Platform.select({
      ios: `https://apps.apple.com/app/id${appConfig.iosAppId}`,
      android: `https://play.google.com/store/apps/details?id=${appConfig.androidPackageName}`,
    }),
};
