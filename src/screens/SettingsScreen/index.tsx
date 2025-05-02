import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, Switch, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/commons/Header';
import {useTheme} from '../../context/ThemeContext';
import LanguageSwitcher from '../../i18n/LanguageSwitcher';

const SETTINGS_KEY = 'APP_SETTINGS';

export const SettingsScreen = () => {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const [settings, setSettings] = useState({
    sounds: true,
    autoLock: false,
    timer: true,
    score: true,
    statisticsMsg: true,
    numberFirst: false,
    mistakeLimit: true,
    autoCheck: false,
    highlightDuplicates: true,
  });

  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then(data => {
      if (data) {
        setSettings(JSON.parse(data));
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const toggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof settings],
    }));
  };

  const labels = {
    sounds: t('setting.sounds'),
    autoLock: t('setting.autoLock'),
    timer: t('setting.timer'),
    score: t('setting.score'),
    statisticsMsg: t('setting.statisticsMsg'),
    numberFirst: t('setting.numberFirst'),
    mistakeLimit: t('setting.mistakeLimit'),
    autoCheck: t('setting.autoCheck'),
    highlightDuplicates: t('setting.highlightDuplicates'),
  };

  const descriptions = {
    statisticsMsg: t('desc.statisticsMsg'),
    numberFirst: t('desc.numberFirst'),
    mistakeLimit: t('desc.mistakeLimit'),
    autoCheck: t('desc.autoCheck'),
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, {backgroundColor: theme.background}]}>
      <Header
        title={t('settings')}
        showBack={true}
        showSettings={true}
        showTheme={true}
      />
      <LanguageSwitcher />
      <ScrollView
        style={[styles.container, {backgroundColor: theme.background}]}>
        {Object.entries(labels).map(([key, label]) => (
          <View
            key={key}
            style={[
              styles.settingRow,
              {backgroundColor: theme.settingItemBackground},
            ]}>
            <View style={styles.labelContainer}>
              <Text style={[styles.label, {color: theme.text}]}>{label}</Text>
              {descriptions[key as keyof typeof descriptions] && (
                <Text style={[styles.desc, {color: theme.secondary}]}>
                  {descriptions[key as keyof typeof descriptions]}
                </Text>
              )}
            </View>
            <Switch
              value={settings[key as keyof typeof descriptions]}
              onValueChange={() => toggle(key)}
            />
          </View>
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
    marginBottom: 16,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
  },
  settingRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  desc: {
    fontSize: 13,
    marginTop: 4,
  },
};
