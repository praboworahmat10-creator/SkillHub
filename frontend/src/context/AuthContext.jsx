import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('skillhub_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('skillhub_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedToken = localStorage.getItem('skillhub_token');
      const storedUser = localStorage.getItem('skillhub_user');

      if (storedToken) {
        // If demo token, keep the local stored user and skip remote auth check
        if (storedToken.startsWith('demo_')) {
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (e) {
              console.error('Failed parsing demo user session:', e);
            }
          }
          setLoading(false);
          return;
        }

        try {
          const res = await api.get('/auth/me');
          if (res.data && res.data.data) {
            setUser(res.data.data);
            localStorage.setItem('skillhub_user', JSON.stringify(res.data.data));
          }
        } catch (error) {
          console.warn('Auth verification skipped (demo/offline):', error?.response?.status);
          // If server explicitly returned 401 Unauthorized for real token, clear invalid session
          if (error.response && error.response.status === 401) {
            setUser(null);
            setToken(null);
            localStorage.removeItem('skillhub_user');
            localStorage.removeItem('skillhub_token');
          }
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('skillhub_user', JSON.stringify(userData));
    localStorage.setItem('skillhub_token', userToken);
  };

  const logout = async () => {
    // Normalize role before clearing user state (same logic as getNormalizedRole)
    const rawRole = user?.role?.name || user?.role || user?.role_id;
    let currentRole = 'customer';
    if (rawRole === 1 || rawRole === '1' || rawRole === 'admin') currentRole = 'admin';
    else if (rawRole === 2 || rawRole === '2' || rawRole === 'freelancer') currentRole = 'freelancer';
    else if (rawRole === 3 || rawRole === '3' || rawRole === 'customer') currentRole = 'customer';
    else if (typeof rawRole === 'string') currentRole = rawRole.toLowerCase();

    try {
      if (token && !token.startsWith('demo_')) {
        await api.post('/auth/logout');
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('skillhub_user');
      localStorage.removeItem('skillhub_token');
    }
    return currentRole;
  };

  const getNormalizedRole = () => {
    if (!user) return 'guest';
    const rawRole = user?.role?.name || user?.role || user?.role_id;
    if (rawRole === 1 || rawRole === '1' || rawRole === 'admin') return 'admin';
    if (rawRole === 2 || rawRole === '2' || rawRole === 'freelancer') return 'freelancer';
    if (rawRole === 3 || rawRole === '3' || rawRole === 'customer') return 'customer';
    return typeof rawRole === 'string' ? rawRole.toLowerCase() : 'guest';
  };

  const userRole = getNormalizedRole();

  return (
    <AuthContext.Provider value={{ user, token, userRole, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
