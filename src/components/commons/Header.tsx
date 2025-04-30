import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { default as Icon } from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../context/ThemeContext';

type HeaderProps = {
  title?: string;
  showBack?: boolean;
  showSettings?: boolean;
  showTheme?: boolean;
  onBack?: () => void;
};

const Header = ({
  title,
  showBack = false,
  onBack = () => { },
  showSettings = true,
  showTheme = true,
}: HeaderProps) => {
  const { theme, toggleTheme, mode } = useTheme();
  return (
    <>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        {
          showBack && (
            <View style={styles.side}>
              <TouchableOpacity onPress={onBack}>
                <Icon name="arrow-left" size={28} color={theme.iconColor} />
              </TouchableOpacity>
            </View>
          )
        }
        {
          title && title.length > 0 && (
            <View style={styles.center}>
              <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
            </View>
          )
        }
        {
          showTheme || showSettings ? (
            <View style={[styles.side, styles.right]}>
              {
                showTheme && (
                  <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
                    <Icon
                      name={mode === 'light' ? 'weather-night' : 'weather-sunny'}
                      size={24}
                      color={theme.iconColor}
                    />
                  </TouchableOpacity>
                )
              }
              {
                showSettings && (
                  <TouchableOpacity onPress={() => console.log('Open settings')} style={styles.iconButton}>
                    <Icon name="cog-outline" size={24} color={theme.iconColor} />
                  </TouchableOpacity>
                )
              }
            </View>
          )
            : null}
      </View>
    </>
  );
};

const styles = {
  header: {
    height: 56,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 12,
  },
  side: {
    width: 56,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  right: {
    flexDirection: 'row' as const,
    justifyContent: 'flex-end' as const,
  },
  center: {
    flex: 1,
    alignItems: 'center' as const,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold' as const,
  },
  iconButton: {
    marginLeft: 20,
  },
};

export default Header;
