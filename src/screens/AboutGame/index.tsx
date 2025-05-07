import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/commons/Header';
import {useTheme} from '../../context/ThemeContext';
import {RootStackParamList} from '../../types';

export default function AboutGame() {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const openURL = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Error opening URL', err));
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, {backgroundColor: theme.background}]}>
      <Header
        title={t('aboutGame')}
        showBack={true}
        showSettings={false}
        showTheme={true}
      />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Killer Sudoku by FinbertNgo</Text>
          <Text style={styles.version}>Version 4.0.0</Text>
          <Text style={styles.copyright}>© 2025 All rights reserved.</Text>
        </View>

        <View style={styles.section}>
          {/* <Item
            label="Terms of Service"
            onPress={() => openURL('https://yourdomain.com/terms')}
          />
          <Item
            label="Privacy Policy"
            onPress={() => openURL('https://yourdomain.com/privacy')}
          /> */}
          <Item
            label="Licenses"
            onPress={() => navigation.navigate('Licenses')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Item = ({label, onPress}: {label: string; onPress: () => void}) => (
  <TouchableOpacity onPress={onPress} style={styles.item}>
    <Text style={styles.itemText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F1F4F8',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  version: {
    marginTop: 6,
    fontSize: 14,
    color: '#555',
  },
  copyright: {
    marginTop: 6,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
  },
  item: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
});
