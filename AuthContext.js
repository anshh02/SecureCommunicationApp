import { createContext, useContext, useEffect, useState } from 'react';
import { AuthAPI } from './api';
import { TokenStorage } from './tokenStorage';
import { wsManager } from './wsManager';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isAuth = await TokenStorage.isAuthenticated();
      if (isAuth) {
        // Try to fetch latest user profile (this will also persist it)
        const userResult = await AuthAPI.getCurrentUser();
        if (userResult.success) {
          setUser(userResult.user);
          setIsAuthenticated(true);
        } else {
          // token invalid
          await logout();
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const result = await AuthAPI.login(username, password);
      
      if (result.success) {
        await TokenStorage.setToken(result.access_token); // store token
        const profile = await AuthAPI.getCurrentUser();
        if (profile.success) {
          setUser(profile.user);
          setIsAuthenticated(true);
          wsManager.connect();
        }
        return result;
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (username, email, password) => {
    try {
      const result = await AuthAPI.register(username, email, password);
      
      if (result.success) {
        await TokenStorage.setToken(result.access_token);
        const profile = await AuthAPI.getCurrentUser();
        if (profile.success) {
          setUser(profile.user);
          setIsAuthenticated(true);
          wsManager.connect();
        }
        return result;
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
  await TokenStorage.deleteToken();
  wsManager.close();
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const refreshUser = async () => {
    try {
      const userResult = await AuthAPI.getCurrentUser();
      if (userResult.success) {
        setUser(userResult.user);
        return userResult;
      }
      return userResult;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};