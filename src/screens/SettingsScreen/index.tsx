import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, Switch, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/commons/Header';
import {useTheme} from '../../context/ThemeContext';
import eventBus from '../../events/eventBus';
import LanguageSwitcher from '../../i18n/LanguageSwitcher';
import {SettingsService} from '../../services/SettingsService';
import {CORE_EVENTS} from '../../types';
import {DEFAULT_SETTINGS} from '../../utils/constants';

export const SettingsScreen = () => {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    SettingsService.load().then(data => {
      if (data) {
        setSettings(data);
      }
    });
  }, []);

  useEffect(() => {
    SettingsService.save(settings);
  }, [settings]);

  const toggle = (key: string, value: boolean) => {
    setSettings(prev => {
      const updated = SettingsService.normalizeSettings({
        ...prev,
        [key]: value,
      });
      eventBus.emit(CORE_EVENTS.settingsUpdated, updated);
      return updated;
    });
  };

  const labels = {
    // sounds: t('setting.sounds'),
    // autoLock: t('setting.autoLock'),
    timer: t('setting.timer'),
    // score: t('setting.score'),
    // statisticsMsg: t('setting.statisticsMsg'),
    // numberFirst: t('setting.numberFirst'),
    mistakeLimit: t('setting.mistakeLimit'),
    autoCheckMistake: t('setting.autoCheckMistake'),
    highlightDuplicates: t('setting.highlightDuplicates'),
    highlightAreas: t('setting.highlightAreas'),
    highlightIdenticalNumbers: t('setting.highlightIdenticalNumbers'),
    hideUsedNumbers: t('setting.hideUsedNumbers'),
    autoRemoveNotes: t('setting.autoRemoveNotes'),
  };

  const descriptions = {
    // statisticsMsg: t('desc.statisticsMsg'),
    // numberFirst: t('desc.numberFirst'),
    mistakeLimit: t('desc.mistakeLimit'),
    autoCheckMistake: t('desc.autoCheckMistake'),
    highlightDuplicates: t('desc.highlightDuplicates'),
    highlightAreas: t('desc.highlightAreas'),
    highlightIdenticalNumbers: t('desc.highlightIdenticalNumbers'),
    hideUsedNumbers: t('desc.hideUsedNumbers'),
    autoRemoveNotes: t('desc.autoRemoveNotes'),
  };

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.container, {backgroundColor: theme.background}]}>
      <Header
        title={t('settings')}
        showBack={true}
        showSettings={false}
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
              value={settings[key as keyof typeof DEFAULT_SETTINGS]}
              onValueChange={value => toggle(key, value)}
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
