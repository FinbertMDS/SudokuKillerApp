import {RouteProp} from '@react-navigation/native';
import {InitGame, SavedGame} from '.';

export type RootStackParamList = {
  HomeTabs: undefined;
  Board: InitGame | SavedGame;
  Options: undefined;
  Settings: SettingsParamProps;
  HowToPlay: undefined;
};

export type BoardScreenRouteProp = RouteProp<RootStackParamList, 'Board'>;
export type SettingsScreenRouteProp = RouteProp<RootStackParamList, 'Settings'>;

type SettingsParamProps = {
  showAdvancedSettings?: boolean;
};

export type OptionMenuItem = {
  icon: string;
  label: string;
  screen?: keyof RootStackParamList;
  onPress?: () => void;
};

export type TimeFilter = 'all' | 'today' | 'week' | 'month' | 'year';

export type DailyBackgrounds = {
  light: string | null;
  dark: string | null;
  date?: string;
};
