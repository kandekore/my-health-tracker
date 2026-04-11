import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import SafeScreen from '../components/SafeScreen';

const PRESETS = [
  { label: 'Now',        minutesAgo: 0 },
  { label: '1 min ago',  minutesAgo: 1 },
  { label: '5 min ago',  minutesAgo: 5 },
  { label: '10 min ago', minutesAgo: 10 },
  { label: '15 min ago', minutesAgo: 15 },
  { label: '30 min ago', minutesAgo: 30 },
  { label: '1 hr ago',   minutesAgo: 60 },
  { label: 'Manual',     minutesAgo: null },
];

export default function TimeSelectScreen({ route, navigation }) {
  const { category } = route.params;
  const [picking, setPicking] = useState(false);
  const [pickerValue, setPickerValue] = useState(new Date());

  const goTo = (iso) => navigation.navigate(category, { time: iso, category });

  const onPresetPress = (preset) => {
    if (preset.minutesAgo === null) {
      setPickerValue(new Date());
      setPicking(true);
    } else {
      goTo(new Date(Date.now() - preset.minutesAgo * 60_000).toISOString());
    }
  };

  return (
    <SafeScreen edges={['top', 'bottom']}>
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.heading}>When did it happen?</Text>
      <View style={styles.grid}>
        {PRESETS.map((p) => (
          <TouchableOpacity key={p.label} style={styles.btn} onPress={() => onPresetPress(p)}>
            <Text style={styles.btnText}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {picking && (
        <DateTimePicker
          value={pickerValue}
          mode="datetime"
          maximumDate={new Date()}
          onChange={(event, date) => {
            if (Platform.OS !== 'ios') setPicking(false);
            if (event.type === 'dismissed') { setPicking(false); return; }
            if (date) {
              setPickerValue(date);
              if (Platform.OS !== 'ios') goTo(date.toISOString());
            }
          }}
        />
      )}

      {picking && Platform.OS === 'ios' && (
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
          <TouchableOpacity style={styles.iosBtn} onPress={() => setPicking(false)}>
            <Text style={{ color: '#4F83FF' }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iosBtn, { backgroundColor: '#4F83FF' }]}
            onPress={() => { setPicking(false); goTo(pickerValue.toISOString()); }}
          >
            <Text style={{ color: '#fff' }}>Use this time</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  backBtn:   { position: 'absolute', top: 8, left: 8, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  heading:   { fontSize: 22, textAlign: 'center', marginBottom: 24, fontWeight: '600' },
  grid:      { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  btn: {
    width: '40%', margin: '5%', aspectRatio: 1,
    backgroundColor: '#4F83FF',
    justifyContent: 'center', alignItems: 'center',
    borderRadius: 12,
  },
  btnText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  iosBtn:  { padding: 12, marginHorizontal: 8, borderRadius: 8, borderWidth: 1, borderColor: '#4F83FF' },
});
