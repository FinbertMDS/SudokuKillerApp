import React from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';
import {useTheme} from '../../context/ThemeContext';
import Header from './Header';

type WebViewBaseProps = {
  title: string;
  source: any;
  needPadding?: boolean;
};

export default function WebViewBase({
  title,
  source,
  needPadding = false,
}: WebViewBaseProps) {
  const {theme, mode} = useTheme();

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
        title={title}
        showBack={true}
        showSettings={false}
        showTheme={false}
      />
      <WebView
        originWhitelist={['*']}
        source={source}
        injectedJavaScript={mode === 'dark' ? darkModeStyle : ''}
        onMessage={_ => {}}
        style={needPadding ? styles.content : {}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    marginHorizontal: 16,
  },
});
