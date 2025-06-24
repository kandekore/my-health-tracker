import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { updateSeizure } from '../services/seizureApi';
import { useSeizures } from '../context/SeizureContext';

export default function SeizureEditScreen({ route, navigation }) {
  const orig = route.params.item;
  const [duration, setDur] = useState(String(orig.durationSec));
  const { refresh } = useSeizures();

  const onSave = async () => {
    try {
      await updateSeizure(orig._id, { durationSec: Number(duration) });
      await refresh();
      navigation.goBack();
    } catch (e) { Alert.alert('Error', e.message); }
  };

  return (
    <View style={{flex:1,justifyContent:'center',padding:24}}>
      <Text style={{fontSize:18,marginBottom:8}}>Edit Duration (sec)</Text>
      <TextInput
        value={duration}
        keyboardType='numeric'
        onChangeText={setDur}
        style={{borderWidth:1,borderColor:'#ccc',padding:8,borderRadius:6}}
      />
      <TouchableOpacity onPress={onSave}
        style={{backgroundColor:'#10B981',padding:12,marginTop:20,borderRadius:8,alignItems:'center'}}>
        <Text style={{color:'#fff'}}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}
