import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  generateKillerSudoku,
} from 'killer-sudoku-generator';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Menu, Provider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';
import BoardScreen from './BoardScreen';
import { RootStackParamList, SavedGame } from './types';
import { sortAreasCells, stringToGrid } from './utils';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const MainScreen = ({ navigation }: any) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [, setSavedGameData] = useState<SavedGame | null>(null);

  useFocusEffect(
    useCallback(() => {
      const checkSavedGame = async () => {
        try {
          const data = await AsyncStorage.getItem('savedGame');
          if (data) {
            setSavedGameData(JSON.parse(data));
            setHasSavedGame(true);
          } else {
            setSavedGameData(null);
            setHasSavedGame(false);
          }
        } catch (e) {
          console.error('Lỗi khi đọc saved game:', e);
        }
      };
      checkSavedGame();
    }, [])
  );

  const handleNewGame = (level: string) => {
    setMenuVisible(false);
    const sudoku = generateKillerSudoku(level.toLocaleLowerCase() as Difficulty);
    const solvedBoard = stringToGrid(sudoku.solution);
    const cages = sortAreasCells(sudoku.areas);

    navigation.navigate('Board', {
      savedLevel: level,
      score: 0,
      initialBoard: stringToGrid(sudoku.puzzle),
      solvedBoard: solvedBoard,
      cages,
    } as RootStackParamList['Board']);
  };

  const handleContinueGame = async () => {
    const data = await AsyncStorage.getItem('savedGame');
    if (data) {
      const oldData = JSON.parse(data) as SavedGame;
      navigation.navigate('Board', {
        savedLevel: oldData?.savedLevel,
        score: oldData?.score,
        initialBoard: oldData?.initialBoard,
        solvedBoard: oldData?.solvedBoard,
        cages: oldData?.cages,
        savedMistakeCount: oldData?.savedMistakeCount,
        savedBoard: oldData?.savedBoard,
        savedElapsedTime: oldData?.savedElapsedTime,
        savedHistory: oldData?.savedHistory,
        lastSaved: oldData?.lastSaved,
      } as RootStackParamList['Board']);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Killer Sudoku</Text>

      {hasSavedGame && (
        <TouchableOpacity style={styles.continueButton}
          onPress={handleContinueGame}
        >
          <Text style={styles.continueText}>Continue Game</Text>
        </TouchableOpacity>
      )}
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <TouchableOpacity
            style={styles.newGameButton}
            onPress={() => setMenuVisible(true)}
          >
            <Text style={styles.newGameText}>New Game</Text>
          </TouchableOpacity>
        }
      >
        {['Easy', 'Medium', 'Hard', 'Expert'].map((level) => (
          <Menu.Item
            key={level}
            onPress={() => handleNewGame(level.toLowerCase())}
            title={level}
          />
        ))}
      </Menu>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={async () => {
          try {
            await AsyncStorage.removeItem('savedGame');
            setHasSavedGame(false);
            setSavedGameData(null);
          } catch (e) {
            console.error('Lỗi khi xoá saved game:', e);
          }
        }}
      >
        <Text style={styles.deleteText}>Delete Saved Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const StatisticsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Statistics</Text>
  </View>
);

// Bottom tab (Main + Statistics)
const BottomTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBarIcon: ({ color, size }) => {
        const icons: any = {
          Main: 'home',
          Statistics: 'bar-chart',
        };
        return <Icon name={icons[route.name]} size={size} color={color} />;
      },
      headerShown: false,
      tabBarActiveTintColor: '#339af0',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Main" component={MainScreen} />
    <Tab.Screen name="Statistics" component={StatisticsScreen} />
  </Tab.Navigator>
);

export default function App() {
  return (
    <Provider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="HomeTabs"
            component={BottomTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Board"
            component={BoardScreen}
            options={{ headerShown: false, presentation: 'modal' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: '#ddd',
    marginBottom: 30,
  },
  continueButton: {
    backgroundColor: '#339af0',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 15,
  },
  continueText: {
    color: 'white',
    fontWeight: 'bold',
  },
  newGameButton: {
    backgroundColor: '#222',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  newGameText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

