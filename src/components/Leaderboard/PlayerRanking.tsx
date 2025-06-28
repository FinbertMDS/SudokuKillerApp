// src/components/Leaderboard/PlayerRanking.tsx

import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {PlayerStats} from '../../types/player';
import {MAX_PLAYER_RANKING_COUNT} from '../../utils/constants';
import PlayerStatsCard from './sub/PlayerStatsCard';

type PlayerRankingProps = {
  playerStats: PlayerStats[];
};

const PlayerRanking = ({playerStats}: PlayerRankingProps) => {
  const totalGamesSortedStats = [...playerStats]
    .sort((a, b) => b.completedGames - a.completedGames)
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, MAX_PLAYER_RANKING_COUNT);

  return (
    <ScrollView>
      <View style={styles.cardContainer}>
        {totalGamesSortedStats.map((playerStat, index) => (
          <PlayerStatsCard
            key={playerStat.player.id}
            stat={playerStat}
            rank={index + 1}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default PlayerRanking;
