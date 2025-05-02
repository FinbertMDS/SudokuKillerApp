import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  Alert,
  Linking,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
} from 'react-native';
import InAppReview from 'react-native-in-app-review';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {appConfig} from '../../appConfig';
import Header from '../../components/commons/Header';
import {useTheme} from '../../context/ThemeContext';
import {OptionMenuItem, RootStackParamList} from '../../types';
import {SCREENS} from '../../utils/constants';

export const OptionsScreen = () => {
  const {theme} = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {t} = useTranslation();

  const handleRateApp = () => {
    // Prefer in-app store review if available
    const isAvailable = InAppReview.isAvailable();
    if (isAvailable) {
      InAppReview.RequestInAppReview();
    } else {
      const storeUrl = appConfig.getStoreUrl();
      if (storeUrl) {
        Linking.openURL(storeUrl);
      }
    }
  };

  const handleShareApp = async () => {
    const storeUrl = appConfig.getStoreUrl();
    if (storeUrl) {
      await Share.share({
        message: `${t('shareAppMsg')} ${storeUrl}`,
      });
    }
  };

  const handleSendFeedback = async () => {
    const url = `mailto:${appConfig.developerMail}?subject=${t(
      'sendFeedbackTitle',
    )}&body=${t('sendFeedbackMsg')}`;
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert(
        t('mailNotSupported'),
        t('mailNotSupportedMsg', {mail: appConfig.developerMail}),
      );
    }
  };

  const menuItems: OptionMenuItem[] = [
    {icon: 'cog', label: t('settings'), screen: SCREENS.SETTINGS},
    {icon: 'school', label: t('howToPlay'), screen: SCREENS.HOW_TO_PLAY},
    {icon: 'star-outline', label: t('rateApp'), onPress: handleRateApp},
    {icon: 'share-variant', label: t('shareApp'), onPress: handleShareApp},
    {
      icon: 'email-outline',
      label: t('sendFeedback'),
      onPress: handleSendFeedback,
    },
    // {icon: 'shield-account', label: t('privacyRights')},
    // {icon: 'account-check', label: t('privacyPreferences')},
    // {icon: 'ad-off', label: t('removeAds')},
    // {icon: 'restore', label: t('restorePurchase')},
  ];

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, {backgroundColor: theme.background}]}>
      <Header
        title={t('options')}
        showBack={true}
        showSettings={true}
        showTheme={true}
      />
      <ScrollView
        style={[styles.container, {backgroundColor: theme.background}]}>
        {menuItems.map(({icon, label, screen, onPress}) => (
          <TouchableOpacity
            key={label}
            style={[
              styles.item,
              {backgroundColor: theme.settingItemBackground},
            ]}
            onPress={() =>
              screen
                ? navigation.navigate(screen as any)
                : onPress
                ? onPress()
                : () => {}
            }>
            <Icon
              name={icon}
              size={24}
              color={theme.iconColor}
              style={styles.icon}
            />
            <Text style={[styles.label, {color: theme.text}]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold' as const,
    color: '#fff',
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
  },
  icon: {
    marginRight: 12,
  },
};
