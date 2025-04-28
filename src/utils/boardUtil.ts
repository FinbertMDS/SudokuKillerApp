// boardUtil.ts

/**
 * Chuyển string thành mảng 2 chiều theo số cột nhất định (thường là 9 với Sudoku).
 * @param input string
 * @param size Số cột trong mảng 2 chiều
 * @returns Mảng 2 chiều
 */
export function stringToGrid(input: string, columns = 9): (number | null)[][] {
  const grid: (number | null)[][] = [];
  for (let i = 0; i < input.length; i += columns) {
    const row = input
      .slice(i, i + columns)
      .split('')
      .map(ch => (ch === '-' ? null : parseInt(ch, 10)));
    grid.push(row);
  }
  return grid;
}

/**
 * Tạo mảng 9x9x9 cho mỗi note
 * @returns Mảng 9x9x9
 */
export function createEmptyGridNotes<T>(): T[][][] {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => [])
  );
}

/**
 * Chuyển mảng 1 chiều thành mảng 2 chiều theo số cột nhất định (thường là 9 với Sudoku).
 * @param arr Mảng 1 chiều
 * @param size Số cột trong mảng 2 chiều
 * @returns Mảng 2 chiều
 */
export function convertTo2D<T>(arr: T[], size: number = 9): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/**
 * Chuyển mảng 2 chiều về mảng 1 chiều.
 * @param matrix Mảng 2 chiều
 * @returns Mảng 1 chiều
 */
export function convertTo1D<T>(matrix: T[][]): T[] {
  return matrix.flat();
}

/**
 * Kiểm tra một mảng có chứa toàn bộ số từ 1 đến 9 không.
 * Dùng để kiểm tra hàng, cột, hoặc khối 3x3 hợp lệ.
 * @param nums Mảng số
 */
export function isValidSet(nums: number[]): boolean {
  const set = new Set(nums);
  for (let i = 1; i <= 9; i++) {
    if (!set.has(i)) return false;
  }
  return true;
}

/**
 * Tạo mảng 9x9 với giá trị mặc định.
 * @param defaultValue Giá trị mặc định cho mỗi ô
 */
export function createEmptyGrid<T>(defaultValue: T): T[][] {
  return Array.from({ length: 9 }, () => Array(9).fill(defaultValue));
}

/**
 * Kiểm tra một vị trí trong grid có nằm trong ranh giới không
 */
export function isValidPosition(row: number, col: number): boolean {
  return row >= 0 && row < 9 && col >= 0 && col < 9;
}

/**
 * Chuyển index trong mảng 1 chiều thành tọa độ (row, col) trong mảng 2 chiều.
 * @param index Chỉ số trong mảng 1D
 * @param size Số cột của mảng 2D (mặc định là 9 cho Sudoku)
 * @returns Đối tượng { row, col }
 */
export function indexToPosition(index: number, size: number = 9): { row: number, col: number } {
  return {
    row: Math.floor(index / size),
    col: index % size,
  };
}

/**
 * Chuyển từ (row, col) trong mảng 2D sang index trong mảng 1D
 * @param row Dòng
 * @param col Cột
 * @param size Số cột của mảng 2D (mặc định là 9)
 * @returns Index trong mảng 1D
 */
export function positionToIndex(row: number, col: number, size: number = 9): number {
  return row * size + col;
}

/**
 * Deep clone a 2D array (for board)
 */
export const deepCloneBoard = (board: (number | null)[][]): (number | null)[][] => {
  return board.map(row => [...row]);
};

/**
 * Deep clone a 3D array (for notes)
 */
export const deepCloneNotes = (notes: string[][][]): string[][][] => {
  return notes.map(row =>
    row.map(cell =>
      [...cell]
    )
  );
};

/**
 * Kiểm tra xem board đã được giải quyết hay chưa.
 * @param board Mảng 2 chiều đại diện cho board
 * @param solvedBoard Mảng 2 chiều đại diện cho board đã được giải quyết
 * @returns true nếu đã giải quyết, false nếu chưa
 */
export const checkBoardIsSolved = (
  board: (number | null)[][],
  solvedBoard: (number | null)[][]
): boolean => {
  if (board.length !== solvedBoard.length) {
    return false;
  }

  return board.every((row, rowIndex) =>
    row.length === solvedBoard[rowIndex].length &&
    row.every((cell, colIndex) => cell === solvedBoard[rowIndex][colIndex])
  );
};


import { Cage } from '../types';
import { BOARD_SIZE } from './constants';

export function sortAreasCells(areas: Cage[]): Cage[] {
  return areas.map(cage => ({
    ...cage,
    cells: [...cage.cells].sort((a, b) => {
      if (a[0] !== b[0]) {
        // Ưu tiên hàng (row) trước
        return a[0] - b[0];
      }
      // Nếu cùng hàng, ưu tiên cột (col)
      return a[1] - b[1];
    }),
  }));
}

export function getAdjacentCellsInSameCage(row: number, col: number, cages: Cage[]) {
  // Danh sách các vị trí xung quanh: trên, dưới, trái, phải
  const adjacentCells = [
    { direction: 'top', row: row - 1, col: col },
    { direction: 'bottom', row: row + 1, col: col },
    { direction: 'left', row: row, col: col - 1 },
    { direction: 'right', row: row, col: col + 1 },
  ];

  const result = {
    top: false,
    bottom: false,
    left: false,
    right: false,
    topleft: false,
    topright: false,
    bottomleft: false,
    bottomright: false,
  };

  // Duyệt qua tất cả các cage để tìm các ô xung quanh thuộc cùng *cage*
  for (let cage of cages) {
    let currentCell = [row, col];

    // Kiểm tra nếu ô hiện tại có trong cage
    if (cage.cells.some(cell => JSON.stringify(cell) === JSON.stringify(currentCell))) {
      // Duyệt qua các ô xung quanh
      for (let adj of adjacentCells) {
        // Kiểm tra nếu ô xung quanh có trong cùng một cage
        if (cage.cells.some(cell => JSON.stringify(cell) === JSON.stringify([adj.row, adj.col]))) {
          result[adj.direction as keyof typeof result] = true;  // Gán true cho ô xung quanh nếu thuộc cùng cage
        }
        // Kiểm tra nếu ô ở phía trên bên trái có trong cùng một cage
        if (adj.direction === 'top' && cage.cells.some(cell => JSON.stringify(cell) === JSON.stringify([row - 1, col - 1]))) {
          result.topleft = true;  // Gán true cho ô trên bên trái nếu thuộc cùng cage
        }
        // Kiểm tra nếu ô ở phía trên bên phải có trong cùng một cage
        if (adj.direction === 'top' && cage.cells.some(cell => JSON.stringify(cell) === JSON.stringify([row - 1, col + 1]))) {
          result.topright = true;  // Gán true cho ô trên bên phải nếu thuộc cùng cage
        }
        // Kiểm tra nếu ô ở phía dưới bên trái có trong cùng một cage
        if (adj.direction === 'bottom' && cage.cells.some(cell => JSON.stringify(cell) === JSON.stringify([row + 1, col - 1]))) {
          result.bottomleft = true;  // Gán true cho ô dưới bên trái nếu thuộc cùng cage
        }
        // Kiểm tra nếu ô ở phía dưới bên phải có trong cùng một cage
        if (adj.direction === 'bottom' && cage.cells.some(cell => JSON.stringify(cell) === JSON.stringify([row + 1, col + 1]))) {
          result.bottomright = true;  // Gán true cho ô dưới bên phải nếu thuộc cùng cage
        }
      }
      break;  // Nếu đã tìm được cage, không cần duyệt qua các cage khác nữa
    }
  }

  return result;
}
