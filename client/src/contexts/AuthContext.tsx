import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/axios'; 
import { toast } from 'sonner';

export interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loginWithGoogle: (googleCredential: string) => Promise<void>;
}

// Type guard to check for Axios-like error object
function isAxiosError(
  error: unknown
): error is { isAxiosError: boolean; response?: { status: number; data?: { error?: string } } } {
  return typeof error === 'object' && error !== null && 'isAxiosError' in error;
}

// Initialize auth state from localStorage synchronously
const getInitialAuthState = () => {
  try {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    console.log('Initial auth check - Token exists:', !!storedToken);
    console.log('Initial auth check - User exists:', !!storedUser);
    
    if (storedToken && storedUser) {
      // Set axios header immediately
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      
      return {
        isAuthenticated: true,
        user: JSON.parse(storedUser) as User,
        token: storedToken
      };
    }
  } catch (error) {
    console.error('Error initializing auth state:', error);
  }
  
  return {
    isAuthenticated: false,
    user: null,
    token: null
  };
};

const initialAuthState = getInitialAuthState();

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  loginWithGoogle: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthState.isAuthenticated);
  const [user, setUser] = useState<User | null>(initialAuthState.user);
  const [token, setToken] = useState<string | null>(initialAuthState.token);

  // Double-check auth state on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        console.log('Rechecking authentication state...');
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        console.log('Stored token exists:', !!storedToken);
        console.log('Stored user exists:', !!storedUser);
        
        if (storedToken && storedUser) {
          console.log('Setting authentication state from localStorage');
          setToken(storedToken);
          setUser(JSON.parse(storedUser) as User);
          setIsAuthenticated(true);
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        } else {
          console.log('No authentication data found in localStorage');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    // Run immediately
    checkAuth();
  }, []);


  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password });

      const { token: newToken, user: newUser } = response.data;

      setIsAuthenticated(true);
      setUser(newUser);
      setToken(newToken);

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error('Invalid credentials');
        } else {
          toast.error(`Login failed: ${error.response?.data?.error || 'Unexpected error'}`);
        }
      } else {
        toast.error('An unexpected error occurred');
      }
      throw error; 
    }
  };

  const logout = () => {
    console.log('Logging out user');
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  };

  const loginWithGoogle = async (googleCredential: string) => {
    try {
      const response = await api.post<AuthResponse>('/auth/google', { credential: googleCredential });
      const { token: newToken, user: newUser } = response.data;
      setIsAuthenticated(true);
      setUser(newUser);
      setToken(newToken);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } catch (error: unknown) {
      toast.error('Google login failed');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
