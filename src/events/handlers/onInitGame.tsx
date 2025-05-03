import {generateKillerSudoku} from 'killer-sudoku-generator';
import uuid from 'react-native-uuid';
import {CORE_EVENTS} from '..';
import {InitGame, Level} from '../../types';
import {
  increaseDifficulty,
  sortAreasCells,
  stringToGrid,
} from '../../utils/boardUtil';
import {LEVELS} from '../../utils/constants';
import eventBus from '../eventBus';
import {InitGameCoreEvent} from '../types';

export const handleInitGame = async (payload: InitGameCoreEvent) => {
  const adjustedDifficulty = increaseDifficulty(payload.level as Level);

  const sudoku = generateKillerSudoku(adjustedDifficulty);

  // if payload.level is expert
  const shouldHideAllCells = payload.level === LEVELS[LEVELS.length - 1];
  const puzzleString = shouldHideAllCells ? '-'.repeat(81) : sudoku.puzzle;

  const initGame = {
    id: uuid.v4().toString(),
    initialBoard: stringToGrid(puzzleString),
    solvedBoard: stringToGrid(sudoku.solution),
    cages: sortAreasCells(sudoku.areas),
    savedLevel: payload.level,
  } as InitGame;
  eventBus.emit(CORE_EVENTS.gameStarted, {initGame});
};
