// src/screens/MainScreen/index.tsx
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { generateKillerSudoku } from 'killer-sudoku-generator';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Menu } from 'react-native-paper';
import { Difficulty } from 'sudoku-gen/dist/types/difficulty.type';
import { BoardService } from '../../services/BoardService';
import { BoardScreenNavigationProp, InitGame } from '../../types/index';
import { sortAreasCells, stringToGrid } from '../../utils/boardUtil';
import { DIFFICULTY_ALL, SCREENS } from '../../utils/constants';

const MainScreen = () => {
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
    console.log(sudoku);
    const initGame = {
      initialBoard: stringToGrid(sudoku.puzzle),
      solvedBoard: stringToGrid(sudoku.solution),
      cages: sortAreasCells(sudoku.areas),
      savedLevel: level,
    } as InitGame;
    await BoardService.save(initGame);
    const initGame2 = await BoardService.loadInit();
    console.log('initGame', initGame);
    console.log('initGame2', initGame2);
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
    <View style={styles.container}>
      <Text style={styles.title}>Killer Sudoku</Text>

      {hasSavedGame && (
        <TouchableOpacity style={styles.continueButton} onPress={handleContinueGame}>
          <Text style={styles.buttonText}>Continue Game</Text>
        </TouchableOpacity>
      )}

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <TouchableOpacity style={styles.newGameButton} onPress={() => setMenuVisible(true)}>
            <Text style={styles.buttonText}>New Game</Text>
          </TouchableOpacity>
        }
      >
        {DIFFICULTY_ALL.map((level) => (
          <Menu.Item key={level} onPress={() => handleNewGame(level)} title={level} />
        ))}
      </Menu>

      <TouchableOpacity style={styles.deleteButton} onPress={() => BoardService.clear().then(checkSavedGame)}>
        <Text style={styles.buttonText}>Delete Saved Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, color: '#ddd', marginBottom: 30 },
  continueButton: { backgroundColor: '#339af0', padding: 14, paddingHorizontal: 24, borderRadius: 25, marginBottom: 15 },
  newGameButton: { backgroundColor: '#222', padding: 14, paddingHorizontal: 24, borderRadius: 25 },
  deleteButton: { marginTop: 16, padding: 12, paddingHorizontal: 24, backgroundColor: '#ff4d4d', borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: 'bold' },
});

export default MainScreen;
