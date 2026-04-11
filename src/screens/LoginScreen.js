import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import SafeScreen from '../components/SafeScreen';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy]         = useState(false);

  const onSubmit = async () => {
    if (!email || !password) return Alert.alert('Missing info', 'Enter email and password.');
    setBusy(true);
    try { await login(email.trim(), password); }
    catch (e) { Alert.alert('Login failed', e.response?.data?.error || e.message); }
    finally { setBusy(false); }
  };

  return (
    <SafeScreen edges={['top', 'bottom']}>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <View style={s.container}>
      <Text style={s.title}>Health Obs Tracker</Text>
      <Text style={s.sub}>Sign in to continue</Text>

      <TextInput style={s.input} placeholder="Email" autoCapitalize="none"
        keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={s.input} placeholder="Password" secureTextEntry
        value={password} onChangeText={setPassword} />

      <TouchableOpacity style={s.btn} onPress={onSubmit} disabled={busy}>
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Log In</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={s.link}>No account? Create one</Text>
      </TouchableOpacity>
    </View>
    </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title:     { fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  sub:       { textAlign: 'center', color: '#666', marginBottom: 24 },
  input:     { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  btn:       { backgroundColor: '#4F83FF', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  btnText:   { color: '#fff', fontSize: 16, fontWeight: '600' },
  link:      { textAlign: 'center', marginTop: 20, color: '#4F83FF' },
});
