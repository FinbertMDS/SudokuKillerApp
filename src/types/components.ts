import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Level} from '.';
import {CellValue} from './game';

export type RootStackParamList = {
  HomeTabs: undefined;
  Board: InitGame | SavedGame;
  Options: undefined;
  Settings: undefined;
  HowToPlay: undefined;
};

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

export type BoardScreenRouteProp = RouteProp<RootStackParamList, 'Board'>;

export type BoardScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Board'
>;

export type OptionMenuItem = {
  icon: string;
  label: string;
  screen?: keyof RootStackParamList;
  onPress?: () => void;
};
