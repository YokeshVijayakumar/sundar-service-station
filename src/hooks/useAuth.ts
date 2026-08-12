import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../services/api';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const storedUsername = localStorage.getItem('admin_username');
    if (token && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (user: string, password: string) => {
    const response = await adminApi.login(user, password);
    localStorage.setItem('admin_token', response.data.token);
    localStorage.setItem('admin_username', response.data.username);
    setIsAuthenticated(true);
    setUsername(response.data.username);
    return response;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    setIsAuthenticated(false);
    setUsername('');
  }, []);

  return { isAuthenticated, username, loading, login, logout };
}
