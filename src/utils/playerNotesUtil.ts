import {TFunction} from 'i18next';
import {PlayerHighlight, RankedPlayer} from '../types';
import {PLAYER_TIME_MAX} from './constants';

export const getPlayerNotes = (stat: RankedPlayer, t: TFunction): string => {
  const {
    totalGames,
    completedGames,
    avgTime,
    winRate,
    score,
    totalWeightedWins,
  } = stat;

  if (totalGames === 0) {
    return t('playerNotes_noGames');
  }

  // 🏅 Xuất sắc: thắng toàn bộ + avgTime nhanh
  if (winRate === 1 && avgTime && avgTime < 300) {
    return t('playerNotes_bestPerformance');
  }

  // 🧘 Ổn định: thắng toàn bộ nhưng thời gian vừa
  if (winRate === 1) {
    return t('playerNotes_stable');
  }

  // 📈 Tham gia nhiều, win rate cao
  if (totalGames >= 5 && winRate >= 0.7) {
    return t('playerNotes_manyGames');
  }

  // 🤝 Gần cân bằng
  if (winRate >= 0.4 && winRate < 0.7) {
    if (avgTime && avgTime > 400) {
      return t('playerNotes_avgTimeLong');
    }
    return t('playerNotes_even');
  }

  // ❌ Toàn bộ chưa hoàn thành
  if (completedGames === 0) {
    return t('playerNotes_allNotCompleted');
  }

  // 🧪 Có nhiều chiến thắng ở level khó
  if (totalWeightedWins > 10 && score > 50) {
    return t('playerNotes_strongAtHardLevels');
  }

  // ⏳ Trung bình chậm + tỷ lệ thấp
  if (avgTime && avgTime > 500 && winRate < 0.4) {
    return t('playerNotes_needToImprove');
  }

  // Mặc định
  return t('playerNotes_generic');
};

export const generateOverallRankingNotes = (
  statsList: RankedPlayer[],
  t: TFunction,
): PlayerHighlight[] => {
  if (statsList.length === 0) {
    return [];
  }

  const result: PlayerHighlight[] = [];

  // Top theo từng tiêu chí
  const topScore = [...statsList].sort((a, b) => b.score - a.score)[0];
  const topWinRate = [...statsList].sort((a, b) => b.winRate - a.winRate)[0];
  const topFast =
    [...statsList]
      .filter(s => s.completedGames > 0)
      .sort(
        (a, b) =>
          (a.avgTime || PLAYER_TIME_MAX) - (b.avgTime || PLAYER_TIME_MAX),
      )[0] || null;
  const topGames = [...statsList].sort(
    (a, b) => b.totalGames - a.totalGames,
  )[0];

  for (const stat of statsList) {
    const highlights: string[] = [];

    if (stat.player.id === topScore.player.id) {
      highlights.push(t('playerNotes_highlights_topRanked')); // 🏆 điểm tổng cao nhất
    }

    if (stat.player.id === topWinRate.player.id) {
      highlights.push(t('playerNotes_highlights_bestPerformance')); // % thắng cao nhất
    }

    if (stat.player.id === topFast?.player.id) {
      highlights.push(t('playerNotes_highlights_fastest')); // avg time thấp nhất
    }

    if (stat.player.id === topGames.player.id) {
      highlights.push(t('playerNotes_highlights_mostGames')); // nhiều game nhất
    }

    if (stat.completedGames === 0 && stat.totalGames > 0) {
      highlights.push(t('playerNotes_highlights_allNotCompleted')); // toàn bộ chưa xong
    }

    result.push({
      id: stat.player.id,
      name: stat.player.name,
      highlights,
    });
  }

  return result;
};
