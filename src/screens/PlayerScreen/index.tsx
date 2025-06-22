import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/commons/Header';
import CreatePlayerModal from '../../components/Player/CreatePlayerModal';
import PlayerCard from '../../components/Player/PlayerCard';
import {useTheme} from '../../context/ThemeContext';
import {usePlayerProfile} from '../../hooks/usePlayerProfile';

export const PlayerScreen = () => {
  const {theme} = useTheme();
  const {t} = useTranslation();
  const {allPlayers, switchPlayer, player, deletePlayer} = usePlayerProfile();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigation = useNavigation();

  const handleSelect = (id: string) => {
    switchPlayer(id);
    navigation.goBack();
  };

  const handleDelete = (id: string) => {
    Alert.alert(t('deletePlayerTitle'), t('deletePlayerMessage'), [
      {text: t('cancelBtn'), style: 'cancel'},
      {
        text: t('deleteBtn'),
        style: 'destructive',
        onPress: () => deletePlayer(id),
      },
    ]);
  };

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.container, {backgroundColor: theme.background}]}>
      <Header
        title={t('players')}
        showBack={true}
        showSettings={false}
        showTheme={true}
      />
      <ScrollView
        style={[
          styles.contentContainer,
          {backgroundColor: theme.backgroundSecondary},
        ]}>
        <Text style={[styles.title, {color: theme.text}]}>
          {t('selectPlayerTitle')}
        </Text>
        {allPlayers.map(p => (
          <PlayerCard
            key={p.id}
            player={p}
            isSelected={p.id === player?.id}
            onPress={() => handleSelect(p.id)}
            onDelete={handleDelete}
          />
        ))}
        <TouchableOpacity
          onPress={() => setShowCreateModal(true)}
          style={styles.button}>
          <Text style={[styles.buttonText, {color: theme.buttonBlue}]}>
            {t('addPlayerBtn')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      {showCreateModal && (
        <CreatePlayerModal onClose={() => setShowCreateModal(false)} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    fontSize: 18,
  },
});
