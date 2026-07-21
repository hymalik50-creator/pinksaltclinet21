'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { adminApi, getAdminToken, setAdminToken } from '@/lib/api';
import type { AdminSession, AdminUser } from '@/lib/types';

interface AdminContextValue {
  user: AdminUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AdminSession>({
    user: null,
    token: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      setLoading(false);
      return;
    }
    adminApi
      .getSession()
      .then((response: any) => {
        // Backend returns { success, message, data: { email, name, role, userId } }
        const userData = response.data;
        if (userData && userData.email) {
          const user = {
            id: userData.userId,
            email: userData.email,
            name: userData.name || 'Admin User',
            role: userData.role || 'admin',
          };
          setSession({ user, token });
        } else {
          setAdminToken(null);
          setSession({ user: null, token: null });
        }
      })
      .catch(() => {
        setAdminToken(null);
        setSession({ user: null, token: null });
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const response = await adminApi.login(email, password);
    // Backend returns { success, message, data: { token, user, email, role, userId } }
    const data = response.data;
    const token = data.token;
    const user = {
      id: data.userId || data.user?.id,
      email: data.email || data.user?.email,
      name: data.user?.name || 'Admin User',
      role: data.role || data.user?.role || 'admin',
    };
    setAdminToken(token);
    setSession({ user, token });
  };

  const logout = async () => {
    try {
      await adminApi.logout();
    } catch {
      // ignore
    }
    setAdminToken(null);
    setSession({ user: null, token: null });
  };

  return (
    <AdminContext.Provider value={{ ...session, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
