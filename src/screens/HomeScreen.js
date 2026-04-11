import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeScreen from '../components/SafeScreen';
import { useAuth } from '../context/AuthContext';
import { useSeizures } from '../context/SeizureContext';
import { useKeto } from '../context/KetoContext';

export default function HomeScreen({ navigation }) {
  const { user }   = useAuth();
  const { items: seizures } = useSeizures();
  const { items: keto }     = useKeto();

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const seizuresToday = seizures.filter((s) => new Date(s.time) >= today).length;
  const ketoToday     = keto.filter((k) => new Date(k.time) >= today).length;
  const lastSeizure   = seizures[0];
  const lastKetones   = keto.find((k) => k.ketonesMmol != null);

  return (
    <SafeScreen>
      <ScrollView contentContainerStyle={s.container}>
        <Text style={s.hello}>Hi{user?.name ? `, ${user.name}` : ''} 👋</Text>
        <Text style={s.subtitle}>Here's your snapshot</Text>

        <View style={s.row}>
          <Card label="Seizures today" value={seizuresToday} color="#EF4444" />
          <Card label="Keto logs today" value={ketoToday} color="#10B981" />
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Last seizure</Text>
          {lastSeizure ? (
            <>
              <Text style={s.cardBody}>{lastSeizure.type} · {lastSeizure.durationSec}s</Text>
              <Text style={s.cardMeta}>{new Date(lastSeizure.time).toLocaleString()}</Text>
            </>
          ) : <Text style={s.cardMeta}>None logged yet.</Text>}
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Last ketone reading</Text>
          {lastKetones ? (
            <>
              <Text style={s.cardBody}>{lastKetones.ketonesMmol} mmol/L</Text>
              <Text style={s.cardMeta}>{new Date(lastKetones.time).toLocaleString()}</Text>
            </>
          ) : <Text style={s.cardMeta}>None logged yet.</Text>}
        </View>

        <TouchableOpacity
          style={[s.action, { backgroundColor: '#EF4444' }]}
          onPress={() => navigation.navigate('Seizures', { screen: 'TimeSelect', params: { category: 'Seizure' } })}
        >
          <Ionicons name="add-circle-outline" size={22} color="#fff" />
          <Text style={s.actionText}>  Log a Seizure</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.action, { backgroundColor: '#10B981' }]}
          onPress={() => navigation.navigate('Keto', { screen: 'KetoLog' })}
        >
          <Ionicons name="add-circle-outline" size={22} color="#fff" />
          <Text style={s.actionText}>  Log Keto Entry</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeScreen>
  );
}

const Card = ({ label, value, color }) => (
  <View style={[s.stat, { borderLeftColor: color }]}>
    <Text style={s.statValue}>{value}</Text>
    <Text style={s.statLabel}>{label}</Text>
  </View>
);

const s = StyleSheet.create({
  container:  { padding: 20, paddingBottom: 40 },
  hello:      { fontSize: 26, fontWeight: 'bold' },
  subtitle:   { color: '#666', marginBottom: 20 },
  row:        { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  stat:       { flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 14, marginHorizontal: 4,
                borderLeftWidth: 4, elevation: 1 },
  statValue:  { fontSize: 28, fontWeight: 'bold' },
  statLabel:  { fontSize: 12, color: '#666', marginTop: 2 },
  card:       { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, elevation: 1 },
  cardTitle:  { color: '#888', fontSize: 12, textTransform: 'uppercase', marginBottom: 4 },
  cardBody:   { fontSize: 16, fontWeight: '600' },
  cardMeta:   { color: '#666', marginTop: 2 },
  action:     { padding: 16, borderRadius: 12, marginTop: 12, flexDirection: 'row',
                alignItems: 'center', justifyContent: 'center' },
  actionText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
