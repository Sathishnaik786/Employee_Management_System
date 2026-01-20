import React, { createContext, useContext, useEffect, useState, useRef, ReactNode, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { Role } from '@/types';
import { useQueryInvalidation } from '@/hooks/useQueryInvalidation';
import { createPermissionResolver, PermissionResolver } from '@/access/permission-resolver';
import { Permission } from '@/access/permissions';

interface AuthUser {
  id: string;
  email: string | null;
  role: Role;
  profile_image?: string;
  permissions?: string[];
  [key: string]: any;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  hasRole: (role: string | string[]) => boolean; // Deprecated, use hasPermission
  hasPermission: (permission: Permission | string) => boolean;
  hasAnyPermission: (permissions: (Permission | string)[]) => boolean;
  hasAllPermissions: (permissions: (Permission | string)[]) => boolean;
  updateProfileImage: (image: string) => void;
  refreshProfileImage: () => Promise<void>;
  resolvedPermissions: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const profileRequestPromiseRef = useRef<Promise<any> | null>(null);
  const queryClient = useQueryClient();

  // Create permission resolver in-memory
  const resolver = useMemo(() => {
    return createPermissionResolver(user?.role || null, user?.permissions || []);
  }, [user?.role, user?.permissions]);

  useQueryInvalidation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    if (profileRequestPromiseRef.current) return profileRequestPromiseRef.current;

    const requestPromise = (async () => {
      try {
        setIsLoading(true);
        const response = await authService.me();
        if (response.success && response.data?.user) {
          setUser(response.data.user as any);
        } else {
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsLoading(false);
        profileRequestPromiseRef.current = null;
      }
    })();

    profileRequestPromiseRef.current = requestPromise;
    return requestPromise;
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      if (response.success && response.data?.token) {
        localStorage.setItem('token', response.data.token);
        await fetchUserProfile();
        return response;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    queryClient.clear();
  };

  const value = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    hasRole: (role: string | string[]) => {
      if (Array.isArray(role)) return role.includes(user?.role || '');
      return user?.role === role;
    },
    hasPermission: (p: Permission | string) => resolver.hasPermission(p),
    hasAnyPermission: (p: (Permission | string)[]) => resolver.hasAnyPermission(p),
    hasAllPermissions: (p: (Permission | string)[]) => resolver.hasAllPermissions(p),
    updateProfileImage: (image: string) => {
      if (user) setUser({ ...user, profile_image: image });
    },
    refreshProfileImage: async () => {
      if (!user) return;
      try {
        const response = await authService.me();
        if (response.success && response.data?.user) {
          const updatedUser = response.data.user;
          if (updatedUser.profile_image !== user.profile_image) {
            setUser({ ...user, profile_image: updatedUser.profile_image });
          }
        }
      } catch (error) {
        console.error('Error refreshing profile image:', error);
      }
    },
    resolvedPermissions: resolver.getResolvedPermissions(),
  }), [user, isLoading, resolver]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};