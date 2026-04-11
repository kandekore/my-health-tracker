import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeScreen from '../components/SafeScreen';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  return (
    <SafeScreen>
      <ScrollView contentContainerStyle={s.container}>
        <Text style={s.title}>Profile</Text>

        <View style={s.card}>
          <Text style={s.label}>Name</Text>
          <Text style={s.value}>{user?.name || '—'}</Text>
          <View style={s.divider} />
          <Text style={s.label}>Email</Text>
          <Text style={s.value}>{user?.email}</Text>
        </View>

        <TouchableOpacity style={s.row} onPress={() => navigation.navigate('Export')}>
          <Ionicons name="share-outline" size={22} color="#4F83FF" />
          <Text style={s.rowText}>Export & share data</Text>
          <Ionicons name="chevron-forward" size={20} color="#9AA3B2" />
        </TouchableOpacity>

        <TouchableOpacity style={[s.btn]} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={s.btnText}>  Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeScreen>
  );
}

const s = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  title:     { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  card:      { backgroundColor: '#fff', padding: 16, borderRadius: 12, elevation: 1 },
  divider:   { height: 1, backgroundColor: '#eee', marginVertical: 12 },
  label:     { color: '#888', fontSize: 12, textTransform: 'uppercase' },
  value:     { fontSize: 16, marginTop: 4 },
  row:       { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
               padding: 16, borderRadius: 12, marginTop: 12, elevation: 1 },
  rowText:   { flex: 1, fontSize: 16, marginLeft: 12 },
  btn:       { backgroundColor: '#EF4444', padding: 14, borderRadius: 8,
               flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  btnText:   { color: '#fff', fontWeight: '600', fontSize: 16 },
});
