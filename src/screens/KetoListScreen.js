import React from 'react';
import { Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeScreen from '../components/SafeScreen';
import { useKeto } from '../context/KetoContext';
import { deleteKeto } from '../services/ketoApi';

export default function KetoListScreen({ navigation }) {
  const { items, refresh, loadMore, loadingMore } = useKeto();

  const onDelete = (id) =>
    Alert.alert('Delete entry?', '', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteKeto(id); refresh(); } },
    ]);

  return (
    <SafeScreen>
      <Text style={s.title}>Keto log</Text>
      <FlatList
        data={items}
        keyExtractor={(i) => i._id}
        onRefresh={refresh}
        refreshing={false}
        onEndReached={() => loadMore()}
        onEndReachedThreshold={0.4}
        contentContainerStyle={{ padding: 12 }}
        ListEmptyComponent={<Text style={s.empty}>No keto entries yet.</Text>}
        ListFooterComponent={loadingMore ? <Text style={s.empty}>Loading…</Text> : null}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={s.card}
            onLongPress={() => onDelete(item._id)}
          >
            <Text style={s.date}>{new Date(item.time).toLocaleString()}</Text>
            <Text>C {item.carbsG}g · F {item.fatG}g · P {item.proteinG}g</Text>
            {(item.ketonesMmol != null || item.glucoseMmol != null) && (
              <Text>
                {item.ketonesMmol != null && `Ketones ${item.ketonesMmol} `}
                {item.glucoseMmol != null && `Glucose ${item.glucoseMmol} `}
                {item.gki != null && `· GKI ${item.gki}`}
              </Text>
            )}
            {item.notes ? <Text style={s.notes}>{item.notes}</Text> : null}
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={s.fab} onPress={() => navigation.navigate('KetoLog')}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeScreen>
  );
}

const s = StyleSheet.create({
  title:   { fontSize: 26, fontWeight: 'bold', marginHorizontal: 16, marginTop: 8, marginBottom: 4 },
  card:    { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 10, elevation: 2,
             shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  date:    { color: '#666', marginBottom: 4 },
  notes:   { marginTop: 4, color: '#444', fontStyle: 'italic' },
  empty:   { textAlign: 'center', color: '#888', marginTop: 40 },
  fab:     { position: 'absolute', right: 20, bottom: 24, width: 56, height: 56, borderRadius: 28,
             backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center', elevation: 4,
             shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
});
