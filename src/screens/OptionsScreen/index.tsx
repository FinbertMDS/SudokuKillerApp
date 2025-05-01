import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../context/ThemeContext';

export const OptionsScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const {t} = useTranslation();

  const menuItems = [
    {icon: 'cog', label: t('settings'), screen: 'SettingsScreen'},
    {icon: 'school', label: t('howToPlay')},
    {icon: 'help-circle', label: t('help')},
    {icon: 'information', label: t('aboutGame')},
    {icon: 'shield-account', label: t('privacyRights')},
    {icon: 'account-check', label: t('privacyPreferences')},
    {icon: 'calculator-variant', label: t('mathPuzzle')},
    {icon: 'ad-off', label: t('removeAds')},
    {icon: 'restore', label: t('restorePurchase')},
  ];

  return (
    <ScrollView style={[styles.container, {backgroundColor: theme.background}]}>
      <Text style={[styles.title, {color: theme.text}]}>{t('options')}</Text>
      {menuItems.map(({icon, label, screen}) => (
        <TouchableOpacity
          key={label}
          style={[styles.item, {backgroundColor: theme.settingItemBackground}]}
          onPress={() => screen && navigation.navigate(screen)}>
          <Icon name={icon} size={24} color="#fff" style={styles.icon} />
          <Text style={[styles.label, {color: theme.text}]}>{label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
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
