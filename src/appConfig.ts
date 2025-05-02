import {Platform} from 'react-native';

export const appConfig = {
  iosAppId: '1234567890', // <- App Store ID tự điền
  androidPackageName: 'com.sudokukillerapp', // hoặc lấy từ native code
  developerMail: 'ngovanhuy.cntt2@gmail.com', // <- Địa chỉ email của developer
  getStoreUrl: () =>
    Platform.select({
      ios: `https://apps.apple.com/app/id${appConfig.iosAppId}`,
      android: `https://play.google.com/store/apps/details?id=${appConfig.androidPackageName}`,
    }),
};
