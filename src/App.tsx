// src/App.tsx
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {ThemeProvider} from './context/ThemeContext';
import {setupEventListeners} from './events';
import {useAppPause} from './hooks/useAppPause';
import './i18n/i18n';
import {autoDetectLanguage} from './i18n/i18n';
import BottomTabs from './navigation/BottomTabs';
import AboutGame from './screens/AboutGame';
import BoardScreen from './screens/BoardScreen';
import HowToPlayScreen from './screens/HowToPlayScreen';
import OptionsScreen from './screens/OptionsScreen';
import PlayerScreen from './screens/PlayerScreen';
import SettingsScreen from './screens/SettingsScreen';
import SkWebViewScreen from './screens/SkWebViewScreen';
import {runMigrationsIfNeeded} from './storage/runMigrationsIfNeeded';
import {RootStackParamList} from './types/index';
import {SCREENS} from './utils/constants';

const Stack = createNativeStackNavigator<RootStackParamList>();
setupEventListeners();

const App = () => {
  useEffect(() => {
    runMigrationsIfNeeded();
  }, []);

  useAppPause(
    () => {},
    () => {
      setTimeout(() => {
        autoDetectLanguage();
      }, 200);
    },
  );

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name={SCREENS.HOME_TABS}
            component={BottomTabs}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name={SCREENS.BOARD}
            component={BoardScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name={SCREENS.OPTIONS}
            component={OptionsScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name={SCREENS.SETTINGS}
            component={SettingsScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name={SCREENS.HOW_TO_PLAY}
            component={HowToPlayScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name={SCREENS.ABOUT_GAME}
            component={AboutGame}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name={SCREENS.SK_WEBVIEW}
            component={SkWebViewScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name={SCREENS.PLAYERS}
            component={PlayerScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
