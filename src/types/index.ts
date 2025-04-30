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
  savedLevel: Level;
}

export type SavedGame = {
  savedBoard: (number | null)[][];
  savedMistake: number;
  savedTimePlayed: number;
  savedHistory: (number | null)[][][];
  savedNotes: string[][][];
  lastSaved: Date;
}

export type BoardScreenRouteProp = RouteProp<RootStackParamList, 'Board'>;

export type BoardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Board'>;

export type Level = 'easy' | 'medium' | 'hard' | 'expert';
