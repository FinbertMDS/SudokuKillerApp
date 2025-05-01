// useNumberCounts.ts

import {useMemo} from 'react';
import {CellValue} from '../types';

export function useNumberCounts(board: CellValue[][]): Record<number, number> {
  return useMemo(() => {
    const flatStr = board.flat().join('');
    const counts: Record<number, number> = {};

    for (let i = 1; i <= 9; i++) {
      const digit = i.toString();
      counts[i] = flatStr.split(digit).length - 1;
    }

    return counts;
  }, [board]);
}
