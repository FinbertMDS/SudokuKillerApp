// src/App.tsx
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {ThemeProvider} from './context/ThemeContext';
import './i18n/i18n';
import BottomTabs from './navigation/BottomTabs';
import BoardScreen from './screens/BoardScreen';
import {HowToPlayScreen} from './screens/HowToPlayScreen';
import {OptionsScreen} from './screens/OptionsScreen';
import {SettingsScreen} from './screens/SettingsScreen';
import {RootStackParamList} from './types/index';
import {SCREENS} from './utils/constants';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <ThemeProvider>
      <PaperProvider>
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
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </ThemeProvider>
  );
};

export default App;
