// src/navigation/BottomTabs.tsx
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../context/ThemeContext';
import MainScreen from '../screens/MainScreen';
import StatisticsScreen from '../screens/StatisticsScreen';

const Tab = createBottomTabNavigator();

const icons: any = {Main: 'home', Statistics: 'bar-chart'};

const BottomTabs = () => {
  const {theme} = useTheme();
  const {t} = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.primary,
        },
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTitleStyle: {
          color: theme.text,
        },
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({color, size}) => {
          return <Icon name={icons[route.name]} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.text,
      })}>
      <Tab.Screen
        name="Main"
        component={MainScreen}
        options={{tabBarLabel: t('main')}}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{tabBarLabel: t('statistics')}}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
