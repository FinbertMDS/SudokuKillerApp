export interface CellPosition {
  row: number;
  col: number;
}

export interface Cage {
  cells: CellPosition[];
  total: number; // tổng yêu cầu
}

export type RootStackParamList = {
  HomeTabs: undefined;
  Board: SavedGame;
};

export type SavedGame = {
  initialBoard: number[][];
  solvedBoard: number[][];
  cages: { id: number, cells: [number, number][], sum: number }[];
  savedBoard: number[][];
  savedMistakeCount: number;
  savedElapsedTime: number; // thời gian đã trôi qua
  lastSaved: Date; // thời gian lưu gần nhất
  savedHistory: number[][][]; // lịch sử các bước đã đi
}
