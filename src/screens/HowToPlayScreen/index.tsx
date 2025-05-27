import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {HowToPlay} from '../../components/HowToPlay';
import {RootStackParamList} from '../../types';

export const HowToPlayScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {t} = useTranslation();

  return (
    <HowToPlay
      headerTitle={t('howToPlay.title')}
      onClose={() => navigation.goBack()}
    />
  );
};
