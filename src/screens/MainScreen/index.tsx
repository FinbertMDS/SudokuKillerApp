// src/screens/MainScreen/index.tsx
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {generateKillerSudoku} from 'killer-sudoku-generator';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Text, TouchableOpacity, View} from 'react-native';
import {Menu} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import {Difficulty} from 'sudoku-gen/dist/types/difficulty.type';
import Header from '../../components/commons/Header';
import {useTheme} from '../../context/ThemeContext';
import {CORE_EVENTS} from '../../events';
import eventBus from '../../events/eventBus';
import LanguageSwitcher from '../../i18n/LanguageSwitcher';
import {BoardService} from '../../services/BoardService';
import {InitGame, Level, RootStackParamList} from '../../types/index';
import {sortAreasCells, stringToGrid} from '../../utils/boardUtil';
import {LEVELS, SCREENS} from '../../utils/constants';

const MainScreen = () => {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [hasSavedGame, setHasSavedGame] = useState(false);

  // Sau khi navigation.goBack() sẽ gọi hàm này
  useFocusEffect(
    useCallback(() => {
      checkSavedGame();
    }, []),
  );

  const checkSavedGame = async () => {
    const saved = await BoardService.loadSaved();
    setHasSavedGame(!!saved);
  };

  const handleNewGame = async (level: Level) => {
    setMenuVisible(false);
    const sudoku = generateKillerSudoku(level as Difficulty);
    const initGame = {
      id: uuid.v4().toString(),
      initialBoard: stringToGrid(sudoku.puzzle),
      solvedBoard: stringToGrid(sudoku.solution),
      cages: sortAreasCells(sudoku.areas),
      savedLevel: level,
    } as InitGame;
    eventBus.emit(CORE_EVENTS.gameStarted, {initGame});
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

  const handleClearStorage = async () => {
    eventBus.emit(CORE_EVENTS.clearStorage);
    BoardService.clear().then(checkSavedGame);
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, {backgroundColor: theme.background}]}>
      <Header
        title={t('appName')}
        showBack={false}
        showSettings={true}
        showTheme={true}
      />

      <LanguageSwitcher />
      <View style={[styles.content, {backgroundColor: theme.background}]}>
        {hasSavedGame && (
          <TouchableOpacity
            style={[
              styles.continueButton,
              {
                backgroundColor: theme.primary,
                borderColor: theme.buttonBorder,
              },
            ]}
            onPress={handleContinueGame}>
            <Text style={[styles.buttonText, {color: theme.buttonText}]}>
              {t('continueGame')}
            </Text>
          </TouchableOpacity>
        )}

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          style={{backgroundColor: theme.background}}
          contentStyle={{backgroundColor: theme.background}}
          anchor={
            <TouchableOpacity
              style={[
                styles.newGameButton,
                {
                  backgroundColor: theme.secondary,
                  borderColor: theme.buttonBorder,
                },
              ]}
              onPress={() => setMenuVisible(true)}>
              <Text style={[styles.buttonText, {color: theme.buttonText}]}>
                {t('newGame')}
              </Text>
            </TouchableOpacity>
          }>
          {LEVELS.map(level => (
            <Menu.Item
              key={level}
              onPress={() => handleNewGame(level)}
              title={t(`level.${level}`)}
              titleStyle={{color: theme.text}}
            />
          ))}
        </Menu>

        <TouchableOpacity
          style={[
            styles.deleteButton,
            {
              backgroundColor: theme.danger,
              borderColor: theme.buttonBorder,
            },
          ]}
          onPress={handleClearStorage}>
          <Text style={[styles.buttonText, {color: theme.buttonText}]}>
            {t('clearStorage')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
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
    fontWeight: 'bold' as const,
  },
};

export default MainScreen;
