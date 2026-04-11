import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import AppNavigator from './src/navigation/AppNavigator';
import AuthProvider from './src/context/AuthContext';
import { SeizureProvider } from './src/context/SeizureContext';
import { KetoProvider } from './src/context/KetoContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SeizureProvider>
          <KetoProvider>
            <NavigationContainer>
              <StatusBar style="dark" />
              <AppNavigator />
            </NavigationContainer>
          </KetoProvider>
        </SeizureProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
