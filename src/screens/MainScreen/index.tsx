// src/screens/MainScreen/index.tsx
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { generateKillerSudoku } from 'killer-sudoku-generator';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Menu } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';
import Header from '../../components/commons/Header';
import { useTheme } from '../../context/ThemeContext';
import { BoardService } from '../../services/BoardService';
import { BoardScreenNavigationProp, InitGame } from '../../types/index';
import { sortAreasCells, stringToGrid } from '../../utils/boardUtil';
import { DIFFICULTY_ALL, SCREENS } from '../../utils/constants';

const MainScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<BoardScreenNavigationProp>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [hasSavedGame, setHasSavedGame] = useState(false);

  useFocusEffect(
    useCallback(() => {
      checkSavedGame();
    }, [])
  );

  const checkSavedGame = async () => {
    const saved = await BoardService.loadSaved();
    setHasSavedGame(!!saved);
  };

  const handleNewGame = async (level: string) => {
    setMenuVisible(false);
    const sudoku = generateKillerSudoku(level as Difficulty);
    const initGame = {
      initialBoard: stringToGrid(sudoku.puzzle),
      solvedBoard: stringToGrid(sudoku.solution),
      cages: sortAreasCells(sudoku.areas),
      savedLevel: level,
    } as InitGame;
    await BoardService.save(initGame);
    navigation.navigate(SCREENS.BOARD, {
      ...initGame,
    });
  };

  const handleContinueGame = async () => {
    const initGame = await BoardService.loadInit();
    const savedGame = await BoardService.loadSaved();
    if (savedGame) {
      navigation.navigate(SCREENS.BOARD, {
        ...initGame,
        ...savedGame,
      });
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <Header />
      <View style={[styles.content, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>Killer Sudoku</Text>

        {hasSavedGame && (
          <TouchableOpacity style={[
            styles.continueButton,
            {
              backgroundColor: theme.primary,
              borderColor: theme.buttonBorder,
            },
          ]} onPress={handleContinueGame}>
            <Text style={[styles.buttonText, { color: theme.buttonText }]}>Continue Game</Text>
          </TouchableOpacity>
        )}

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          style={{ backgroundColor: theme.background }}
          contentStyle={{ backgroundColor: theme.background }}
          anchor={
            <TouchableOpacity style={[
              styles.newGameButton,
              {
                backgroundColor: theme.secondary,
                borderColor: theme.buttonBorder,
              },
            ]} onPress={() => setMenuVisible(true)}>
              <Text style={[styles.buttonText, { color: theme.buttonText }]}>New Game</Text>
            </TouchableOpacity>
          }
        >
          {DIFFICULTY_ALL.map((level) => (
            <Menu.Item key={level} onPress={() => handleNewGame(level)} title={level} titleStyle={{ color: theme.text }} />
          ))}
        </Menu>

        <TouchableOpacity style={[
          styles.deleteButton,
          {
            backgroundColor: theme.mistake,
            borderColor: theme.buttonBorder,
          },
        ]} onPress={() => BoardService.clear().then(checkSavedGame)}>
          <Text style={[styles.buttonText, { color: theme.buttonText }]}>Delete Saved Game</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
  },
  continueButton: {
    padding: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 15,
  },
  newGameButton: {
    padding: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  deleteButton: {
    marginTop: 16,
    padding: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

export default MainScreen;
