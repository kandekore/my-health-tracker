import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';

import LoginScreen    from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen     from '../screens/HomeScreen';

import TimeSelectScreen  from '../screens/TimeSelectScreen';
import SeizureScreen     from '../screens/SeizureScreen';
import SeizureConfirm    from '../screens/SeizureConfirm';
import SeizureListScreen from '../screens/SeizureListScreen';
import SeizureEditScreen from '../screens/SeizureEditScreen';

import KetoListScreen from '../screens/KetoListScreen';
import KetoLogScreen  from '../screens/KetoLogScreen';

import InsightsScreen from '../screens/InsightsScreen';
import ProfileScreen  from '../screens/ProfileScreen';
import ExportScreen   from '../screens/ExportScreen';

const Stack = createStackNavigator();
const Tabs  = createBottomTabNavigator();

const ACTIVE   = '#4F83FF';
const INACTIVE = '#9AA3B2';

const tabIcons = {
  Home:     ['home', 'home-outline'],
  Seizures: ['pulse', 'pulse-outline'],
  Keto:     ['nutrition', 'nutrition-outline'],
  Insights: ['stats-chart', 'stats-chart-outline'],
  Profile:  ['person', 'person-outline'],
};

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login"    component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function SeizureStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SeizureList"    component={SeizureListScreen} />
      <Stack.Screen name="TimeSelect"     component={TimeSelectScreen} />
      <Stack.Screen name="Seizure"        component={SeizureScreen} />
      <Stack.Screen name="SeizureConfirm" component={SeizureConfirm} />
      <Stack.Screen name="SeizureEdit"    component={SeizureEditScreen} />
    </Stack.Navigator>
  );
}

function KetoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="KetoList" component={KetoListScreen} />
      <Stack.Screen name="KetoLog"  component={KetoLogScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
      <Stack.Screen name="Export"      component={ExportScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: { paddingTop: 4, height: 84 },
        tabBarIcon: ({ focused, color, size }) => {
          const [filled, outline] = tabIcons[route.name] || ['ellipse', 'ellipse-outline'];
          return <Ionicons name={focused ? filled : outline} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Home"     component={HomeScreen} />
      <Tabs.Screen name="Seizures" component={SeizureStack} />
      <Tabs.Screen name="Keto"     component={KetoStack} />
      <Tabs.Screen name="Insights" component={InsightsScreen} />
      <Tabs.Screen name="Profile"  component={ProfileStack} />
    </Tabs.Navigator>
  );
}

export default function AppNavigator() {
  const { token, booting } = useAuth();
  if (booting) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return token ? <MainTabs /> : <AuthStack />;
}
