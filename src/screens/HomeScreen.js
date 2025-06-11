import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health Obs Tracker</Text>
      <Button
        title="Log a Seizure"
        onPress={() => navigation.navigate('TimeSelect', { category: 'Seizure' })}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title:     { fontSize: 24, marginBottom: 24 },
});
