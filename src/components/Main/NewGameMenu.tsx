import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Menu} from 'react-native-paper';
import {useTheme} from '../../context/ThemeContext';
import {Level} from '../../types';
import {LEVELS} from '../../utils/constants';

interface NewGameMenuProps {
  visible: boolean;
  onDismiss: () => void;
  onOpen: () => void;
  handleNewGame: (level: Level) => void;
}

const NewGameMenu: React.FC<NewGameMenuProps> = ({
  visible,
  onDismiss,
  onOpen,
  handleNewGame,
}) => {
  const {theme} = useTheme();
  const {t} = useTranslation();

  const menuItems = useMemo(() => {
    return LEVELS.map(level => (
      <Menu.Item
        key={level}
        onPress={() => handleNewGame(level)}
        title={t(`level.${level}`)}
        titleStyle={{color: theme.text}}
      />
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, theme]);

  return (
    <Menu
      visible={visible}
      onDismiss={onDismiss}
      style={{backgroundColor: theme.background}}
      contentStyle={{backgroundColor: theme.background}}
      anchor={
        <TouchableOpacity
          style={[
            styles.newGameButton,
            {
              backgroundColor: theme.secondary,
              borderColor: theme.buttonBorder,
            },
          ]}
          onPress={onOpen}>
          <Text style={[styles.buttonText, {color: theme.buttonText}]}>
            {t('newGame')}
          </Text>
        </TouchableOpacity>
      }>
      {menuItems}
    </Menu>
  );
};

const styles = StyleSheet.create({
  newGameButton: {
    padding: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

export default React.memo(NewGameMenu);
