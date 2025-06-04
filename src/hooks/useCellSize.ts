import {useMemo} from 'react';
import {useWindowDimensions} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BOARD_SIZE} from '../utils/constants';

export function useCellSize(reservedHeight: number) {
  const {width, height} = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const availableHeight = useMemo(() => {
    return height - insets.top - insets.bottom - reservedHeight;
  }, [height, insets, reservedHeight]);

  const cellWidth = Math.floor((width - 32) / BOARD_SIZE);
  const cellHeight = Math.floor(availableHeight / BOARD_SIZE);

  let rawCellSize = Math.min(cellWidth, cellHeight);
  if (DeviceInfo.isTablet()) {
    rawCellSize = rawCellSize * 0.8;
  }
  const cellSize = rawCellSize - (rawCellSize % 10);
  console.log('cellSize2', cellSize);

  return cellSize;
}
