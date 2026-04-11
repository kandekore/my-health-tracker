import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function SeizureConfirm({ route, navigation }) {
  const { payload } = route.params ?? {};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seizure Logged ✅</Text>
      {payload && (
        <>
          <Text style={styles.line}>{payload.type}</Text>
          <Text style={styles.line}>{payload.durationSec}s</Text>
          <Text style={styles.line}>
            {new Date(payload.time).toLocaleString()}
          </Text>
        </>
      )}
      <TouchableOpacity style={styles.btn} onPress={() => navigation.popToTop()}>
        <Text style={{ color: '#fff' }}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    paddingTop: 50, // Added top padding
  },
  title: {
    fontSize: 28, // Increased font size for title
    fontWeight: 'bold', // Made title bold
    marginBottom: 30, // Increased margin below title
    color: '#10B981', // A celebratory color
  },
  line: {
    fontSize: 20, // Increased font size for details
    marginVertical: 8, // Increased vertical margin
    color: '#333',
  },
  btn: {
    marginTop: 40, // Increased margin above button
    backgroundColor: '#4F83FF',
    paddingVertical: 14, // Increased padding
    paddingHorizontal: 30, // Increased padding
    borderRadius: 10, // Slightly more rounded corners
  },
});
