import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActionButtons from '../../components/Board/ActionButtons';
import Grid from '../../components/Board/Grid';
import InfoPanel from '../../components/Board/InfoPanel';
import NumberPad from '../../components/Board/NumberPad';
import PauseModal from '../../components/Board/PauseModal';
import Header from '../../components/commons/Header';
import { useTheme } from '../../context/ThemeContext';
import { useAppPause } from '../../hooks/useAppPause';
import { useGameTimer } from '../../hooks/useGameTimer';
import { BoardService } from '../../services/BoardService';
import { BoardScreenNavigationProp, BoardScreenRouteProp, Cell, InitGame, SavedGame } from '../../types';
import { checkBoardIsSolved, createEmptyGridNotes, deepCloneBoard, deepCloneNotes } from '../../utils/boardUtil';
import { ANIMATION_CELL_KEY_SEPARATOR, ANIMATION_DURATION, ANIMATION_TYPE, BOARD_SIZE, DIFFICULTY_ALL, MAX_MISTAKES, TIMEOUT_DURATION } from '../../utils/constants';
import { formatTime } from '../../utils/dateUtil';

const BoardScreen = () => {
  const { theme } = useTheme();
  const route = useRoute<BoardScreenRouteProp>();
  const navigation = useNavigation<BoardScreenNavigationProp>();
  const {
    initialBoard,
    solvedBoard,
    cages,
    savedLevel,
    savedBoard,
    savedMistakeCount,
    savedHistory,
    savedNotes,
  } = route.params as InitGame & SavedGame;

  const [board, setBoard] = useState<(number | null)[][]>(savedBoard ? deepCloneBoard(savedBoard) : deepCloneBoard(initialBoard));
  const [mistakeCount, setMistakeCount] = useState<number>(savedMistakeCount ? savedMistakeCount : 0);

  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [level] = useState<string>(savedLevel ? savedLevel : DIFFICULTY_ALL[0]);

  const [history, setHistory] = useState(() =>
    savedHistory !== undefined ? savedHistory : [deepCloneBoard(initialBoard)]
  );
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showPauseModal, setShowPauseModal] = useState<boolean>(false);
  const [noteMode, setNoteMode] = useState<boolean>(false);
  const [notes, setNotes] = useState<string[][][]>(
    savedNotes !== undefined ? savedNotes : createEmptyGridNotes<string>()
  );

  // Xử lý khi người dùng sai quá nhiều lần
  // ===========================================================
  useEffect(() => {
    if (mistakeCount > MAX_MISTAKES) {
      Alert.alert('Too many mistakes', 'You have made more than 5 mistakes. Please be careful!');
    }
  }, [mistakeCount]);
  // ===========================================================

  // Hiển thị thời gian đã chơi
  // ===========================================================
  const [isPlaying, setIsPlaying] = useState(true);
  const { seconds, resetTimer } = useGameTimer(isPlaying);
  // ===========================================================

  // Xử lý quá thời gian chơi
  // ===========================================================
  const [timeAlertShown, setTimeAlertShown] = useState(false);
  useEffect(() => {
    if (seconds >= TIMEOUT_DURATION && !timeAlertShown) {
      setTimeAlertShown(true);
      handleResetGame();
      Alert.alert(
        '⏰ Time Warning',
        `Bạn đã chơi hơn ${formatTime(TIMEOUT_DURATION)} rồi!`,
        [
          {
            text: 'OK',
            onPress: () => {
              setIsPlaying(true);
            },
          },
        ],
        {
          cancelable: false,
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds, timeAlertShown]);

  const handleResetGame = async () => {
    await BoardService.clearSavedTimePlayed();
    setIsPlaying(false);
    resetTimer();
    setIsPaused(false);
    setShowPauseModal(false);
    setTimeAlertShown(false);
    setSelectedCell(null);
    setNoteMode(false);
    setBoard(deepCloneBoard(initialBoard));
    setNotes(createEmptyGridNotes<string>());
    setHistory([]);
    setMistakeCount(0);
  };
  // ===========================================================

  // Xử lý animation khi nhập xong 1 hàng/cột
  const [animatedCells, setAnimatedCells] = useState<{ [key: string]: number }>({});

  const handleBackPress = async () => {
    await BoardService.save({
      savedBoard: board,
      savedMistakeCount: mistakeCount,
      savedTimePlayed: seconds,
      savedHistory: history,
      savedNotes: notes,
      lastSaved: new Date(),
    } as SavedGame);
    setIsPlaying(false);
    navigation.goBack();
  };

  const handlePause = async () => {
    await BoardService.save({
      savedBoard: board,
      savedMistakeCount: mistakeCount,
      savedTimePlayed: seconds,
      savedHistory: history,
      savedNotes: notes,
      lastSaved: new Date(),
    } as SavedGame);
    setIsPlaying(false);
    setIsPaused(true);
    setShowPauseModal(true);
  };

  const handleResume = () => {
    setIsPlaying(true);
    setIsPaused(false);
    setShowPauseModal(false);
  };

  const saveHistory = (newBoard: (number | null)[][]) => {
    setHistory(prev => [...prev, deepCloneBoard(newBoard)]);
  };

  /**
   * Quay trở lại trạng thái board trước đó
   */
  const handleUndo = () => {
    if (history.length <= 1) { return; }

    const lastState = history[history.length - 2];
    setBoard(deepCloneBoard(lastState));
    setHistory(prev => prev.slice(0, -1));
  };

  /**
   * Xoá giá trị của ô đã chọn
   */
  const handleErase = () => {
    if (!selectedCell) {
      return;
    }
    const { row, col } = selectedCell;
    if (initialBoard[row][col]) {
      return;
    }
    if (board[row][col] === null || board[row][col] === 0) {
      return;
    }

    const newBoard = deepCloneBoard(board);
    newBoard[row][col] = null;
    setBoard(newBoard);
    const newNotes = deepCloneNotes(notes);
    newNotes[row][col] = [];
    setNotes(newNotes);
    saveHistory(newBoard);
  };

  /**
   * Kiểm tra board đã được giải quyết chưa
   */
  const handleSolved = () => {
    Alert.alert(
      'Giải pháp',
      'Toàn bộ bảng Sudoku đã giải',
      [{ text: 'OK' }],
      { cancelable: false }
    );

    const clonedSolved = deepCloneBoard(solvedBoard);
    setBoard(clonedSolved);
    saveHistory(clonedSolved);
    // handleCheckSolved(solvedBoard);
  };

  /**
   * Điền số vào ô đã chọn
   * @param num Số
   */
  const handleNumberPress = (num: number) => {
    if (!selectedCell) { return; }
    const { row, col } = selectedCell;

    if (noteMode) {
      const newNotes = deepCloneNotes(notes);
      const cellNotes = newNotes[row][col];
      if (cellNotes.includes(num.toString())) {
        newNotes[row][col] = cellNotes.filter((n) => n !== num.toString());
      } else {
        newNotes[row][col] = [...cellNotes, num.toString()].sort();
      }
      setNotes(newNotes);
    } else {
      const correctValue = solvedBoard[row][col];
      const newBoard = deepCloneBoard(board);
      newBoard[row][col] = num;
      setBoard(newBoard);
      saveHistory(newBoard);
      if (num !== correctValue) {
        setMistakeCount(prev => prev + 1);
      } else {
        handleCheckRowOrColResolved(row, col, newBoard);
        handleCheckSolved(newBoard);
      }
    }
  };

  const isRowFilled = (row: number, newBoard: (number | null)[][]): boolean => {
    if (!newBoard[row]) { return false; } // Nếu dòng không tồn tại, coi như chưa filled
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (!newBoard[row][col]) {
        return false; // Nếu có ô nào trong dòng là 0, coi như chưa filled
      }
    }
    return true; // Nếu tất cả ô trong dòng đều khác 0, coi như đã filled
  };

  const isColFilled = (col: number, newBoard: (number | null)[][]): boolean => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      if (!newBoard[row][col]) {
        return false; // Nếu có ô nào trong cột là 0, coi như chưa filled
      }
    }
    return true; // Nếu tất cả ô trong cột đều khác 0, coi như đã filled
  };

  const timeoutRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(timeoutRefs.current).forEach(timeoutId => {
        clearTimeout(timeoutId);
      });
    };
  }, []);

  const handleCheckRowOrColResolved = (row: number, col: number, newBoard: (number | null)[][]) => {
    const key = `${row}${ANIMATION_CELL_KEY_SEPARATOR}${col}`;

    let animationType = ANIMATION_TYPE.NONE as number;
    if (isRowFilled(row, newBoard) && isColFilled(col, newBoard)) {
      animationType = ANIMATION_TYPE.ROW_COL;
    } else if (isRowFilled(row, newBoard)) {
      animationType = ANIMATION_TYPE.ROW;
    } else if (isColFilled(col, newBoard)) {
      animationType = ANIMATION_TYPE.COL;
    }

    // Clear timeout cũ nếu có
    if (timeoutRefs.current[key]) {
      clearTimeout(timeoutRefs.current[key]);
    }
    // Set lại animation
    setAnimatedCells(prev => ({ ...prev, [key]: animationType }));
    // Tạo timeout mới
    timeoutRefs.current[key] = setTimeout(() => {
      setAnimatedCells(prev => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
      delete timeoutRefs.current[key]; // Xóa timeoutRef sau khi done
    }, ANIMATION_DURATION);
  };

  const handleCheckSolved = (newBoard: (number | null)[][]) => {
    if (checkBoardIsSolved(newBoard, solvedBoard)) {
      setIsPlaying(false);
      setIsPaused(true);

      Alert.alert(
        '🎉 Hoàn thành!',
        'Bạn đã giải xong Sudoku!',
        [
          {
            text: 'Quay về Main',
            onPress: async () => {
              await AsyncStorage.removeItem('savedGame');
              navigation.goBack();   // quay lại MainScreen
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  useAppPause(
    () => {
      if (!isPaused) {
        setTimeout(async () => {
          try {
            await handlePause();
          } catch (error) {
            console.error('AppStateChange:', error);
          }
        }, 100);
      }
    },
    () => {
      setIsPaused(true);
      setShowPauseModal(true);
    },
  );

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <Header onBack={handleBackPress} />
      <InfoPanel
        level={savedLevel}
        mistakes={mistakeCount}
        time={seconds}
        isPaused={isPaused}
        onPause={handlePause}
      />
      <Grid
        board={board}
        cages={cages}
        notes={notes}
        solvedBoard={solvedBoard}
        selectedCell={selectedCell}
        onSelectedCell={setSelectedCell}
        animatedCells={animatedCells}
      />
      <ActionButtons
        noteMode={noteMode}
        onNote={setNoteMode}
        onUndo={handleUndo}
        onErase={handleErase}
        onSolved={handleSolved}
      />
      <NumberPad
        onSelectNumber={handleNumberPress}
      />
      <PauseModal
        visible={showPauseModal}
        level={level}
        mistake={mistakeCount}
        time={seconds}
        onResume={handleResume}
      />
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center' as const,
  },
};

export default BoardScreen;
