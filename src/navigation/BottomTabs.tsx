// src/navigation/BottomTabs.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import MainScreen from '../screens/MainScreen';
import StatisticsScreen from '../screens/StatisticsScreen';

const Tab = createBottomTabNavigator();

const icons: any = { Main: 'home', Statistics: 'bar-chart' };

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ color, size }) => {
          return <Icon name={icons[route.name]} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: '#339af0',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Main" component={MainScreen} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
