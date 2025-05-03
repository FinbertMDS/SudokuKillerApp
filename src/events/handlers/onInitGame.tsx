import {generateKillerSudoku} from 'killer-sudoku-generator';
import uuid from 'react-native-uuid';
import {Difficulty} from 'sudoku-gen/dist/types/difficulty.type';
import {CORE_EVENTS} from '..';
import {InitGame} from '../../types';
import {sortAreasCells, stringToGrid} from '../../utils/boardUtil';
import eventBus from '../eventBus';
import {InitGameCoreEvent} from '../types';

export const handleInitGame = async (payload: InitGameCoreEvent) => {
  const sudoku = generateKillerSudoku(payload.level as Difficulty);
  const initGame = {
    id: uuid.v4().toString(),
    initialBoard: stringToGrid(sudoku.puzzle),
    solvedBoard: stringToGrid(sudoku.solution),
    cages: sortAreasCells(sudoku.areas),
    savedLevel: payload.level,
  } as InitGame;
  eventBus.emit(CORE_EVENTS.gameStarted, {initGame});
};
