import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

const SEIZURE_TYPES = [
  'Absence', 'Tonic-Clonic', 'Focal', 'Myoclonic',
  'Atonic', 'Infantile Spasm', 'Other',
];

const DURATION_PRESETS = [5, 10, 30, 60, 120, 300]; // seconds

export default function SeizureScreen({ route, navigation }) {
  const { time } = route.params;
  const [type, setType]             = useState(null);
  const [durationSec, setDuration]  = useState(0);

  // ––––– Handlers ––––– //
  const addDuration = (sec) => setDuration((prev) => prev + sec);

  const saveRecord = () => {
    if (!type || durationSec === 0) {
      Alert.alert('Missing info', 'Please pick a seizure type and duration.');
      return;
    }

    /* TODO: call your API here */
    console.log({
      category: 'Seizure',
      time,
      type,
      durationSec,
    });

    Alert.alert('Saved', 'Seizure logged successfully.');
    navigation.popToTop();   // ← back to Home
  };

  // ––––– UI ––––– //
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Seizure Details</Text>

      <Text style={styles.label}>Type</Text>
      <View style={styles.grid}>
        {SEIZURE_TYPES.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.pill, type === t && styles.pillActive]}
            onPress={() => setType(t)}
          >
            <Text style={[styles.pillText, type === t && styles.pillTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, { marginTop: 24 }]}>Duration</Text>
      <View style={styles.grid}>
        {DURATION_PRESETS.map((sec) => (
          <TouchableOpacity
            key={sec}
            style={styles.squareBtn}
            onPress={() => addDuration(sec)}
          >
            <Text style={styles.squareText}>{sec >= 60 ? `${sec / 60} min` : `${sec} sec`}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.duration}>Current total: {durationSec} sec</Text>

      <TouchableOpacity style={styles.saveBtn} onPress={saveRecord}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  heading:   { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  label:     { fontSize: 18, marginBottom: 8 },
  grid:      { flexDirection: 'row', flexWrap: 'wrap' },

  // pill buttons for seizure types
  pill: {
    paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20,
    borderWidth: 1, borderColor: '#4F83FF', margin: 4,
  },
  pillActive:   { backgroundColor: '#4F83FF' },
  pillText:     { color: '#4F83FF' },
  pillTextActive: { color: '#fff' },

  // square buttons for duration
  squareBtn: {
    width: '28%', margin: '2%', aspectRatio: 1,
    backgroundColor: '#FFB04F', borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  squareText: { color: '#fff', fontWeight: 'bold' },

  duration:   { fontSize: 16, textAlign: 'center', marginVertical: 16 },

  saveBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 14, borderRadius: 12,
    alignItems: 'center', marginTop: 8,
  },
  saveText: { color: '#fff', fontSize: 18 },
});
