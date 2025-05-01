// LanguageSwitcher.tsx

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import i18n from './i18n';

const LANG_KEY = 'sudoku_language';
const LANGUAGES = [
  {code: 'en', label: 'English'},
  {code: 'vi', label: 'Tiếng Việt'},
  {code: 'ja', label: '日本語'},
];

export default function LanguageSwitcher() {
  const {t} = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);

  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY).then(storedLang => {
      if (storedLang && storedLang !== selectedLang) {
        i18n.changeLanguage(storedLang);
        setSelectedLang(storedLang);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeLanguage = async (code: string) => {
    await i18n.changeLanguage(code);
    await AsyncStorage.setItem(LANG_KEY, code);
    setSelectedLang(code);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('language') || 'Language'}</Text>
      <View style={styles.buttons}>
        {LANGUAGES.map(lang => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.button,
              selectedLang === lang.code && styles.selectedButton,
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
  selectedButton: {
    backgroundColor: '#60a5fa',
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
