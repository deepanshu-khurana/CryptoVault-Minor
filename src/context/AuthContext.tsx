import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// --- Type Definitions ---
interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthContextType extends AuthState {
  login: (username: string, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Auth Provider Component ---
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    username: null,
    accessToken: null,
    refreshToken: null,
  });

  // Load state from local storage on component mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');
    const user = localStorage.getItem('username');

    if (token && user && refresh) {
      setAuthState({
        isAuthenticated: true,
        username: user,
        accessToken: token,
        refreshToken: refresh,
      });
    }
  }, []);

  const login = (username: string, accessToken: string, refreshToken: string) => {
    // 1. Store tokens and username
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('username', username);

    // 2. Update state
    setAuthState({
      isAuthenticated: true,
      username: username,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  };

  const logout = () => {
    localStorage.clear(); // Clear all auth data
    setAuthState({ isAuthenticated: false, username: null, accessToken: null, refreshToken: null });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Custom Hook to Consume Context ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};