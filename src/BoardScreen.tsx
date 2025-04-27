// Đã cập nhật: luôn ghi đè số vào ô, và hiển thị màu đỏ nếu là giá trị sai
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, AppState, AppStateStatus, Button, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList, SavedGame } from './types';
import { checkIfBoardIsSolved, getAdjacentCellsInSameCage } from './utils';

const BOARD_SIZE = 9;
const CELL_SIZE = 40;
const TIMEOUT_DURATION = 2 * 60 * 60 * 1000; // 2h
const MAX_MISTAKES = 5;

type BoardScreenRouteProp = RouteProp<RootStackParamList, 'Board'>;
type BoardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Board'>;


function BoardScreen() {
  const route = useRoute<BoardScreenRouteProp>();
  const navigation = useNavigation<BoardScreenNavigationProp>();
  const { level, initialBoard, solvedBoard, cages, savedBoard, savedMistakeCount, savedElapsedTime, savedHistory } = route.params;

  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [board, setBoard] = useState<number[][]>(savedBoard ? savedBoard : initialBoard);
  const [notes, setNotes] = useState<string[][][]>(
    Array.from({ length: BOARD_SIZE }, () =>
      Array.from({ length: BOARD_SIZE }, () => [])
    )
  );
  const [noteMode, setNoteMode] = useState<boolean>(false);
  const [history, setHistory] = useState(() =>
    savedHistory !== undefined ? savedHistory : []
  );
  const [mistakeCount, setMistakeCount] = useState<number>(savedMistakeCount ? savedMistakeCount : 0);

  const [startTime,] = useState(() =>
    savedElapsedTime !== undefined ? Date.now() - savedElapsedTime : Date.now()
  );
  const [elapsedTime, setElapsedTime] = useState(
    savedElapsedTime !== undefined ? savedElapsedTime : 0
  );
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
      if (intervalRef.current) { clearInterval(intervalRef.current); }
    }

    return () => {
      if (intervalRef.current) { clearInterval(intervalRef.current); }
    };
  }, [isPaused, startTime, pausedDuration]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pauseTime, pausedDuration, isPaused]);

  const handleResetGame = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); }
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

  const saveGameState = async () => {
    try {
      const state = {
        initialBoard,
        solvedBoard,
        cages,
        savedBoard: board,
        savedMistakeCount: mistakeCount,
        savedElapsedTime: elapsedTime,
        savedHistory: history,
        lastSaved: new Date(),
        // các trạng thái khác nếu cần
      } as SavedGame;
      await AsyncStorage.setItem('savedGame', JSON.stringify(state));
    } catch (e) {
      console.error('Lỗi khi lưu game:', e);
    }
  };

  const handleBackPress = async () => {
    await saveGameState();
    navigation.goBack();
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
  }

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

  const isCellInSameRowOrColOrBox = (row: number, col: number) => {
    if (!selectedCell) { return false; }
    const selRow = selectedCell.row;
    const selCol = selectedCell.col;
    const inSameBox = Math.floor(selRow / 3) === Math.floor(row / 3) && Math.floor(selCol / 3) === Math.floor(col / 3);
    return selRow === row || selCol === col || inSameBox;
  };

  const getCageForCell = (row: number, col: number) => {
    return cages.find(cage => cage.cells.some(cell => cell[0] === row && cell[1] === col));
  };

  // const renderCageOutlines = () => {
  //   return cages.map((cage, index) => {
  //     const rows = cage.cells.map(([r]) => r);
  //     const cols = cage.cells.map(([, c]) => c);
  //     const minRow = Math.min(...rows);
  //     const maxRow = Math.max(...rows);
  //     const minCol = Math.min(...cols);
  //     const maxCol = Math.max(...cols);

  //     const x = minCol * CELL_SIZE + 3;
  //     const y = minRow * CELL_SIZE + 3;
  //     const width = (maxCol - minCol + 1) * CELL_SIZE - 6;
  //     const height = (maxRow - minRow + 1) * CELL_SIZE - 6;

  //     return (
  //       <Rect
  //         key={`cage-${index}`}
  //         x={x}
  //         y={y}
  //         width={width}
  //         height={height}
  //         stroke="gray"
  //         strokeDasharray="4,4"
  //         strokeWidth={1}
  //         fill="red"
  //       />
  //     );
  //   });
  // };
  const renderCageBorders = () => {
    const PADDING = 3;

    // Map từ (row,col) => cage index
    const cageMap = new Map<string, number>();
    cages.forEach((cage, index) => {
      for (const [r, c] of cage.cells) {
        cageMap.set(`${r},${c}`, index);
      }
    });

    const lines = [];

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const thisCageIdx = cageMap.get(`${r},${c}`);

        if (thisCageIdx == null) continue; // bỏ qua ô không thuộc cage nào

        const adjacentCells = getAdjacentCellsInSameCage(r, c, cages);

        // 1. Vẽ bên phải nếu neighbor khác cage
        if (c <= 8) {
          const rightCageIdx = cageMap.get(`${r},${c + 1}`);
          if (thisCageIdx !== rightCageIdx) {
            lines.push(
              <Line
                key={`right-${r}-${c}`}
                x1={(c + 1) * CELL_SIZE - PADDING}
                y1={r * CELL_SIZE + (adjacentCells.top ? 0 : PADDING)}
                x2={(c + 1) * CELL_SIZE - PADDING}
                y2={(r + 1) * CELL_SIZE - (adjacentCells.bottom ? 0 : PADDING)}
                stroke="gray"
                strokeWidth={1}
                strokeDasharray="2,2"
                strokeLinecap="round"
              />
            );
          }
        }

        // 2. Vẽ bên dưới nếu neighbor khác cage
        if (r <= 8) {
          const bottomCageIdx = cageMap.get(`${r + 1},${c}`);
          if (thisCageIdx !== bottomCageIdx) {
            lines.push(
              <Line
                key={`bottom-${r}-${c}`}
                x1={c * CELL_SIZE + (adjacentCells.left ? 0 : PADDING)}
                y1={(r + 1) * CELL_SIZE - PADDING}
                x2={(c + 1) * CELL_SIZE - (adjacentCells.right ? 0 : PADDING)}
                y2={(r + 1) * CELL_SIZE - PADDING}
                stroke="gray"
                strokeWidth={1}
                strokeDasharray="2,2"
                strokeLinecap="round"
              />
            );
          }
        }

        // 3. Vẽ bên trái nếu là cột 0 hoặc neighbor left khác cage
        if (c === 0 || cageMap.get(`${r},${c - 1}`) !== thisCageIdx) {
          lines.push(
            <Line
              key={`left-${r}-${c}`}
              x1={c * CELL_SIZE + PADDING}
              y1={r * CELL_SIZE + (adjacentCells.top ? 0 : PADDING)}
              x2={c * CELL_SIZE + PADDING}
              y2={(r + 1) * CELL_SIZE - (adjacentCells.bottom ? 0 : PADDING)}
              stroke="gray"
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />
          );
        }

        // 4. Vẽ bên trên nếu là hàng 0 hoặc neighbor top khác cage
        if (r === 0 || cageMap.get(`${r - 1},${c}`) !== thisCageIdx) {
          lines.push(
            <Line
              key={`top-${r}-${c}`}
              x1={c * CELL_SIZE + (adjacentCells.left ? (adjacentCells.right ? -PADDING : 0) : PADDING)}
              y1={r * CELL_SIZE + PADDING}
              x2={(c + 1) * CELL_SIZE - (adjacentCells.right ? 0 : PADDING)}
              y2={r * CELL_SIZE + PADDING}
              stroke="gray"
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />
          );
        }

        // 5. Vẽ góc phần tư thứ nhất nếu có neighbor trên và bên trái cùng cage
        if (adjacentCells.top && adjacentCells.left && !adjacentCells.topleft) {
          lines.push(
            <Line
              key={`top-left-corner-${r}-${c}`}
              x1={c * CELL_SIZE}
              y1={r * CELL_SIZE + PADDING}
              x2={c * CELL_SIZE + PADDING}
              y2={r * CELL_SIZE + PADDING}
              stroke="gray"
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
            <Line
              key={`top-left-corner-${r}-${c}-2`}
              x1={c * CELL_SIZE + PADDING}
              y1={r * CELL_SIZE}
              x2={c * CELL_SIZE + PADDING}
              y2={r * CELL_SIZE + PADDING}
              stroke="gray"
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
          );
        }

        // 6. Vẽ góc phần tư thứ hai nếu có neighbor trên và bên phải cùng cage
        if (adjacentCells.top && adjacentCells.right && !adjacentCells.topright) {
          lines.push(
            <Line
              key={`top-right-corner-${r}-${c}`}
              x1={(c + 1) * CELL_SIZE - PADDING}
              y1={r * CELL_SIZE + PADDING}
              x2={(c + 1) * CELL_SIZE - PADDING}
              y2={r * CELL_SIZE + PADDING}
              stroke="gray"
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
            <Line
              key={`top-right-corner-${r}-${c}-2`}
              x1={(c + 1) * CELL_SIZE - PADDING}
              y1={r * CELL_SIZE}
              x2={(c + 1) * CELL_SIZE - PADDING}
              y2={r * CELL_SIZE + PADDING}
              stroke="gray"
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
          );
        }
        // 7. Vẽ góc phần tư thứ ba nếu có neighbor dưới và bên trái cùng cage
        if (adjacentCells.bottom && adjacentCells.left && !adjacentCells.bottomleft) {
          lines.push(
            <Line
              key={`bottom-left-corner-${r}-${c}`}
              x1={c * CELL_SIZE}
              y1={(r + 1) * CELL_SIZE - PADDING}
              x2={c * CELL_SIZE + PADDING}
              y2={(r + 1) * CELL_SIZE - PADDING}
              stroke="gray"
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
            <Line
              key={`bottom-left-corner-${r}-${c}-2`}
              x1={c * CELL_SIZE + PADDING}
              y1={(r + 1) * CELL_SIZE}
              x2={c * CELL_SIZE + PADDING}
              y2={(r + 1) * CELL_SIZE - PADDING}
              stroke="gray"
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
          );
        }
        // 8. Vẽ góc phần tư thứ tư nếu có neighbor dưới và bên phải cùng cage
        if (adjacentCells.bottom && adjacentCells.right && !adjacentCells.bottomright) {
          lines.push(
            <Line
              key={`bottom-right-corner-${r}-${c}`}
              x1={(c + 1) * CELL_SIZE - PADDING}
              y1={(r + 1) * CELL_SIZE - PADDING}
              x2={(c + 1) * CELL_SIZE - PADDING}
              y2={(r + 1) * CELL_SIZE - PADDING}
              stroke="gray"
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
            <Line
              key={`bottom-right-corner-${r}-${c}-2`}
              x1={(c + 1) * CELL_SIZE - PADDING}
              y1={(r + 1) * CELL_SIZE}
              x2={(c + 1) * CELL_SIZE - PADDING}
              y2={(r + 1) * CELL_SIZE - PADDING}
              stroke="gray"
              strokeWidth={1}
              strokeDasharray="2,2"
              strokeLinecap="round"
            />,
          );
        }

      }
    }

    return lines;
  }

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

  // const handleHint = () => {
  //   saveHistory();

  //   const hintBoard = hint(convertTo1D(board));
  //   if (hintBoard.steps && hintBoard.steps.length > 0) {
  //     const { row, col } = indexToPosition(hintBoard.steps[0].updates[0].index);
  //     setSelectedCell({ row, col });

  //     const newBoard = [...board];
  //     newBoard[row][col] = hintBoard.steps[0].updates[0].filledValue;
  //     setBoard(newBoard);

  //     handleCheckSolved(newBoard);
  //   }
  // };

  const displaySolvedBoard = () => {
    Alert.alert(
      'Giải pháp',
      'Toàn bộ bảng Sudoku đã giải',
      [{ text: 'OK' }],
      { cancelable: false }
    );

    setBoard(solvedBoard);
  };

  const buttons = [
    { label: 'Undo', icon: 'undo', onPress: handleUndo },
    { label: 'Erase', icon: 'eraser', onPress: handleClear },
    { label: 'Notes', icon: 'note-edit-outline', onPress: () => setNoteMode(!noteMode) },
    { label: 'Solved Board', icon: 'lightbulb-on-outline', onPress: displaySolvedBoard },
    // { label: 'Hint', icon: 'lightbulb-on-outline', onPress: handleHint },
  ];

  return (
    <View style={styles.container}>
      <Button title="← Back" onPress={handleBackPress} />

      <View style={styles.topBar}>
        <Text style={styles.topText}>Level: {level}</Text>
        {/* <Text style={styles.topText}>Score: {score}</Text> */}
      </View>
      <View style={styles.topBar}>
        <Text style={styles.topText}>Mistakes: {mistakeCount}/{MAX_MISTAKES}</Text>
        <Text style={styles.topText}>{formatTime(elapsedTime)}</Text>
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
          style={styles.cageBorder}
          >
          {renderCageBorders()}
        </Svg>
      </View>

      <View style={styles.actionButtons}>
        {buttons.map((btn, idx) => (
          <TouchableOpacity key={idx} onPress={btn.onPress} style={styles.actionButtonList}>
            <View style={styles.actionButtonList2}>
              <MaterialCommunityIcons name={btn.icon} size={24} color="#333" style={styles.actionButtonList2} />
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
  topBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', marginBottom: 10 },
  topText: { fontSize: 16, color: '#888', marginRight: 30 },
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
  title: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 20,
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
  cageBorder: {
    position: 'absolute',
    zIndex: 10,
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 300,
    marginBottom: 12,
  },
  actionButtonList2: {
    marginBottom: 4,
  },
});

export default BoardScreen;
