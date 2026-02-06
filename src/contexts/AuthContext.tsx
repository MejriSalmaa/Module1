import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: Record<UserRole, User> = {
  client: {
    id: 'client-1',
    name: 'Sarah Johnson',
    email: 'sarah@techcorp.com',
    role: 'client',
    company: 'TechCorp Inc.',
    avatar: undefined,
  },
  admin: {
    id: 'admin-1',
    name: 'Michael Chen',
    email: 'michael@kothontech.com',
    role: 'admin',
    company: 'KothonTech',
    avatar: undefined,
  },
  talent: {
    id: 'talent-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@email.com',
    role: 'talent',
    avatar: undefined,
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: UserRole) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setUser(mockUsers[role]);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    setUser(mockUsers[role]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
      }}
    >
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
