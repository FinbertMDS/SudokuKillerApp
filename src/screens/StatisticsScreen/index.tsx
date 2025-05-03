// StatisticsScreen.tsx

import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../components/commons/Header';
import ChartsStats from '../../components/Statistics/ChartsStats';
import LevelStats from '../../components/Statistics/LevelStats';
import TimeFilterDropdown from '../../components/Statistics/TimeFilterDropdown';
import {useTheme} from '../../context/ThemeContext';
import {GameStatsManager} from '../../services/GameStatsManager';
import {GameLogEntry, GameStats, Level, TimeFilter} from '../../types';

export default function StatisticsScreen() {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const [stats, setStats] = useState<Record<Level, GameStats> | null>(null);
  const [logs, setLogs] = useState<GameLogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'level' | 'chart'>('level');

  const [filter, setFilter] = useState<TimeFilter>('all');
  const [showDropdown, setShowDropdown] = useState(false);

  // Sau khi navigation.goBack() sẽ gọi hàm này
  useFocusEffect(
    useCallback(() => {
      loadData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]),
  );

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function loadData() {
    const loadedLogs = await GameStatsManager.getLogs();
    setLogs(loadedLogs);
    const loadedStats = await GameStatsManager.getStatsWithCache(
      loadedLogs,
      filter,
    );
    setStats(loadedStats);
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, {backgroundColor: theme.background}]}>
      <Header
        title={t('statistics')}
        showBack={false}
        showSettings={true}
        showTheme={true}
        showCustom={true}
        custom={
          <TouchableOpacity
            onPress={() => setShowDropdown(true)}
            style={styles.iconButton}>
            <Ionicons name="filter" size={24} color={theme.iconColor} />
          </TouchableOpacity>
        }
      />
      <View style={styles.container}>
        {/* Tab Chip Selector */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            onPress={() => setActiveTab('level')}
            style={[styles.chip, activeTab === 'level' && styles.chipActive]}>
            <Text
              style={[
                styles.chipText,
                activeTab === 'level' && styles.chipTextActive,
              ]}>
              {t('levelStats')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('chart')}
            style={[styles.chip, activeTab === 'chart' && styles.chipActive]}>
            <Text
              style={[
                styles.chipText,
                activeTab === 'chart' && styles.chipTextActive,
              ]}>
              {t('chartsStats')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'level' ? (
            <LevelStats stats={stats} />
          ) : (
            <ChartsStats logs={logs} />
          )}
        </View>
      </View>

      {showDropdown && (
        <TimeFilterDropdown
          visible={showDropdown}
          selected={filter}
          onSelect={newFilter => {
            setFilter(newFilter);
            setShowDropdown(false);
          }}
          onClose={() => setShowDropdown(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    alignItems: 'center' as const,
    paddingBottom: 20,
  },
  iconButton: {
    marginLeft: 20,
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
