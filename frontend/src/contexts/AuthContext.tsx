import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role, Employee } from '@/types';
import { authApi, employeesApi } from '@/services/api';
import { supabase } from '@/lib/supabase';

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
      try {
        // Get current session from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Query employees table using user_id = session.user.id
          const { data: employeeData, error } = await supabase
            .from('employees')
            .select('id, user_id, role, first_name, last_name, profile_image')
            .eq('user_id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching employee data:', error);
            // Don't logout here, just set user to null
            setUser(null);
          } else if (employeeData) {
            // Set user data using employee information
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              role: employeeData.role as Role,
              employeeId: employeeData.id,
              name: `${employeeData.first_name} ${employeeData.last_name}`,
              firstName: employeeData.first_name,
              lastName: employeeData.last_name,
              profile_image: employeeData.profile_image || undefined,
            });
          } else {
            // No employee record found for this user
            setUser(null);
          }
        } else {
          // No active session
          setUser(null);
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: any) => {
        if (event === 'SIGNED_OUT' || event === 'PASSWORD_RECOVERY') {
          setUser(null);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          if (session) {
            // Query employees table using user_id = session.user.id
            const { data: employeeData, error } = await supabase
              .from('employees')
              .select('id, user_id, role, first_name, last_name, profile_image')
              .eq('user_id', session.user.id)
              .single();

            if (error) {
              console.error('Error fetching employee data:', error);
              setUser(null);
            } else if (employeeData) {
              // Set user data using employee information
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                role: employeeData.role as Role,
                employeeId: employeeData.id,
                name: `${employeeData.first_name} ${employeeData.last_name}`,
                firstName: employeeData.first_name,
                lastName: employeeData.last_name,
                profile_image: employeeData.profile_image || undefined,
              });
            } else {
              // No employee record found for this user
              setUser(null);
            }
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log('AUTH USER STATE:', user);
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      // Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      const session = data.session;
      if (session) {
        // Query employees table using user_id = session.user.id
        const { data: employeeData, error: employeeError } = await supabase
          .from('employees')
          .select('id, user_id, role, first_name, last_name, profile_image')
          .eq('user_id', session.user.id)
          .single();

        if (employeeError) {
          console.error('Error fetching employee data:', employeeError);
          throw new Error('Failed to retrieve employee data');
        } else if (employeeData) {
          // Set user data using employee information
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            role: employeeData.role as Role,
            employeeId: employeeData.id,
            name: `${employeeData.first_name} ${employeeData.last_name}`,
            firstName: employeeData.first_name,
            lastName: employeeData.last_name,
            profile_image: employeeData.profile_image || undefined,
          });

          // Store the session token in localStorage for compatibility with backend APIs
          localStorage.setItem('token', session.access_token);
        } else {
          throw new Error('No employee record found for this user');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out from Supabase:', error);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      // Redirect to login page after logout
      window.location.href = '/login';
    }
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
        const { data: employeeData, error } = await supabase
          .from('employees')
          .select('profile_image')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching employee profile from Supabase:', error);
          return undefined;
        } else {
          const newProfileImage: string | undefined = employeeData?.profile_image || undefined;
          setUser(prev => prev ? { ...prev, profile_image: newProfileImage } : null);
          return newProfileImage;
        }
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
