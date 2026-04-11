import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginApi, registerApi } from '../services/authApi';

const AuthCtx = createContext();
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser]         = useState(null);
  const [token, setToken]       = useState(null);
  const [booting, setBooting]   = useState(true);

  useEffect(() => {
    (async () => {
      const [t, u] = await Promise.all([
        AsyncStorage.getItem('token'),
        AsyncStorage.getItem('user'),
      ]);
      if (t) setToken(t);
      if (u) setUser(JSON.parse(u));
      setBooting(false);
    })();
  }, []);

  const persist = async (t, u) => {
    await AsyncStorage.multiSet([['token', t], ['user', JSON.stringify(u)]]);
    setToken(t);
    setUser(u);
  };

  const login = async (email, password) => {
    const { data } = await loginApi(email, password);
    await persist(data.token, data.user);
  };

  const register = async (email, password, name) => {
    const { data } = await registerApi(email, password, name);
    await persist(data.token, data.user);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['token', 'user']);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, token, booting, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
