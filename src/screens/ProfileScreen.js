import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  return (
    <View style={s.container}>
      <Text style={s.title}>Profile</Text>
      <View style={s.card}>
        <Text style={s.label}>Name</Text>
        <Text style={s.value}>{user?.name || '—'}</Text>
        <Text style={[s.label, { marginTop: 12 }]}>Email</Text>
        <Text style={s.value}>{user?.email}</Text>
      </View>
      <TouchableOpacity style={s.btn} onPress={logout}>
        <Text style={s.btnText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  title:     { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  card:      { backgroundColor: '#fff', padding: 16, borderRadius: 12, elevation: 1 },
  label:     { color: '#888', fontSize: 12, textTransform: 'uppercase' },
  value:     { fontSize: 16, marginTop: 2 },
  btn:       { backgroundColor: '#EF4444', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  btnText:   { color: '#fff', fontWeight: '600', fontSize: 16 },
});
