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
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title:     { fontSize: 24, marginBottom: 16 },
  line:      { fontSize: 18, marginVertical: 2 },
  btn:       { marginTop: 24, backgroundColor: '#4F83FF',
               paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
});
