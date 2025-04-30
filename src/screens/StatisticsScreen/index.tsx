// StatisticsScreen.tsx

import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/commons/Header';
import ChartsStats from '../../components/Statistics/ChartsStats';
import LevelStats from '../../components/Statistics/LevelStats';
import { useTheme } from '../../context/ThemeContext';
import { GameStatsManager } from '../../services/GameStatsManager';
import { GameLogEntry, GameStats, Level } from '../../types';

export default function StatisticsScreen() {
  const { theme } = useTheme();
  const [stats, setStats] = useState<Record<Level, GameStats> | null>(null);
  const [logs, setLogs] = useState<GameLogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'level' | 'chart'>('level');

  // Sau khi navigation.goBack() sẽ gọi hàm này
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const loadedStats = await GameStatsManager.getStats();
    setStats(loadedStats);
    const loadedLogs = await GameStatsManager.getLogs();
    setLogs(loadedLogs);
  }

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="Statistics"
        showBack={false}
        showSettings={true}
        showTheme={true}
      />
      <View style={styles.container}>
        {/* Tab Chip Selector */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            onPress={() => setActiveTab('level')}
            style={[
              styles.chip,
              activeTab === 'level' && styles.chipActive,
            ]}
          >
            <Text style={[
              styles.chipText,
              activeTab === 'level' && styles.chipTextActive
            ]}>By Level</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('chart')}
            style={[
              styles.chip,
              activeTab === 'chart' && styles.chipActive,
            ]}
          >
            <Text style={[
              styles.chipText,
              activeTab === 'chart' && styles.chipTextActive
            ]}>Charts</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {
            activeTab === 'level' ?
              <LevelStats stats={stats} /> :
              <ChartsStats logs={logs} />
          }
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    alignItems: 'center' as const,
    paddingBottom: 20,
  },
  tabRow: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    marginBottom: 16,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    marginHorizontal: 6,
  },
  chipActive: {
    backgroundColor: '#3b82f6',
  },
  chipText: {
    color: '#94a3b8',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
};
