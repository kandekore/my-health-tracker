import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import SafeScreen from '../components/SafeScreen';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy]         = useState(false);

  const onSubmit = async () => {
    if (!email || password.length < 6) {
      return Alert.alert('Invalid', 'Email and 6+ character password required.');
    }
    setBusy(true);
    try { await register(email.trim(), password, name.trim()); }
    catch (e) { Alert.alert('Sign up failed', e.response?.data?.error || e.message); }
    finally { setBusy(false); }
  };

  return (
    <SafeScreen edges={['top', 'bottom']}>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <View style={s.container}>
      <Text style={s.title}>Create account</Text>

      <TextInput style={s.input} placeholder="Name (optional)" value={name} onChangeText={setName} />
      <TextInput style={s.input} placeholder="Email" autoCapitalize="none"
        keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={s.input} placeholder="Password (6+ chars)" secureTextEntry
        value={password} onChangeText={setPassword} />

      <TouchableOpacity style={s.btn} onPress={onSubmit} disabled={busy}>
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Sign Up</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={s.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
    </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title:     { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  input:     { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  btn:       { backgroundColor: '#10B981', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  btnText:   { color: '#fff', fontSize: 16, fontWeight: '600' },
  link:      { textAlign: 'center', marginTop: 20, color: '#4F83FF' },
});
