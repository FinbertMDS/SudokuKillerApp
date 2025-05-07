import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';
import {useTheme} from '../../context/ThemeContext';
import Header from '../commons/Header';

export default function Licenses() {
  const {theme} = useTheme();
  const {t} = useTranslation();
  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.container, {backgroundColor: theme.background}]}>
      <Header
        title={t('options')}
        showBack={true}
        showSettings={false}
        showTheme={false}
      />
      <WebView
        originWhitelist={['*']}
        source={require('../../../assets/htmls/licenses.html')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
