import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createKeto } from '../services/ketoApi';
import { useKeto } from '../context/KetoContext';

export default function KetoLogScreen({ navigation }) {
  const { refresh } = useKeto();
  const [time, setTime]       = useState(new Date());
  const [showPicker, setShow] = useState(false);
  const [fields, setFields]   = useState({
    carbsG: '', fatG: '', proteinG: '', ketonesMmol: '', glucoseMmol: '', notes: '',
  });
  const set = (k) => (v) => setFields((f) => ({ ...f, [k]: v }));

  const gki = (() => {
    const g = parseFloat(fields.glucoseMmol);
    const k = parseFloat(fields.ketonesMmol);
    if (g > 0 && k > 0) return (g / k).toFixed(2);
    return '—';
  })();

  const save = async () => {
    try {
      const payload = {
        time: time.toISOString(),
        carbsG:      fields.carbsG      ? Number(fields.carbsG)      : 0,
        fatG:        fields.fatG        ? Number(fields.fatG)        : 0,
        proteinG:    fields.proteinG    ? Number(fields.proteinG)    : 0,
        ketonesMmol: fields.ketonesMmol ? Number(fields.ketonesMmol) : undefined,
        glucoseMmol: fields.glucoseMmol ? Number(fields.glucoseMmol) : undefined,
        notes:       fields.notes || undefined,
      };
      await createKeto(payload);
      await refresh();
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || e.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={s.container}>
      <Text style={s.heading}>Log Keto Entry</Text>

      <Text style={s.label}>When</Text>
      <TouchableOpacity style={s.timeBtn} onPress={() => setShow(true)}>
        <Text>{time.toLocaleString()}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={time}
          mode="datetime"
          onChange={(_e, d) => { setShow(Platform.OS === 'ios'); if (d) setTime(d); }}
        />
      )}

      <Row label="Carbs (g)"   value={fields.carbsG}      onChange={set('carbsG')} />
      <Row label="Fat (g)"     value={fields.fatG}        onChange={set('fatG')} />
      <Row label="Protein (g)" value={fields.proteinG}    onChange={set('proteinG')} />
      <Row label="Ketones (mmol/L)" value={fields.ketonesMmol} onChange={set('ketonesMmol')} />
      <Row label="Glucose (mmol/L)" value={fields.glucoseMmol} onChange={set('glucoseMmol')} />

      <Text style={s.gki}>GKI: <Text style={{ fontWeight: 'bold' }}>{gki}</Text></Text>

      <Text style={s.label}>Notes</Text>
      <TextInput
        style={[s.input, { height: 80 }]}
        multiline
        value={fields.notes}
        onChangeText={set('notes')}
      />

      <TouchableOpacity style={s.saveBtn} onPress={save}>
        <Text style={s.saveText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Row({ label, value, onChange }) {
  return (
    <View>
      <Text style={s.label}>{label}</Text>
      <TextInput
        style={s.input}
        keyboardType="decimal-pad"
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { padding: 20, paddingBottom: 60 },
  heading:   { fontSize: 24, textAlign: 'center', marginBottom: 16, fontWeight: 'bold' },
  label:     { fontSize: 14, color: '#555', marginTop: 10, marginBottom: 4 },
  input:     { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
  timeBtn:   { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 },
  gki:       { marginTop: 12, fontSize: 16, textAlign: 'center' },
  saveBtn:   { backgroundColor: '#10B981', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  saveText:  { color: '#fff', fontSize: 16, fontWeight: '600' },
});
