import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeScreen from '../components/SafeScreen';
import { useSeizures } from '../context/SeizureContext';
import { createSeizure } from '../services/seizureApi';

const SEIZURE_TYPES = [
  'Absence', 'Tonic-Clonic', 'Focal', 'Myoclonic',
  'Atonic', 'Infantile Spasm', 'Other',
];

const DURATION_PRESETS = [5, 10, 30, 60, 120, 300];

export default function SeizureScreen({ route, navigation }) {
  const { time } = route.params;
  const timeObj  = time ? new Date(time) : new Date();
  const { refresh } = useSeizures();

  const [type, setType]            = useState(null);
  const [durationSec, setDuration] = useState(0);

  const addDuration = (sec) => setDuration((prev) => prev + sec);
  const resetDuration = () => setDuration(0);

  const saveRecord = async () => {
    if (!type || durationSec === 0) {
      return Alert.alert('Missing info', 'Please pick a seizure type and a duration.');
    }
    try {
      const payload = { time, type, durationSec };
      await createSeizure(payload);
      await refresh();
      navigation.navigate('SeizureConfirm', { payload });
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const formatDur = (sec) => {
    if (sec < 60) return `${sec} sec`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return s ? `${m} min ${s} sec` : `${m} min`;
  };

  return (
    <SafeScreen edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.heading}>Seizure details</Text>
            <View style={{ width: 32 }} />
          </View>

          <Text style={styles.whenLabel}>When</Text>
          <Text style={styles.whenValue}>{timeObj.toLocaleString()}</Text>

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

          <View style={styles.durationHeader}>
            <Text style={styles.label}>Duration</Text>
            {durationSec > 0 && (
              <TouchableOpacity onPress={resetDuration}>
                <Text style={styles.reset}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.durationValue}>{formatDur(durationSec)}</Text>
          <Text style={styles.durationHint}>Tap to add time</Text>

          <View style={styles.grid}>
            {DURATION_PRESETS.map((sec) => (
              <TouchableOpacity
                key={sec}
                style={styles.squareBtn}
                onPress={() => addDuration(sec)}
              >
                <Text style={styles.squareText}>
                  +{sec >= 60 ? `${sec / 60}m` : `${sec}s`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={saveRecord}>
            <Ionicons name="checkmark-circle" size={22} color="#fff" />
            <Text style={styles.saveText}>  Save seizure</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 60 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  backBtn:   { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  heading:   { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  whenLabel: { color: '#888', fontSize: 12, textTransform: 'uppercase', marginTop: 4 },
  whenValue: { fontSize: 16, marginBottom: 20 },
  label:     { fontSize: 16, fontWeight: '600', marginTop: 8, marginBottom: 10 },
  grid:      { flexDirection: 'row', flexWrap: 'wrap' },
  pill: {
    paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20,
    borderWidth: 1, borderColor: '#4F83FF', marginRight: 8, marginBottom: 8,
    backgroundColor: '#fff',
  },
  pillActive:     { backgroundColor: '#4F83FF' },
  pillText:       { color: '#4F83FF', fontWeight: '500' },
  pillTextActive: { color: '#fff', fontWeight: '600' },

  durationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  reset:          { color: '#EF4444', fontSize: 14 },
  durationValue:  { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginVertical: 8, color: '#1F2937' },
  durationHint:   { fontSize: 12, color: '#888', textAlign: 'center', marginBottom: 12 },

  squareBtn: {
    width: '30%', marginHorizontal: '1.66%', marginBottom: 12, aspectRatio: 1.6,
    backgroundColor: '#FFB04F', borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  squareText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },

  saveBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 16, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: 16,
  },
  saveText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
