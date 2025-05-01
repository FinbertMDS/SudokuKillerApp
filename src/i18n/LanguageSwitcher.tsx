// LanguageSwitcher.tsx

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {LANGUAGES, STORAGE_KEY_LANG_KEY_PREFERRED} from '../utils/constants';
import i18n, {autoDetectLanguage} from './i18n';

export default function LanguageSwitcher() {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);

  useFocusEffect(
    useCallback(() => {
      autoDetectLanguage();
    }, []),
  );

  useEffect(() => {
    autoDetectLanguage();
  }, []);

  const changeLanguage = async (code: string) => {
    await i18n.changeLanguage(code);
    await AsyncStorage.setItem(STORAGE_KEY_LANG_KEY_PREFERRED, code);
    setSelectedLang(code);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('language')}</Text>
      <View style={styles.buttons}>
        {LANGUAGES.map(lang => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.button,
              selectedLang === lang.code && {backgroundColor: theme.buttonBlue},
            ]}
            onPress={() => changeLanguage(lang.code)}>
            <Text
              style={
                selectedLang === lang.code ? styles.selectedText : styles.text
              }>
              {lang.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#374151',
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    marginRight: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: '#1f2937',
  },
  selectedText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
});
