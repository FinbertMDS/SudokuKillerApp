// Đã cập nhật: luôn ghi đè số vào ô, và hiển thị màu đỏ nếu là giá trị sai
import React, { useEffect, useRef, useState } from 'react';
import { Alert, AppState, AppStateStatus, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { hint } from 'sudoku-core';
import { convertTo1D, indexToPosition } from './utils';

const BOARD_SIZE = 9;
const CELL_SIZE = 40;
const TIMEOUT_DURATION = 2 * 60 * 60 * 1000; // 2h
const MAX_MISTAKES = 5;

const BoardScreen = ({ board: initialBoard, cages, solvedBoard }: {
  board: number[][],
  cages: { id: number, cells: [number, number][], sum: number }[],
  solvedBoard: number[][],
}) => {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [board, setBoard] = useState<number[][]>(initialBoard);
  const [notes, setNotes] = useState<string[][][]>(
    Array.from({ length: BOARD_SIZE }, () =>
      Array.from({ length: BOARD_SIZE }, () => [])
    )
  );
  const [noteMode, setNoteMode] = useState<boolean>(false);
  const [history, setHistory] = useState<number[][][]>([]);
  const [mistakeCount, setMistakeCount] = useState<number>(0);

  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseTime, setPauseTime] = useState(0);
  const [pausedDuration, setPausedDuration] = useState(0);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [timeAlertShown, setTimeAlertShown] = useState(false);

  useEffect(() => {
    if (elapsedTime > TIMEOUT_DURATION && !timeAlertShown) {
      setTimeAlertShown(true);
      Alert.alert('⏰ Time Warning', 'Bạn đã chơi hơn 10 giây rồi!');
      handleResetGame();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsedTime, timeAlertShown]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime - pausedDuration);
      }, 1000);
    } else {
      if (intervalRef.current) {clearInterval(intervalRef.current);}
    }

    return () => {
      if (intervalRef.current) {clearInterval(intervalRef.current);}
    };
  }, [isPaused, startTime, pausedDuration]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pauseTime, pausedDuration, isPaused]);

  const handleResetGame = () => {
    if (intervalRef.current) {clearInterval(intervalRef.current);}
    // setStartTime(Date.now());
    setElapsedTime(0);
    setIsPaused(false);
    setPausedDuration(0);
    setShowPauseModal(false);
    setTimeAlertShown(false);
    setSelectedCell(null);
    setNoteMode(false);
    setPauseTime(0);
    setBoard(initialBoard);
    setNotes(Array.from({ length: BOARD_SIZE }, () => Array.from({ length: BOARD_SIZE }, () => [])));
    setHistory([]);
    setMistakeCount(0);
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.current.match(/active/) && nextAppState.match(/inactive|background/)) {
      if (!isPaused) {
        handlePause();
      }
    }
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      if (isPaused) {
        setShowPauseModal(true); // tự động hiển thị lại popup khi quay lại
      }
    }
    appState.current = nextAppState;
  };

  const handlePause = () => {
    setPauseTime(Date.now());
    setIsPaused(true);
    setShowPauseModal(true);
  };

  const handleResume = () => {
    const pauseDuration = Date.now() - pauseTime;
    setPausedDuration(prev => prev + pauseDuration);
    setIsPaused(false);
    setShowPauseModal(false);
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (mistakeCount > MAX_MISTAKES) {
      Alert.alert('Too many mistakes', 'You have made more than 5 mistakes. Please be careful!');
    }
  }, [mistakeCount]);

  const handleNumberPress = (num: number) => {
    if (!selectedCell) {return;}
    const { row, col } = selectedCell;

    if (board[row][col] && board[row][col] === solvedBoard[row][col]) {
      return; // Do nothing if the number is already in the cell
    }

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
      if (num !== correctValue) {
        setMistakeCount(prev => prev + 1);
      }
      const newBoard = [...board];
      newBoard[row][col] = num;
      setBoard(newBoard);
      const newNotes = [...notes];
      newNotes[row][col] = [];
      setNotes(newNotes);
    }
  };

  const saveHistory = () => {
    const boardCopy = board.map(row => [...row]);
    setHistory(prev => [...prev, boardCopy]);
  };

  const handleUndo = () => {
    if (history.length === 0) {return;}
    const lastState = history[history.length - 1];
    setBoard(lastState);
    setHistory(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (!selectedCell) {return;}
    if (initialBoard[selectedCell.row][selectedCell.col]) {return;}
    const { row, col } = selectedCell;
    saveHistory();
    const newBoard = [...board];
    newBoard[row][col] = 0;
    setBoard(newBoard);
    const newNotes = [...notes];
    newNotes[row][col] = [];
    setNotes(newNotes);
  };

  const isCellInSameRowOrColOrBox = (row: number, col: number) => {
    if (!selectedCell) {return false;}
    const selRow = selectedCell.row;
    const selCol = selectedCell.col;
    const inSameBox = Math.floor(selRow / 3) === Math.floor(row / 3) && Math.floor(selCol / 3) === Math.floor(col / 3);
    return selRow === row || selCol === col || inSameBox;
  };

  const getCageForCell = (row: number, col: number) => {
    return cages.find(cage => cage.cells.some(cell => cell[0] === row && cell[1] === col));
  };

  const renderCageOutlines = () => {
    return cages.map((cage) => {
      const rows = cage.cells.map(([r]) => r);
      const cols = cage.cells.map(([, c]) => c);
      const minRow = Math.min(...rows);
      const maxRow = Math.max(...rows);
      const minCol = Math.min(...cols);
      const maxCol = Math.max(...cols);

      const x = minCol * CELL_SIZE + 3;
      const y = minRow * CELL_SIZE + 3;
      const width = (maxCol - minCol + 1) * CELL_SIZE - 6;
      const height = (maxRow - minRow + 1) * CELL_SIZE - 6;

      return (
        <Rect
          key={`cage-${cage.id}`}
          x={x}
          y={y}
          width={width}
          height={height}
          stroke="gray"
          strokeDasharray="4,4"
          strokeWidth={1}
          fill="none"
        />
      );
    });
  };

  const renderCell = (row: number, col: number) => {
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    const isRelated = isCellInSameRowOrColOrBox(row, col);
    const cellValue = board[row][col];
    const cellNotes = notes[row][col];
    const cage = getCageForCell(row, col);
    const isCageFirst = cage?.cells[0][0] === row && cage?.cells[0][1] === col;
    const isMistake = cellValue !== 0 && cellValue !== solvedBoard[row][col];

    return (
      <View key={`${row}-${col}`} style={styles.cellWrapper}>
        {isRelated && !isSelected && <View style={styles.relatedOverlay} />}
        {isSelected && <View style={styles.selectedOverlay} />}
        <TouchableOpacity
          style={styles.cell}
          onPress={() => setSelectedCell({ row, col })}
        >
          {isCageFirst && <Text style={styles.cageText}>{cage?.sum}</Text>}
          <View style={styles.notesContainerTop}>
            {Array.from({ length: 9 }, (_, i) => (
              <Text key={i} style={styles.noteText}>
                {cellNotes.includes((i + 1).toString()) ? i + 1 : ' '}
              </Text>
            ))}
          </View>
          {cellValue !== 0 && (
            <Text
              style={[styles.cellText, isMistake && { color: 'red' }]}
            >
              {cellValue}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const handleHint = () => {
    saveHistory();

    const solvedBoard = hint(convertTo1D(board));
    if (solvedBoard.steps && solvedBoard.steps.length > 0) {
      const { row, col } = indexToPosition(solvedBoard.steps[0].updates[0].index);
      setSelectedCell({ row, col });

      const newBoard = [...board];
      newBoard[row][col] = solvedBoard.steps[0].updates[0].filledValue;
      setBoard(newBoard);
    }
  };

  const buttons = [
    { label: 'Undo', icon: 'undo', onPress: handleUndo },
    { label: 'Erase', icon: 'eraser', onPress: handleClear },
    { label: 'Notes', icon: 'note-edit-outline', onPress: () => setNoteMode(!noteMode) },
    { label: 'Hint', icon: 'lightbulb-on-outline', onPress: handleHint },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.mistakesText}>Mistakes: {mistakeCount}/5</Text>
        <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
        <TouchableOpacity onPress={handlePause}>
          <Text style={styles.pauseButton}>⏸</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showPauseModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>Đã dừng</Text>
            <TouchableOpacity onPress={handleResume}>
              <Text style={styles.resumeButton}>Tiếp tục</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.gridWrapper}>
        <View style={styles.grid}>
          {board.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
            </View>
          ))}
        </View>
        <Svg
          width={CELL_SIZE * BOARD_SIZE}
          height={CELL_SIZE * BOARD_SIZE}
          style={[StyleSheet.absoluteFill, { zIndex: 10 }]}
        >
          {renderCageOutlines()}
        </Svg>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: 300, marginBottom: 12 }}>
        {buttons.map((btn, idx) => (
          <TouchableOpacity key={idx} onPress={btn.onPress} style={styles.actionButtonList}>
            <View style={{ marginBottom: 4 }}>
              <MaterialCommunityIcons name={btn.icon} size={24} color="#333" style={{ marginBottom: 4 }} />
            </View>
            <Text>{btn.label}{btn.label === 'Notes' && noteMode ? ' (On)' : ''}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.numberPad}>
        {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
          <TouchableOpacity key={num} style={styles.numberButton} onPress={() => handleNumberPress(num)}>
            <Text style={styles.numberText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center' },
  mistakesText: { fontSize: 16, color: '#888' },
  timerText: { fontSize: 16, color: '#888', marginLeft: 30 },
  pauseButton: { fontSize: 20, paddingLeft: 10, color: '#888' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { backgroundColor: 'white', padding: 20, borderRadius: 10 },
  modalText: { fontSize: 18, textAlign: 'center', marginBottom: 10 },
  resumeButton: { fontSize: 16, color: '#007bff', textAlign: 'center' },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  gridWrapper: {
    width: CELL_SIZE * BOARD_SIZE,
    height: CELL_SIZE * BOARD_SIZE,
  },
  grid: {
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  row: {
    flexDirection: 'row',
  },
  cellWrapper: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    position: 'relative',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#d0e8ff',
    zIndex: 5,
  },
  cell: {
    flex: 1,
    borderWidth: 0.2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 20,
  },
  relatedOverlay: {
    backgroundColor: '#f0f8ff',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 4,
  },
  cellText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  notesContainerTop: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  noteText: {
    fontSize: 8,
    width: 10,
    textAlign: 'center',
    color: '#888',
  },
  cageText: {
    position: 'absolute',
    top: 2,
    left: 4,
    fontSize: 10,
    color: '#555',
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  numberButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 24,
  },
  placeholderText: {
    color: '#9ca3af',
  },
  actionButtonList: {
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 12,
  },
});

export default BoardScreen;
