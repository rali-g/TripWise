import React, { createContext, useContext, useState } from 'react';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

const DEMO_USERS: Record<string, User> = {
  'user@demo.com': {
    id: 'u1',
    name: 'Alex Johnson',
    email: 'user@demo.com',
    role: 'registered',
    loyaltyPoints: 2840,
    loyaltyTier: 'silver',
    avatar: 'AJ',
  },
  'business@demo.com': {
    id: 'u2',
    name: 'Maria Chen',
    email: 'business@demo.com',
    role: 'business',
    loyaltyPoints: 12500,
    loyaltyTier: 'gold',
    avatar: 'MC',
  },
  'admin@demo.com': {
    id: 'u3',
    name: 'Admin User',
    email: 'admin@demo.com',
    role: 'admin',
    loyaltyPoints: 0,
    loyaltyTier: 'platinum',
    avatar: 'AU',
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, _password: string) => {
    await new Promise(r => setTimeout(r, 800));
    const found = DEMO_USERS[email];
    if (!found) throw new Error('Invalid credentials');
    setUser(found);
  };

  const logout = () => setUser(null);

  const register = async (name: string, email: string, _password: string) => {
    await new Promise(r => setTimeout(r, 800));
    setUser({
      id: `u_${Date.now()}`,
      name,
      email,
      role: 'registered',
      loyaltyPoints: 500,
      loyaltyTier: 'bronze',
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
