import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/services/api';
import { Role } from '@/types';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';

interface AuthUser {
  id: string;
  email: string | null;
  role: Role;
  profile_image?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  hasRole: (role: string | string[]) => boolean;
  updateProfileImage: (image: string) => void;
  refreshProfileImage: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();
  
  // Enable real-time query invalidation
  useQueryInvalidation();

  // Check if user is already logged in on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      // Use the me() endpoint to get user profile
      const response = await authApi.me();
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      } else {
        // If me() endpoint doesn't exist or fails, clear token
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Clear token if there's an error
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3003/api'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.data?.token) {
        localStorage.setItem('token', data.data.token);
        await fetchUserProfile();
        return data;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfileImage = (image: string) => {
    if (user) {
      setUser({
        ...user,
        profile_image: image,
      });
    }
  };

  const refreshProfileImage = async () => {
    if (user) {
      // In a real implementation, you'd fetch a new signed URL for the profile image
      // For now, just refetch the user profile
      await fetchUserProfile();
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    hasRole: (role: string | string[]) => {
      if (Array.isArray(role)) {
        return role.includes(user?.role || '');
      }
      return user?.role === role;
    },
    updateProfileImage,
    refreshProfileImage,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};