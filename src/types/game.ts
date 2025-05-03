export type Cell = {
  row: number;
  col: number;
  value: CellValue;
};

export type CellValue = number | null;

export interface Cage {
  sum: number;
  cells: [number, number][];
}

export type Level = 'easy' | 'medium' | 'hard' | 'expert';

export type InitGame = {
  initialBoard: CellValue[][];
  solvedBoard: number[][];
  cages: {cells: [number, number][]; sum: number}[];
  savedLevel: Level;
};

export type SavedGame = {
  savedBoard: CellValue[][];
  savedMistake: number;
  savedTimePlayed: number;
  savedHistory: CellValue[][][];
  savedNotes: string[][][];
  lastSaved: Date;
};
