import React from 'react';

import { generate, solve } from 'sudoku-core';
import BoardScreen from './BoardScreen';
import { convertTo2D } from './utils';

function App(): React.JSX.Element {
  const boardBase = generate("easy");

  const solvedBoard = solve(boardBase);

  const sampleCages = [
    { id: 1, sum: 10, cells: [[0, 0], [0, 1]] },
    { id: 2, sum: 15, cells: [[0, 2], [1, 2], [2, 2]] },
    { id: 3, sum: 12, cells: [[0, 3], [0, 4]] },
    { id: 4, sum: 14, cells: [[1, 0], [1, 1]] },
    { id: 5, sum: 17, cells: [[1, 3], [2, 3]] },
    { id: 6, sum: 16, cells: [[0, 5], [0, 6], [1, 6]] },
    { id: 7, sum: 8,  cells: [[2, 0], [3, 0]] },
    { id: 8, sum: 13, cells: [[2, 1], [2, 4]] },
    { id: 9, sum: 11, cells: [[3, 1], [3, 2], [3, 3]] },
  ];

  return (
    <BoardScreen board={convertTo2D(boardBase)} solvedBoard={convertTo2D(solvedBoard.board)} cages={sampleCages} />
  );
}

export default App;
