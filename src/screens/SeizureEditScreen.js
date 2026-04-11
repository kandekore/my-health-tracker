import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { updateSeizure, deleteSeizure } from '../services/seizureApi';
import { useSeizures } from '../context/SeizureContext';

const SEIZURE_TYPES = [
  'Absence', 'Tonic-Clonic', 'Focal', 'Myoclonic', 'Atonic', 'Infantile Spasm', 'Other',
];

export default function SeizureEditScreen({ route, navigation }) {
  const orig = route.params.item;
  const { refresh } = useSeizures();

  const [type, setType]         = useState(orig.type);
  const [duration, setDuration] = useState(String(orig.durationSec));
  const [time, setTime]         = useState(new Date(orig.time));
  const [picking, setPicking]   = useState(false);

  const onSave = async () => {
    const durNum = Number(duration);
    if (!type || !Number.isFinite(durNum) || durNum <= 0) {
      return Alert.alert('Invalid', 'Type and a positive duration are required.');
    }
    try {
      await updateSeizure(orig._id, {
        type,
        durationSec: durNum,
        time: time.toISOString(),
      });
      await refresh();
      navigation.goBack();
    } catch (e) { Alert.alert('Error', e.response?.data?.error || e.message); }
  };

  const onDelete = () =>
    Alert.alert('Delete this seizure?', '', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await deleteSeizure(orig._id);
            await refresh();
            navigation.goBack();
          } catch (e) { Alert.alert('Error', e.response?.data?.error || e.message); }
        },
      },
    ]);

  return (
    <ScrollView contentContainerStyle={s.container}>
      <Text style={s.heading}>Edit Seizure</Text>

      <Text style={s.label}>Type</Text>
      <View style={s.grid}>
        {SEIZURE_TYPES.map((t) => (
          <TouchableOpacity
            key={t}
            style={[s.pill, type === t && s.pillActive]}
            onPress={() => setType(t)}
          >
            <Text style={type === t ? s.pillTextActive : s.pillText}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={s.label}>When</Text>
      <TouchableOpacity style={s.timeBtn} onPress={() => setPicking(true)}>
        <Text>{time.toLocaleString()}</Text>
      </TouchableOpacity>
      {picking && (
        <DateTimePicker
          value={time}
          mode="datetime"
          maximumDate={new Date()}
          onChange={(_e, d) => {
            setPicking(Platform.OS === 'ios');
            if (d) setTime(d);
          }}
        />
      )}

      <Text style={s.label}>Duration (seconds)</Text>
      <TextInput
        style={s.input}
        keyboardType="numeric"
        value={duration}
        onChangeText={setDuration}
      />

      <TouchableOpacity style={s.saveBtn} onPress={onSave}>
        <Text style={s.saveText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.deleteBtn} onPress={onDelete}>
        <Text style={s.deleteText}>Delete</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container:  { padding: 20, paddingBottom: 60 },
  heading:    { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  label:      { fontSize: 14, color: '#555', marginTop: 16, marginBottom: 6 },
  grid:       { flexDirection: 'row', flexWrap: 'wrap' },
  pill:       { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20,
                borderWidth: 1, borderColor: '#4F83FF', margin: 4 },
  pillActive: { backgroundColor: '#4F83FF' },
  pillText:       { color: '#4F83FF' },
  pillTextActive: { color: '#fff' },
  timeBtn:    { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 },
  input:      { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
  saveBtn:    { backgroundColor: '#10B981', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  saveText:   { color: '#fff', fontSize: 16, fontWeight: '600' },
  deleteBtn:  { padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: '#EF4444' },
  deleteText: { color: '#EF4444', fontSize: 16, fontWeight: '600' },
});
