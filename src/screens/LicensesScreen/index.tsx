import React from 'react';
import {useTranslation} from 'react-i18next';
import {Platform, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';
import Header from '../../components/commons/Header';
import {useTheme} from '../../context/ThemeContext';

export default function Licenses() {
  const {theme, mode} = useTheme();
  const {t} = useTranslation();

  const licensesSource =
    Platform.OS === 'android'
      ? {uri: 'file:///android_asset/licenses.html'}
      : require('../../../assets/htmls/licenses.html');

  const darkModeStyle = `
      (function() {
        const style = document.createElement('style');
        style.innerHTML = \`
          body {
            background-color: #121212 !important;
            color: #e0e0e0 !important;
          }
          .license {
            background: #1e1e1e !important;
            box-shadow: 0 0 4px rgba(255,255,255,0.05) !important;
          }
          .note {
            color: #aaa !important;
          }
        \`;
        document.head.appendChild(style);
        window.ReactNativeWebView.postMessage("Dark mode style injected");
      })();
    `;

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.container, {backgroundColor: theme.background}]}>
      <Header
        title={t('licenses')}
        showBack={true}
        showSettings={false}
        showTheme={false}
      />
      <WebView
        originWhitelist={['*']}
        source={licensesSource}
        injectedJavaScript={mode === 'dark' ? darkModeStyle : ''}
        onMessage={_ => {}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
