// utils.ts

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


import { Cage } from './types';

/**
 * Tính tổng các giá trị trong một cage từ grid
 * @param grid Bảng Sudoku (2D)
 * @param cage Cage chứa các ô
 * @returns Tổng hiện tại
 */
export function sumCage(grid: number[][], cage: Cage): number {
  return cage.cells.reduce((sum, { row, col }) => {
    const value = grid[row][col];
    return sum + (value || 0); // bỏ qua ô trống (0 hoặc undefined)
  }, 0);
}

/**
 * Kiểm tra xem cage có hợp lệ không:
 * - Tổng hiện tại <= tổng yêu cầu
 * - Không có số trùng lặp trong cage
 * @param grid Bảng Sudoku
 * @param cage Cage
 */
export function isCageValid(grid: number[][], cage: Cage): boolean {
  const seen = new Set<number>();
  let currentSum = 0;

  for (const { row, col } of cage.cells) {
    const value = grid[row][col];
    if (value) {
      if (seen.has(value)) return false;
      seen.add(value);
      currentSum += value;
    }
  }

  return currentSum <= cage.total;
}

/**
 * Kiểm tra xem cage đã hoàn thành và chính xác chưa
 * @param grid Bảng Sudoku
 * @param cage Cage
 */
export function isCageComplete(grid: number[][], cage: Cage): boolean {
  const values = cage.cells.map(({ row, col }) => grid[row][col]);
  if (values.includes(0) || values.some(value => value === undefined)) return false;

  const sum = values.reduce((a, b) => a + b, 0);
  const unique = new Set(values);

  return sum === cage.total && unique.size === values.length;
}

export function areAllCagesValid(grid: number[][], cages: Cage[]): boolean {
  return cages.every(cage => isCageValid(grid, cage));
}
