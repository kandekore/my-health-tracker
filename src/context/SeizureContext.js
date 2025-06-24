import React, { createContext, useState, useContext, useEffect } from 'react';
import { listSeizures } from '../services/seizureApi';

// ---------- CONTEXT ---------- //
const Ctx = createContext();
export const useSeizures = () => useContext(Ctx);

// ---------- PROVIDER ---------- //
export function SeizureProvider({ children }) {
  const [items, setItems]   = useState([]);
  const [loading, setLoad ] = useState(false);

  const refresh = async (filter = {}) => {
    setLoad(true);
    const res = await listSeizures({ ...filter, userId: 'demoUser' });
    setItems(res.data);
    setLoad(false);
  };

  useEffect(() => { refresh(); }, []);

  return (
    <Ctx.Provider value={{ items, loading, refresh, setItems }}>
      {children}
    </Ctx.Provider>
  );
}

// ‼️  If you imported SeizureProvider *as default*, also add:
export default SeizureProvider;
