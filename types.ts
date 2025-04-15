export interface CellPosition {
  row: number;
  col: number;
}

export interface Cage {
  cells: CellPosition[];
  total: number; // tổng yêu cầu
}
