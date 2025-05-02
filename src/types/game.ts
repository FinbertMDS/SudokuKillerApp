export type Cell = {
  row: number;
  col: number;
};

export type CellValue = number | null;

export interface Cage {
  sum: number;
  cells: [number, number][];
}

export type Level = 'easy' | 'medium' | 'hard' | 'expert';
