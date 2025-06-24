import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import SeizureProvider from './src/context/SeizureContext';

export default function App() {
  return (
    <SeizureProvider>
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
    </SeizureProvider>
  );
}
