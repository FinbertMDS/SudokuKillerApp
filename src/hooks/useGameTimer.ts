// useGameTimer.ts

import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { BoardService } from '../services/BoardService';
import { MAX_TIMEPLAYED } from '../utils/constants';

interface TimePlayedOptions {
  maxTimePlayed?: number;
  onLimitReached?: () => void;
}

export function useGameTimer(isRunning: boolean, options?: TimePlayedOptions) {
  const [seconds, setSeconds] = useState(0);
  const maxTimePlayed = options?.maxTimePlayed ?? MAX_TIMEPLAYED;
  const onLimitReached = options?.onLimitReached;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);
  const lastActiveTime = useRef<number | null>(null);

  // Load last played time from storage once
  useEffect(() => {
    BoardService.loadSavedTimePlayed().then(value => {
      if (value != null) {
        try {
          const saved = parseInt(value.toString(), 10);
          if (!isNaN(saved)) {
            setSeconds(saved);
          }
        } catch (error) {
          console.error('Failed to parse saved time played:', error);
        }
      }
    });
  }, []);

  // Start or stop interval when isRunning changes
  useEffect(() => {
    if (isRunning) {
      startTimer();
    } else {
      stopTimer();
    }
    return stopTimer;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  // Pause timer when app goes to background
  useEffect(() => {
    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => sub.remove();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAppStateChange(nextAppState: AppStateStatus) {
    if (appState.current.match(/active/) && nextAppState === 'background') {
      lastActiveTime.current = Date.now();
      stopTimer();
    } else if (appState.current === 'background' && nextAppState.match(/active/)) {
      const now = Date.now();
      if (lastActiveTime.current && isRunning) {
        const delta = Math.floor((now - lastActiveTime.current) / 1000);
        setSeconds(prev => prev + delta);
        startTimer();
      }
    }
    appState.current = nextAppState;
  }

  function startTimer() {
    if (intervalRef.current) {return;}
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        const updated = prev + 1;
        if (updated >= maxTimePlayed) {
          if (onLimitReached) {
            onLimitReached();
          }
        }
        return updated;
      });
    }, 1000);
  }

  function stopTimer() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function resetTimer() {
    stopTimer();
    setSeconds(0);
  }

  return {
    seconds,
    resetTimer,
  };
}
