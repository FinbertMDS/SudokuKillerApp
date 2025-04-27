export interface Cage {
  sum: number;
  cells: [number, number][];
}

export type RootStackParamList = {
  HomeTabs: undefined;
  Board: SavedGame;
};

export type SavedGame = {
  score: number;
  initialBoard: number[][];
  solvedBoard: number[][];
  cages: { cells: [number, number][], sum: number }[];
  savedLevel: string;
  savedBoard: number[][];
  savedMistakeCount: number;
  savedElapsedTime: number; // thời gian đã trôi qua
  lastSaved: Date; // thời gian lưu gần nhất
  savedHistory: number[][][]; // lịch sử các bước đã đi
}
