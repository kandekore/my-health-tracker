import React, { createContext, useState, useContext, useEffect } from 'react';
import { listKeto } from '../services/ketoApi';
import { useAuth } from './AuthContext';

const PAGE = 50;
const Ctx = createContext();
export const useKeto = () => useContext(Ctx);

export function KetoProvider({ children }) {
  const { token } = useAuth();
  const [items, setItems]      = useState([]);
  const [total, setTotal]      = useState(0);
  const [loading, setLoading]  = useState(false);
  const [loadingMore, setMore] = useState(false);

  const refresh = async (filter = {}) => {
    if (!token) { setItems([]); setTotal(0); return; }
    setLoading(true);
    try {
      const res = await listKeto({ ...filter, limit: PAGE, skip: 0 });
      setItems(res.data.items);
      setTotal(res.data.total);
    } finally { setLoading(false); }
  };

  const loadMore = async (filter = {}) => {
    if (loadingMore || items.length >= total) return;
    setMore(true);
    try {
      const res = await listKeto({ ...filter, limit: PAGE, skip: items.length });
      setItems((prev) => [...prev, ...res.data.items]);
      setTotal(res.data.total);
    } finally { setMore(false); }
  };

  useEffect(() => { refresh(); }, [token]);

  return (
    <Ctx.Provider value={{ items, total, loading, loadingMore, refresh, loadMore }}>
      {children}
    </Ctx.Provider>
  );
}

export default KetoProvider;
