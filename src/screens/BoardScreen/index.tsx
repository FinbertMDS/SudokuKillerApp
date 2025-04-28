import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, View } from 'react-native';
import ActionButtons from '../../components/Board/ActionButtons';
import Grid from '../../components/Board/Grid';
import Header from '../../components/Board/Header';
import InfoPanel from '../../components/Board/InfoPanel';
import NumberPad from '../../components/Board/NumberPad';
import PauseModal from '../../components/Board/PauseModal';
import { useAppPause } from '../../hooks/useAppPause';
import { BoardService } from '../../services/BoardService';
import { BoardScreenNavigationProp, BoardScreenRouteProp, Cell, InitGame, SavedGame } from '../../types';
import { checkBoardIsSolved, createEmptyGridNotes, deepCloneBoard, deepCloneNotes } from '../../utils/boardUtil';
import { ANIMATION_CELL_KEY_SEPARATOR, ANIMATION_DURATION, ANIMATION_TYPE, BOARD_SIZE, DIFFICULTY_ALL, MAX_MISTAKES, TIMEOUT_DURATION } from '../../utils/constants';

const BoardScreen = () => {
  const route = useRoute<BoardScreenRouteProp>();
  const navigation = useNavigation<BoardScreenNavigationProp>();
  const {
    initialBoard,
    solvedBoard,
    cages,
    savedLevel,
    savedBoard,
    savedMistakeCount,
    savedElapsedTime,
    savedHistory,
  } = route.params as InitGame & SavedGame;

  const [board, setBoard] = useState<(number | null)[][]>(savedBoard ? deepCloneBoard(savedBoard) : deepCloneBoard(initialBoard));
  const [mistakeCount, setMistakeCount] = useState<number>(savedMistakeCount ? savedMistakeCount : 0);

  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [level] = useState<string>(savedLevel ? savedLevel : DIFFICULTY_ALL[0]);

  const [history, setHistory] = useState(() =>
    savedHistory !== undefined ? savedHistory : [deepCloneBoard(initialBoard)]
  );
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [pauseTime, setPauseTime] = useState(0);
  const [pausedDuration, setPausedDuration] = useState(0);
  const [noteMode, setNoteMode] = useState<boolean>(false);
  const [notes, setNotes] = useState<string[][][]>(
    createEmptyGridNotes<string>()
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
  const [startTime] = useState(() =>
    savedElapsedTime !== undefined ? Date.now() - savedElapsedTime : Date.now()
  );
  const [elapsedTime, setElapsedTime] = useState(
    savedElapsedTime !== undefined ? savedElapsedTime : 0
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime - pausedDuration);
      }, 1000);
    } else {
      if (intervalRef.current) { clearInterval(intervalRef.current); }
    }

    return () => {
      if (intervalRef.current) { clearInterval(intervalRef.current); }
    };
  }, [isPaused, startTime, pausedDuration]);
  // ===========================================================

  // Xử lý quá thời gian chơi
  // ===========================================================
  const [timeAlertShown, setTimeAlertShown] = useState(false);
  useEffect(() => {
    if (elapsedTime > TIMEOUT_DURATION && !timeAlertShown) {
      setTimeAlertShown(true);
      Alert.alert('⏰ Time Warning', 'Bạn đã chơi hơn 10 giây rồi!');
      handleResetGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsedTime, timeAlertShown]);

  const handleResetGame = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); }
    // setStartTime(Date.now());
    setElapsedTime(0);
    setIsPaused(false);
    setPausedDuration(0);
    setTimeAlertShown(false);
    setSelectedCell(null);
    setNoteMode(false);
    setPauseTime(0);
    setBoard(deepCloneBoard(initialBoard));
    setNotes(createEmptyGridNotes<string>());
    setHistory([]);
    setMistakeCount(0);
  };
  // ===========================================================

  // Xử lý animation khi nhập xong 1 hàng/cột
  const [animatedCells, setAnimatedCells] = useState<{ [key: string]: number }>({});

  const handlePause = async () => {
    setIsPaused(true);
    setPauseTime(Date.now());
    await BoardService.save({
      savedBoard: board,
      savedMistakeCount: mistakeCount,
      savedElapsedTime: elapsedTime,
      savedHistory: history,
      lastSaved: new Date(),
    } as SavedGame);
  };

  const handleResume = () => {
    setIsPaused(false);
    setPausedDuration(prev => prev + Date.now() - pauseTime);
  };

  const saveHistory = (newBoard: (number | null)[][]) => {
    setHistory(prev => [...prev, deepCloneBoard(newBoard)]);
  };

  const handleUndo = () => {
    if (history.length <= 1) { return; }

    const lastState = history[history.length - 2];
    setBoard(deepCloneBoard(lastState));
    setHistory(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (!selectedCell) { return; }
    const { row, col } = selectedCell;
    if (initialBoard[row][col]) {
      console.log('You cannot clear a cell that is initialized cell');
      return;
    }
    if (board[row][col] === null || board[row][col] === 0) {
      console.log('You cannot clear a cell that is already empty');
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
    setAnimatedCells(prev => ({ ...prev, [key]: animationType }));

    // Xóa animation sau 300ms để reset lại
    setTimeout(() => {
      setAnimatedCells(prev => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }, ANIMATION_DURATION);
  };

  const handleCheckSolved = (newBoard: (number | null)[][]) => {
    if (checkBoardIsSolved(newBoard, solvedBoard)) {
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

  const handleBackPress = async () => {
    await BoardService.save({
      savedBoard: board,
      savedMistakeCount: mistakeCount,
      savedElapsedTime: elapsedTime,
      savedHistory: history,
      lastSaved: new Date(),
    } as SavedGame);
    navigation.goBack();
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
    () => { setIsPaused(true); }
  );

  return (
    <View style={styles.container}>
      <Header onBack={handleBackPress} />
      <InfoPanel
        level={savedLevel}
        mistakes={mistakeCount}
        time={elapsedTime}
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
        onClear={handleClear}
        onSolved={handleSolved}
      />
      <NumberPad
        onSelectNumber={handleNumberPress}
      />
      <PauseModal
        visible={isPaused}
        level={level}
        mistake={mistakeCount}
        elapsedTime={elapsedTime}
        onResume={handleResume}
      />
    </View>
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
