import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen       from '../screens/HomeScreen';
import TimeSelectScreen from '../screens/TimeSelectScreen';
import SeizureScreen    from '../screens/SeizureScreen';

const Stack = createStackNavigator();
export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home"       component={HomeScreen} />
      <Stack.Screen name="TimeSelect" component={TimeSelectScreen} />
      <Stack.Screen name="Seizure"    component={SeizureScreen} />
    </Stack.Navigator>
  );
}
