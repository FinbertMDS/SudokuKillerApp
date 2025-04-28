// src/screens/StatisticsScreen/index.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const StatisticsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistics</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, color: '#ddd' },
});

export default StatisticsScreen;
