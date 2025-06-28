import {TFunction} from 'i18next';
import {PlayerHighlight, PlayerStats} from '../types/player';

export const getPlayerNotes = (stats: PlayerStats, t: TFunction): string => {
  const {totalGames, completedGames, avgTime, winRate} = stats;

  if (totalGames === 0) {
    return t('playerNotes_noGames');
  }

  // ✅ Hoàn thành tất cả và thời gian nhanh
  if (winRate === 1 && avgTime < 300) {
    return t('playerNotes_bestPerformance');
  }

  // ✅ Hoàn thành tất cả nhưng thời gian hơi lâu
  if (winRate === 1) {
    return t('playerNotes_stable');
  }

  // ✅ Tỷ lệ thắng cao
  if (winRate >= 0.7) {
    return t('playerNotes_manyGames');
  }

  // ✅ Gần 50%
  if (winRate >= 0.4 && winRate < 0.7) {
    if (avgTime > 400) {
      return t('playerNotes_avgTimeLong');
    }
    return t('playerNotes_even');
  }

  // ✅ Toàn bộ chưa xong
  if (completedGames === 0) {
    return t('playerNotes_allNotCompleted');
  }

  // ✅ Các trường hợp còn lại
  return t('playerNotes_needToImprove');
};

export const generateOverallRankingNotes = (
  statsList: PlayerStats[],
  t: TFunction,
): PlayerHighlight[] => {
  if (statsList.length === 0) {
    return [];
  }

  const result: PlayerHighlight[] = [];

  // Tìm top theo từng hạng mục
  const sortedByWinRate = [...statsList].sort((a, b) => b.winRate - a.winRate);
  const sortedByAvgTime = [...statsList]
    .filter(s => s.completedGames > 0)
    .sort((a, b) => a.avgTime - b.avgTime);
  const sortedByTotalGames = [...statsList].sort(
    (a, b) => b.totalGames - a.totalGames,
  );

  const topWin = sortedByWinRate[0];
  const topFast = sortedByAvgTime[0];
  const topGames = sortedByTotalGames[0];

  for (const stat of statsList) {
    const highlights: string[] = [];

    if (stat.player.id === topWin.player.id) {
      highlights.push(t('playerNotes_highlights_bestPerformance'));
    }

    if (stat.player.id === topFast?.player.id) {
      highlights.push(t('playerNotes_highlights_fastest'));
    }

    if (stat.player.id === topGames.player.id) {
      highlights.push(t('playerNotes_highlights_mostGames'));
    }

    if (stat.completedGames === 0 && stat.totalGames > 0) {
      highlights.push(t('playerNotes_highlights_allNotCompleted'));
    }

    result.push({
      id: stat.player.id,
      name: stat.player.name,
      highlights,
    });
  }

  return result;
};
