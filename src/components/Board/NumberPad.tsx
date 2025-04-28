import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { BOARD_SIZE } from '../../utils/constants';

type NumberPadProps = {
  onSelectNumber: (num: number) => void;
};

const NumberPad = ({ onSelectNumber }: NumberPadProps) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {Array.from({ length: BOARD_SIZE }, (_, i) => i + 1).map((num) => (
        <TouchableOpacity key={num} style={styles.button} onPress={() => onSelectNumber(num)}>
          <Text style={[styles.text, { color: theme.text }]}>{num}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = {
  container: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center' as const,
    marginTop: 10,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  text: {
    fontSize: 24,
  },
};

export default NumberPad;
