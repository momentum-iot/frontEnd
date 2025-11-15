import React, { createContext, useState, useEffect } from 'react';
import { authRepository } from '../../infrastructure/api/repositories/AuthRepositoryImpl.js';
import { LoginUseCase } from '../../application/auth/LoginUseCase.js';
import { RegisterUseCase } from '../../application/auth/RegisterUseCase.js';
import { LogoutUseCase } from '../../application/auth/LogoutUseCase.js';
import { GetCurrentUserUseCase } from '../../application/auth/GetCurrentUserUseCase.js';
import { TokenStorage } from '../../infrastructure/storage/TokenStorage.js';


export const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(null);
  
  
  const [loading, setLoading] = useState(true);
  
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  
  const loginUseCase = new LoginUseCase(authRepository);
  const registerUseCase = new RegisterUseCase(authRepository);
  const logoutUseCase = new LogoutUseCase(authRepository);
  const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository);
  
  
  useEffect(() => {
    checkSession();
  }, []);
  
  
  useEffect(() => {
    const handleForcedLogout = () => {
      console.log('[AuthContext] Forced logout event received');
      handleLogout();
    };
    
    window.addEventListener('auth:logout', handleForcedLogout);
    
    return () => {
      window.removeEventListener('auth:logout', handleForcedLogout);
    };
  }, []);
  
  
  const checkSession = async () => {
    try {
      
      if (!TokenStorage.hasActiveSession()) {
        setLoading(false);
        return;
      }
      
      const result = await getCurrentUserUseCase.execute();
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
      } else {

        TokenStorage.clear();
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('[AuthContext] Error checking session:', error);
      TokenStorage.clear();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };
  

  const handleLogin = async (email, password) => {
    try {
      const result = await loginUseCase.execute(email, password);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
      }
      
      return result;
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      return {
        success: false,
        error: 'Error inesperado al iniciar sesión'
      };
    }
  };
  

  const handleRegister = async (userData) => {
    try {
      const result = await registerUseCase.execute(userData);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
      }
      
      return result;
    } catch (error) {
      console.error('[AuthContext] Register error:', error);
      return {
        success: false,
        error: 'Error inesperado al registrar usuario'
      };
    }
  };
  

  const handleLogout = async () => {
    try {
      await logoutUseCase.execute();
    } catch (error) {
      console.error('[AuthContext] Logout error:', error);
    } finally {

      setUser(null);
      setIsAuthenticated(false);
    }
  };
  
  
  const refreshUser = async () => {
    try {
      const result = await getCurrentUserUseCase.execute();
      
      if (result.success) {
        setUser(result.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('[AuthContext] Refresh user error:', error);
      return false;
    }
  };
  
  
  const value = {

    user,
    loading,
    isAuthenticated,

    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshUser,

    isAdmin: user?.isAdmin || false,
    isActive: user?.isActive || false
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};