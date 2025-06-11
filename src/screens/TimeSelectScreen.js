import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/** Presets in minutes; 0 means “Now”. */
const PRESETS = [
  { label: 'Now',          minutesAgo: 0 },
  { label: '1 min ago',    minutesAgo: 1 },
  { label: '5 min ago',    minutesAgo: 5 },
  { label: '10 min ago',   minutesAgo: 10 },
  { label: '15 min ago',   minutesAgo: 15 },
  { label: '30 min ago',   minutesAgo: 30 },
  { label: '1 hr ago',     minutesAgo: 60 },
  { label: 'Manual',       minutesAgo: null }, // null triggers the DateTime picker
];

export default function TimeSelectScreen({ route, navigation }) {
  const { category } = route.params;          // e.g. "Seizure"

  const onPresetPress = (preset) => {
    if (preset.minutesAgo === null) {
      //  Manual: show the system date-time picker ---------------------------
      navigation.navigate(category, { time: new Date(), category });
      //  For brevity we skip picker implementation here; plug one in later.
    } else {
      const time = new Date(Date.now() - preset.minutesAgo * 60_000);
      navigation.navigate(category, { time, category });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>When did it happen?</Text>
      <View style={styles.grid}>
        {PRESETS.map((p) => (
          <TouchableOpacity
            key={p.label}
            style={styles.btn}
            onPress={() => onPresetPress(p)}
          >
            <Text style={styles.btnText}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  heading:   { fontSize: 22, textAlign: 'center', marginBottom: 24 },
  grid:      { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  btn: {
    width: '40%', margin: '5%', aspectRatio: 1,
    backgroundColor: '#4F83FF',
    justifyContent: 'center', alignItems: 'center',
    borderRadius: 12,
  },
  btnText:   { color: '#fff', fontSize: 16, textAlign: 'center' },
});
