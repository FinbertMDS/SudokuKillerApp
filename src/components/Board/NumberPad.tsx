import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BOARD_SIZE } from '../../utils/constants';

type NumberPadProps = {
  onSelectNumber: (num: number) => void;
};

const NumberPad = ({ onSelectNumber }: NumberPadProps) => (
  <View style={styles.container}>
    {Array.from({ length: BOARD_SIZE }, (_, i) => i + 1).map((num) => (
      <TouchableOpacity key={num} style={styles.button} onPress={() => onSelectNumber(num)}>
        <Text style={styles.text}>{num}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

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
