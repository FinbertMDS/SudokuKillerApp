// src/components/Statistics/GameHistory.tsx
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {GameLogEntryV2, TimeFilter} from '../../types';
import {getGameHistory} from '../../utils/statsUtil';
import GameLogCard from '../GameHistory/GameLogCard';

type GameHistoryProps = {
  logs: GameLogEntryV2[];
  filter: TimeFilter;
};

const GameHistory = ({logs, filter}: GameHistoryProps) => {
  const {theme} = useTheme();
  const {t} = useTranslation();

  const sortedLogs = useMemo(
    () => getGameHistory(logs, filter),
    [logs, filter],
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.background}]}>
      {sortedLogs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, {color: theme.secondary}]}>
            {t('noGameHistory')}
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={{backgroundColor: theme.background}}>
          {sortedLogs.map(log => (
            <GameLogCard key={log.id} log={log} />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default GameHistory;
