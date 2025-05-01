// src/App.tsx
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {ThemeProvider} from './context/ThemeContext';
import BottomTabs from './navigation/BottomTabs';
import BoardScreen from './screens/BoardScreen';
import {RootStackParamList} from './types/index';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <ThemeProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="HomeTabs"
              component={BottomTabs}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Board"
              component={BoardScreen}
              options={{headerShown: false, presentation: 'modal'}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </ThemeProvider>
  );
};

export default App;
