import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSeizures } from '../context/SeizureContext';

export default function SeizureListScreen({ navigation }) {
  const { items, refresh } = useSeizures();
  const [filterType,setType] = useState('');

  const data = items.filter(i => !filterType || i.type === filterType);

  return (
    <View style={{flex:1,padding:12}}>
      {/* simple filter pills */}
      <FlatList
        horizontal
        data={['','Absence','Tonic-Clonic','Focal']}
        keyExtractor={(t)=>t||'all'}
        renderItem={({item})=>(
          <TouchableOpacity
            onPress={()=>setType(item)}
            style={[styles.pill, item===filterType && styles.pillActive]}>
            <Text style={item===filterType && {color:'#fff'}}>{item||'All'}</Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={data}
        keyExtractor={(i)=>i._id}
        onRefresh={()=>refresh()}
        refreshing={false}
        renderItem={({item})=>(
          <TouchableOpacity
            style={styles.card}
            onPress={()=>navigation.navigate('SeizureEdit',{item})}>
            <Text>{new Date(item.time).toLocaleString()}</Text>
            <Text>{item.type}  •  {item.durationSec}s</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  pill:{borderWidth:1,borderColor:'#4F83FF',padding:6,paddingHorizontal:12,borderRadius:16,marginRight:6},
  pillActive:{backgroundColor:'#4F83FF'},
  card:{padding:12,borderBottomWidth:1,borderColor:'#eee'}
});
