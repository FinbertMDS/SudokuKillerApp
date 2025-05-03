import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../context/ThemeContext';

type ActionButtonsProps = {
  noteMode: boolean;
  onNote: (mode: boolean) => void;
  onUndo: () => void;
  onErase: () => void;
  onSolved: () => void;
};

const ActionButtons = ({
  noteMode,
  onNote,
  onUndo,
  onErase: onClear,
  onSolved,
}: ActionButtonsProps) => {
  const {theme} = useTheme();
  const {t} = useTranslation();

  const handleNote = useCallback(
    (mode: boolean) => {
      onNote(mode);
    },
    [onNote],
  );
  const handleUndo = useCallback(() => {
    onUndo();
  }, [onUndo]);

  const handleErase = useCallback(() => {
    onClear();
  }, [onClear]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSolved = useCallback(() => {
    onSolved();
  }, [onSolved]);

  const buttons = useMemo(
    () => [
      {label: t('undo'), icon: ['undo'], onPress: handleUndo},
      {label: t('erase'), icon: ['eraser'], onPress: handleErase},
      {
        label: t('notes'),
        icon: ['note-outline', 'note-edit-outline'],
        iconChangeFlag: noteMode,
        onPress: () => handleNote(!noteMode),
      },
      // {
      //   label: t('solvedBoard'),
      //   icon: ['lightbulb-on-outline'],
      //   onPress: handleSolved,
      // },
    ],
    [t, noteMode, handleNote, handleUndo, handleErase],
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      {buttons.map((btn, idx) => (
        <TouchableOpacity key={idx} style={styles.button} onPress={btn.onPress}>
          <Icon
            name={
              btn.icon.length > 0 && btn.iconChangeFlag
                ? btn.icon[1]
                : btn.icon[0]
            }
            size={24}
            color={
              btn.icon.length > 0 && btn.iconChangeFlag
                ? theme.primary
                : theme.secondary
            }
          />
          <Text
            style={{
              color:
                btn.icon.length > 0 && btn.iconChangeFlag
                  ? theme.primary
                  : theme.secondary,
            }}>
            {btn.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default ActionButtons;
