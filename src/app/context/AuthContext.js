'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { 
  subscribeToAuthChanges, 
  loginWithEmailAndPassword, 
  registerWithEmailAndPassword, 
  signInWithGoogle, 
  signOut, 
  resetPassword 
} from '../firebase/auth';

// Create context
const AuthContext = createContext();

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuthChanges((user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Auth methods wrapped with context state updates
  const login = async (email, password) => {
    const result = await loginWithEmailAndPassword(email, password);
    return result;
  };

  const register = async (email, password) => {
    const result = await registerWithEmailAndPassword(email, password);
    return result;
  };

  const loginWithGoogle = async () => {
    const result = await signInWithGoogle();
    return result;
  };

  const logout = async () => {
    const result = await signOut();
    return result;
  };

  const forgotPassword = async (email) => {
    const result = await resetPassword(email);
    return result;
  };

  // Context value
  const value = {
    user,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    forgotPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 