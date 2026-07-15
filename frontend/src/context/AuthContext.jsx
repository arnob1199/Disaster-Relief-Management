import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);
const storageKey = 'disaster_relief_auth';

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey)) || null; } catch { return null; }
  });

  const setSession = (session) => {
    localStorage.setItem(storageKey, JSON.stringify(session));
    setAuth(session);
  };

  const login = async (credentials) => {
    const { data } = await api.auth.login(credentials);
    setSession({ token: data.token, user: data.user });
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem(storageKey);
    setAuth(null);
  };

  useEffect(() => {
    window.addEventListener('disaster-relief:logout', logout);
    return () => window.removeEventListener('disaster-relief:logout', logout);
  }, []);

  const value = useMemo(() => ({ user: auth?.user || null, token: auth?.token || null, login, logout }), [auth]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
