import React, { useCallback, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../context/ThemeContext';

type ActionButtonsProps = {
  noteMode: boolean,
  onNote: (mode: boolean) => void,
  onUndo: () => void,
  onErase: () => void,
  onSolved: () => void,
};

const ActionButtons = (
  {
    noteMode,
    onNote,
    onUndo,
    onErase: onClear,
    onSolved,
  }: ActionButtonsProps) => {
  const { theme } = useTheme();

  const handleNote = useCallback((mode: boolean) => {
    onNote(mode);
  }, [onNote]);
  const handleUndo = useCallback(() => {
    onUndo();
  }, [onUndo]);

  const handleErase = useCallback(() => {
    onClear();
  }, [onClear]);

  const handleSolved = useCallback(() => {
    onSolved();
  }, [onSolved]);


  const buttons = useMemo(() => [
    { label: 'Undo', icon: ['undo'], onPress: handleUndo },
    { label: 'Erase', icon: ['eraser'], onPress: handleErase },
    { label: 'Notes', icon: ['note-outline', 'note-edit-outline'], iconChangeFlag: noteMode, onPress: () => handleNote(!noteMode) },
    { label: 'Solved Board', icon: ['lightbulb-on-outline'], onPress: handleSolved },
    // { label: 'Hint', icon: 'lightbulb-on-outline', onPress: handleHint },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [handleNote, handleUndo, handleErase, handleNote]);

  return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
      {buttons.map((btn, idx) => (
        <TouchableOpacity key={idx} style={styles.button} onPress={btn.onPress}>
          <Icon
            name={(btn.icon.length > 0 && btn.iconChangeFlag) ? btn.icon[1] : btn.icon[0]}
            size={24}
            color={(btn.icon.length > 0 && btn.iconChangeFlag) ? theme.primary : theme.secondary}
          />
          <Text
            style={{
              color: (btn.icon.length > 0 && btn.iconChangeFlag) ? theme.primary : theme.secondary,
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
