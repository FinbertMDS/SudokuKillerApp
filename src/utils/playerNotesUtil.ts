import {TFunction} from 'i18next';
import {PlayerHighlight, RankedPlayer} from '../types';
import {
  LEVEL_PRIORITY,
  LEVEL_WEIGHT,
  PLAYER_STATS_THRESHOLDS,
} from './constants';

export const getPlayerNotes = (stat: RankedPlayer, t: TFunction): string => {
  const {
    totalGames,
    completedGames,
    winRate,
    score,
    totalWeightedWins,
    byLevel,
  } = stat;

  if (totalGames === 0) {
    return t('playerNotes_noGames');
  }
  // Tính avgTime có trọng số
  let weightedTotalTime = 0;
  let weightedWins = 0;

  for (const level of LEVEL_PRIORITY) {
    const lvlStat = byLevel?.[level];
    if (!lvlStat) {
      continue;
    }
    const weight = LEVEL_WEIGHT[level];
    weightedTotalTime += lvlStat.avgTime * weight * lvlStat.wins;
    weightedWins += weight * lvlStat.wins;
  }
  const weightedAvgTime =
    weightedWins > 0 ? weightedTotalTime / weightedWins : undefined;

  if (
    winRate === 1 &&
    weightedAvgTime &&
    weightedAvgTime < PLAYER_STATS_THRESHOLDS.fastPlayerAvgTime
  ) {
    return t('playerNotes_bestPerformance');
  }

  if (winRate === 1) {
    return t('playerNotes_stable');
  }

  if (
    totalGames >= PLAYER_STATS_THRESHOLDS.minGamesForGoodPlayer &&
    winRate >= PLAYER_STATS_THRESHOLDS.highWinRate
  ) {
    return t('playerNotes_manyGames');
  }

  if (
    winRate >= PLAYER_STATS_THRESHOLDS.mediumWinRate &&
    winRate < PLAYER_STATS_THRESHOLDS.highWinRate
  ) {
    if (
      weightedAvgTime &&
      weightedAvgTime > PLAYER_STATS_THRESHOLDS.slowPlayerAvgTime
    ) {
      return t('playerNotes_avgTimeLong');
    }
    return t('playerNotes_even');
  }

  if (completedGames === 0) {
    return t('playerNotes_allNotCompleted');
  }

  if (
    totalWeightedWins > PLAYER_STATS_THRESHOLDS.strongPlayerWins &&
    score > PLAYER_STATS_THRESHOLDS.strongPlayerScore
  ) {
    return t('playerNotes_strongAtHardLevels');
  }

  if (
    weightedAvgTime &&
    weightedAvgTime > PLAYER_STATS_THRESHOLDS.verySlowPlayerAvgTime &&
    winRate < PLAYER_STATS_THRESHOLDS.mediumWinRate
  ) {
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

  const topScore = [...statsList].sort((a, b) => b.score - a.score)[0];
  const topWinRate = [...statsList].sort((a, b) => b.winRate - a.winRate)[0];

  const topFast = [...statsList]
    .map(stat => {
      let weightedTotalTime = 0;
      let weightedWins = 0;
      for (const level of LEVEL_PRIORITY) {
        const lvlStat = stat.byLevel?.[level];
        if (!lvlStat) {
          continue;
        }
        const weight = LEVEL_WEIGHT[level];
        weightedTotalTime += lvlStat.avgTime * weight * lvlStat.wins;
        weightedWins += weight * lvlStat.wins;
      }
      const weightedAvgTime =
        weightedWins > 0 ? weightedTotalTime / weightedWins : undefined;
      return {
        ...stat,
        weightedAvgTime,
      };
    })
    .filter(s => s.completedGames > 0 && s.weightedAvgTime !== undefined)
    .sort((a, b) => a.weightedAvgTime! - b.weightedAvgTime!)[0];

  const topGames = [...statsList].sort(
    (a, b) => b.totalGames - a.totalGames,
  )[0];

  for (const stat of statsList) {
    if (stat.totalGames === 0 || stat.completedGames === 0) {
      continue;
    }

    const highlights: string[] = [];

    if (stat.player.id === topScore.player.id) {
      highlights.push(t('playerNotes_highlights_topRanked'));
    }

    if (stat.player.id === topWinRate.player.id) {
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
