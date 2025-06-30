import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../context/ThemeContext';
import {useGameTimer} from '../../hooks/useGameTimer';
import {AppSettings} from '../../types';
import {MAX_MISTAKES, MAX_TIMEPLAYED} from '../../utils/constants';
import {formatTime} from '../../utils/dateUtil';

type InfoPanelProps = {
  isPlaying: boolean;
  level: string;
  mistakes: number;
  secondsRef: React.RefObject<number>;
  isPaused: boolean;
  settings: AppSettings;
  onPause: () => void;
  onLimitTimeReached: () => Promise<void>;
};

const InfoPanel = ({
  isPlaying,
  level,
  mistakes,
  secondsRef,
  isPaused,
  settings,
  onPause,
  onLimitTimeReached,
}: InfoPanelProps) => {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const {getSeconds, stopTimer} = useGameTimer(isPlaying, {
    maxTimePlayed: MAX_TIMEPLAYED,
    onLimitReached: async () => {
      stopTimer();
      Alert.alert(
        t('timeWarning'),
        t('playedLimit', {limit: formatTime(MAX_TIMEPLAYED)}),
        [
          {
            text: t('ok'),
            onPress: () => {
              onLimitTimeReached();
            },
          },
        ],
        {
          cancelable: false,
        },
      );
    },
  });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      secondsRef.current = getSeconds();
      setTick(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <View style={styles.infoBlock}>
        <Text style={[styles.title, {color: theme.text}]}>{t('level')}</Text>
        <Text style={[styles.value, {color: theme.text}]}>
          {t(`level.${level}`)}
        </Text>
      </View>

      {settings.mistakeLimit && (
        <View style={styles.infoBlock}>
          <Text style={[styles.title, {color: theme.text}]}>
            {t('mistakes')}
          </Text>
          <Text style={[styles.value, {color: theme.text}]}>
            {mistakes}/{MAX_MISTAKES}
          </Text>
        </View>
      )}

      {settings.timer && (
        <View style={styles.infoBlock}>
          <Text style={[styles.title, {color: theme.text}]}>{t('time')}</Text>
          <Text style={[styles.value, {color: theme.text}]}>
            {tick > 0 ? formatTime(getSeconds()) : '-'}
          </Text>
        </View>
      )}

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

const styles = StyleSheet.create({
  container: {
    width: '100%' as const,
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    alignItems: 'center' as const,
    marginTop: DeviceInfo.isTablet() ? 0 : 20,
    marginBottom: DeviceInfo.isTablet() ? 0 : 20,
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
});

export default React.memo(InfoPanel);
