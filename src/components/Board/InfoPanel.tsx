import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../context/ThemeContext';
import { MAX_MISTAKES } from '../../utils/constants';
import { formatTime } from '../../utils/dateUtil';

type InfoPanelProps = {
  level: string;
  mistakes: number;
  time: number;
  isPaused: boolean;
  onPause: () => void;
};

const InfoPanel = ({ level, mistakes, time, isPaused, onPause }: InfoPanelProps) => {
  const { theme } = useTheme();
  const formattedTime = useMemo(() => formatTime(time), [time]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.infoBlock}>
        <Text style={[styles.title, { color: theme.text }]}>Level</Text>
        <Text style={[styles.value, { color: theme.text }]}>{level}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={[styles.title, { color: theme.text }]}>Mistakes</Text>
        <Text style={[styles.value, { color: theme.text }]}>{mistakes}/{MAX_MISTAKES}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={[styles.title, { color: theme.text }]}>Time</Text>
        <Text style={[styles.value, styles.timeValue, { color: theme.text }]}>{formattedTime}</Text>
      </View>

      <TouchableOpacity style={styles.infoBlock} onPress={onPause}>
        {!isPaused ? (
          <Icon name="pause-circle-outline" size={28} color={theme.iconColor} />
        ) : (
          <Icon name="play-circle-outline" size={28} color={theme.iconColor} />
        )}
      </TouchableOpacity>
    </View>
  );
};


const styles = {
  container: {
    width: '100%' as const,
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    alignItems: 'center' as const,
    paddingVertical: 20,
  },
  infoBlock: {
    alignItems: 'center' as const,
    minWidth: 70,
  },
  title: {
    fontSize: 14,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
  timeValue: {
    minWidth: 50,
  },
};

export default InfoPanel;
