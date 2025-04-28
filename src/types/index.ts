import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type Cell = {
  row: number;
  col: number;
}
export interface Cage {
  sum: number;
  cells: [number, number][];
}

export type RootStackParamList = {
  HomeTabs: undefined;
  Board: InitGame | SavedGame;
};

export type InitGame = {
  initialBoard: (number | null)[][];
  solvedBoard: number[][];
  cages: { cells: [number, number][], sum: number }[];
  savedLevel: string;
}

export type SavedGame = {
  savedBoard: (number | null)[][];
  savedMistakeCount: number;
  savedElapsedTime: number; // thời gian đã trôi qua
  savedHistory: (number | null)[][][]; // lịch sử các bước đã đi
  lastSaved: Date; // thời gian lưu gần nhất
}

export type BoardScreenRouteProp = RouteProp<RootStackParamList, 'Board'>;

export type BoardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Board'>;
