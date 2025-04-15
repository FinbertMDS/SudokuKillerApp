import React from 'react';

import { enableScreens } from 'react-native-screens';
import MainScreen from './src/MainScreen';

function App(): React.JSX.Element {
  enableScreens(); // tăng hiệu suất điều hướng

  return (
    <MainScreen />
  );
}

export default App;
