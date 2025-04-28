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
import { BoardScreenNavigationProp, BoardScreenRouteProp, Cell, SavedGame } from '../../types';
import { checkIfBoardIsSolved, createEmptyGridNotes } from '../../utils/boardUtil';
import { DIFFICULTY_ALL, MAX_MISTAKES, TIMEOUT_DURATION } from '../../utils/constants';

const BoardScreen = () => {
  const route = useRoute<BoardScreenRouteProp>();
  const navigation = useNavigation<BoardScreenNavigationProp>();
  const { initialBoard, savedBoard, solvedBoard, cages, savedLevel, savedHistory, savedElapsedTime, savedMistakeCount } = route.params;

  const [board, setBoard] = useState<number[][]>(savedBoard ? savedBoard : initialBoard);
  const [mistakeCount, setMistakeCount] = useState<number>(savedMistakeCount ? savedMistakeCount : 0);

  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [level] = useState<string>(savedLevel ? savedLevel : DIFFICULTY_ALL[0]);

  const [history, setHistory] = useState(() =>
    savedHistory !== undefined ? savedHistory : []
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
    setBoard(initialBoard);
    setNotes(createEmptyGridNotes<string>());
    setHistory([]);
    setMistakeCount(0);
  };
  // ===========================================================

  const handlePause = async () => {
    setIsPaused(true);
    setPauseTime(Date.now());
    await BoardService.save({
      initialBoard,
      solvedBoard,
      cages,
      savedLevel: level,
      savedBoard: board,
      savedMistakeCount: mistakeCount,
      savedElapsedTime: elapsedTime,
      savedHistory: history,
    } as SavedGame);
  };

  const handleResume = () => {
    setIsPaused(false);
    setPausedDuration(prev => prev + Date.now() - pauseTime);
  };

  const saveHistory = () => {
    const boardCopy = board.map(row => [...row]);
    setHistory(prev => [...prev, boardCopy]);
  };

  const handleUndo = () => {
    if (history.length === 0) { return; }
    const lastState = history[history.length - 1];
    setBoard(lastState);
    setHistory(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (!selectedCell) { return; }
    if (initialBoard[selectedCell.row][selectedCell.col]) { return; }
    const { row, col } = selectedCell;
    saveHistory();
    const newBoard = [...board];
    newBoard[row][col] = 0;
    setBoard(newBoard);
    const newNotes = [...notes];
    newNotes[row][col] = [];
    setNotes(newNotes);
  };

  const handleSolved = () => {
    Alert.alert(
      'Giải pháp',
      'Toàn bộ bảng Sudoku đã giải',
      [{ text: 'OK' }],
      { cancelable: false }
    );

    setBoard(solvedBoard);
    saveHistory();
    // handleCheckSolved(solvedBoard);
  };

  const handleNumberPress = (num: number) => {
    if (!selectedCell) { return; }
    const { row, col } = selectedCell;

    saveHistory();

    if (noteMode) {
      const newNotes = [...notes];
      const cellNotes = newNotes[row][col];
      if (cellNotes.includes(num.toString())) {
        newNotes[row][col] = cellNotes.filter((n) => n !== num.toString());
      } else {
        newNotes[row][col] = [...cellNotes, num.toString()].sort();
      }
      setNotes(newNotes);
    } else {
      const correctValue = solvedBoard[row][col];
      const newBoard = [...board];
      newBoard[row][col] = num;
      setBoard(newBoard);
      const newNotes = [...notes];
      newNotes[row][col] = [];
      setNotes(newNotes);
      if (num !== correctValue) {
        setMistakeCount(prev => prev + 1);
      } else {
        handleCheckSolved(newBoard);
      }
    }
  };

  const handleCheckSolved = (newBoard: number[][]) => {
    if (checkIfBoardIsSolved(newBoard, solvedBoard)) {
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
      initialBoard,
      solvedBoard,
      cages,
      savedLevel: level,
      savedBoard: board,
      savedMistakeCount: mistakeCount,
      savedElapsedTime: elapsedTime,
      savedHistory: history,
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
