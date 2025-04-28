import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
  const formattedTime = useMemo(() => formatTime(time), [time]);

  return (
    <View style={styles.container}>
      <View style={styles.infoBlock}>
        <Text style={styles.title}>Level</Text>
        <Text style={styles.value}>{level}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.title}>Mistakes</Text>
        <Text style={styles.value}>{mistakes}/{MAX_MISTAKES}</Text>
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.title}>Time</Text>
        <Text style={[styles.value, styles.timeValue]}>{formattedTime}</Text>
      </View>

      <TouchableOpacity style={styles.infoBlock} onPress={onPause}>
        {!isPaused ? (
          <Icon name="pause-circle-outline" size={28} color="#333" />
        ) : (
          <Icon name="play-circle-outline" size={28} color="#333" />
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
    marginVertical: 10,
  },
  infoBlock: {
    alignItems: 'center' as const,
    minWidth: 70,
  },
  title: {
    fontSize: 14,
    color: '#888',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#333',
  },
  timeValue: {
    minWidth: 50,
  },
};

export default InfoPanel;
