// StatisticsScreen.tsx

import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/commons/Header';
import { useTheme } from '../../context/ThemeContext';
import { GameStats, GameStatsManager } from '../../services/GameStatsManager';
import { Level } from '../../types';
import { LEVELS } from '../../utils/constants';
import { formatTime } from '../../utils/dateUtil';
import { getLevelColor } from '../../utils/getLevelColor';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function StatisticsScreen() {
  const { theme } = useTheme();
  const [stats, setStats] = useState<Record<Level, GameStats> | null>(null);
  const scheme = useColorScheme() ?? 'light';

  // Sau khi navigation.goBack() sẽ gọi hàm này
  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const loadedStats = await GameStatsManager.getStats();
    setStats(loadedStats);
  }

  if (!stats) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.secondary} />
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="Statistics"
        showBack={false}
        showSettings={true}
        showTheme={true}
      />
      <ScrollView style={{ backgroundColor: theme.background }}>
        {LEVELS.map(level => (
          <View key={level}
            style={[
              styles.card,
              {
                backgroundColor: theme.background,
                borderLeftColor: getLevelColor(level, scheme),
              },
            ]}
          >
            <Text style={[styles.level, { color: theme.text }]}>{level}</Text>
            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.secondary }]}>Games Started</Text>
              <Text style={[styles.value, { color: theme.text }]}>{stats[level].gamesStarted}</Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.secondary }]}>Games Completed</Text>
              <Text style={[styles.value, { color: theme.text }]}>{stats[level].gamesCompleted}</Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.secondary }]}>Best Time</Text>
              <Text style={[styles.value, { color: theme.text }]}>{formatTime(stats[level].bestTimeSeconds)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.secondary }]}>Average Time</Text>
              <Text style={[styles.value, { color: theme.text }]}>{formatTime(stats[level].averageTimeSeconds)}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    alignItems: 'center' as const,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    marginBottom: 20,
  },
  card: {
    width: SCREEN_WIDTH - 100,
    padding: 8,
    marginBottom: 16,
    borderRadius: 10,
    borderLeftWidth: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  level: {
    fontSize: 20 as const,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
};
