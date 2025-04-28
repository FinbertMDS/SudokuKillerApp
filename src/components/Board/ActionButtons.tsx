import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ActionButtonsProps = {
  noteMode: boolean,
  onNote: (mode: boolean) => void,
  onUndo: () => void,
  onClear: () => void,
  onSolved: () => void,
};

const ActionButtons = (
  {
    noteMode,
    onNote,
    onUndo,
    onClear,
    onSolved,
  }: ActionButtonsProps) => {
  const buttons = [
    { label: 'Undo', icon: ['undo'], onPress: onUndo },
    { label: 'Erase', icon: ['eraser'], onPress: onClear },
    { label: 'Notes', icon: ['note-outline', 'note-edit-outline'], iconChangeFlag: noteMode, onPress: () => onNote(!noteMode) },
    { label: 'Solved Board', icon: ['lightbulb-on-outline'], onPress: onSolved },
    // { label: 'Hint', icon: 'lightbulb-on-outline', onPress: handleHint },
  ];
  return (
    <View style={styles.container}>
      {buttons.map((btn, idx) => (
        <TouchableOpacity key={idx} style={styles.button} onPress={btn.onPress}>
          <Icon
            name={(btn.icon.length > 0 && btn.iconChangeFlag) ? btn.icon[1] : btn.icon[0]}
            size={24}
            color={(btn.icon.length > 0 && btn.iconChangeFlag) ? '#325AAF' : '#ADB6C2'}
          />
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              color: (btn.icon.length > 0 && btn.iconChangeFlag) ? '#325AAF' : '#ADB6C2',
            }}
          >{btn.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = {
  container: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    width: '100%' as const,
    marginTop: 10,
  },
  button: {
    alignItems: 'center' as const,
    marginHorizontal: 10,
  },
  text: {
    marginTop: 4,
    fontSize: 12,
    color: '#555',
  },
};

export default ActionButtons;
