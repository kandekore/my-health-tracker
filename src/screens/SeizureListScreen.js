import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSeizures } from '../context/SeizureContext';
import { deleteSeizure } from '../services/seizureApi';

const FILTERS = ['', 'Absence', 'Tonic-Clonic', 'Focal', 'Myoclonic', 'Atonic', 'Other'];

export default function SeizureListScreen({ navigation }) {
  const { items, refresh, loadMore, loadingMore } = useSeizures();
  const [filterType, setType] = useState('');

  const data = items.filter((i) => !filterType || i.type === filterType);

  const onDelete = (id) =>
    Alert.alert('Delete seizure?', '', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteSeizure(id); refresh(); } },
    ]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        horizontal
        data={FILTERS}
        keyExtractor={(t) => t || 'all'}
        style={{ flexGrow: 0 }}
        contentContainerStyle={{ padding: 10 }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setType(item)}
            style={[styles.pill, item === filterType && styles.pillActive]}
          >
            <Text style={item === filterType ? { color: '#fff' } : { color: '#4F83FF' }}>
              {item || 'All'}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={data}
        keyExtractor={(i) => i._id}
        onRefresh={refresh}
        refreshing={false}
        onEndReached={() => loadMore()}
        onEndReachedThreshold={0.4}
        contentContainerStyle={{ padding: 12 }}
        ListEmptyComponent={<Text style={styles.empty}>No seizures logged.</Text>}
        ListFooterComponent={loadingMore ? <Text style={styles.empty}>Loading…</Text> : null}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('SeizureEdit', { item })}
            onLongPress={() => onDelete(item._id)}
          >
            <Text style={styles.date}>{new Date(item.time).toLocaleString()}</Text>
            <Text style={styles.body}>{item.type} · {item.durationSec}s</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('TimeSelect', { category: 'Seizure' })}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  pill:       { borderWidth: 1, borderColor: '#4F83FF', padding: 6, paddingHorizontal: 12,
                borderRadius: 16, marginRight: 6 },
  pillActive: { backgroundColor: '#4F83FF' },
  card:       { backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 10, elevation: 2,
                shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  date:       { color: '#666', marginBottom: 4 },
  body:       { fontSize: 16, fontWeight: '600' },
  empty:      { textAlign: 'center', color: '#888', marginTop: 40 },
  fab:        { position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28,
                backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center', elevation: 4 },
  fabText:    { color: '#fff', fontSize: 28, lineHeight: 30 },
});
