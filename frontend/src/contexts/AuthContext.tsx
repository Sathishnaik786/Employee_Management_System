import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role, Employee } from '@/types';
import { authApi, employeesApi } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: Role[]) => boolean;
  updateProfileImage: (imageUrl: string) => void;
  refreshProfileImage: () => Promise<string | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await authApi.me();
        const userData = response.data.user;
        
        // Fetch employee profile to get profile_image
        let profileImage: string | undefined = undefined;
        try {
          const employeeData = await employeesApi.getProfile();
          profileImage = employeeData?.profile_image || undefined;
        } catch (profileError) {
          console.error('Error fetching employee profile:', profileError);
        }
        
        setUser({
          id: userData.id,
          email: userData.email,
          role: userData.role,
          employeeId: userData.employeeId,
          name: `${userData.firstName} ${userData.lastName}`,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profile_image: profileImage,
        });
      } catch (error) {
        console.error('Auth verification failed:', error);
        logout();
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    console.log('AUTH USER STATE:', user);
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const data = await authApi.login(email, password);

      localStorage.setItem('token', data.token);

      // Fetch employee profile to get profile_image
      let profileImage: string | undefined = undefined;
      try {
        const employeeData = await employeesApi.getProfile();
        profileImage = employeeData?.profile_image || undefined;
      } catch (profileError) {
        console.error('Error fetching employee profile:', profileError);
      }
      
      setUser({
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        employeeId: data.user.employeeId,
        name: `${data.user.firstName} ${data.user.lastName}`,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        profile_image: profileImage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    // Redirect to login page after logout
    window.location.href = '/login';
  };

  const hasRole = (roles: Role[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const updateProfileImage = (imageUrl: string) => {
    if (user) {
      setUser(prev => prev ? { ...prev, profile_image: imageUrl } : null);
    }
  };

  const refreshProfileImage = async () => {
    if (user) {
      try {
        const employeeData = await employeesApi.getProfile();
        const newProfileImage: string | undefined = employeeData?.profile_image || undefined;
        setUser(prev => prev ? { ...prev, profile_image: newProfileImage } : null);
        return newProfileImage;
      } catch (error) {
        console.error('Error refreshing profile image:', error);
        return undefined;
      }
    }
    return undefined;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, hasRole, updateProfileImage, refreshProfileImage }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
