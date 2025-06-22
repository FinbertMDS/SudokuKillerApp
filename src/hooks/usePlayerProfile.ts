import {useEffect, useState} from 'react';
import {playerProfileStorage} from '../storage';
import {PlayerProfile} from '../types/player';

export const usePlayerProfile = () => {
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [allPlayers, setAllPlayers] = useState<PlayerProfile[]>([]);

  useEffect(() => {
    setPlayer(playerProfileStorage.getCurrentPlayer());
    setAllPlayers(playerProfileStorage.getAllPlayers());
  }, []);

  const switchPlayer = (id: string) => {
    playerProfileStorage.setCurrentPlayerId(id);
    setPlayer(playerProfileStorage.getCurrentPlayer());
  };

  const createPlayer = (profile: PlayerProfile) => {
    const updated = [...playerProfileStorage.getAllPlayers(), profile];
    playerProfileStorage.savePlayers(updated);
    setAllPlayers(updated);
    playerProfileStorage.setCurrentPlayerId(profile.id);
    setPlayer(profile);
  };

  return {player, allPlayers, switchPlayer, createPlayer};
};
