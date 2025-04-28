import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { default as Icon } from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../context/ThemeContext';

type HeaderProps = {
  onBack?: () => void;
};

const Header = ({ onBack }: HeaderProps) => {
  const { theme, toggleTheme, mode } = useTheme();
  return (
    <>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        {
          onBack && (
            <>
              <TouchableOpacity onPress={onBack}>
                <Icon name="arrow-left" size={28} color={theme.iconColor} />
              </TouchableOpacity>
              <Text style={[styles.title, { color: theme.text }]}>Killer Sudoku</Text>
            </>
          )
        }

        <TouchableOpacity onPress={toggleTheme}>
          <Text style={styles.button}>
            <Icon
              name={mode === 'light' ? 'weather-night' : 'weather-sunny'}
              size={24}
              color={theme.iconColor}
            />
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log('Open settings')}>
          <Icon name="cog-outline" size={28} color={theme.iconColor} />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    marginLeft: 20,
  },
});

export default Header;
