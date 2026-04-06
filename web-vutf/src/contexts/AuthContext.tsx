// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, UserProfile } from '../services/auth.service';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true); // เริ่มต้นเป็น True เสมอ เพื่อรอเช็ค /me

  // ฟังก์ชัน Check Auth (ทำงานครั้งแรกที่เปิดเว็บ หรือ Refresh)
  const checkAuth = async () => {
    try {
      const res = await authService.getMe();
      if (res.data) {
        setUser(res.data);
      }
    } catch (error) {
      // ถ้า Error แปลว่า Cookie หมดอายุ หรือยังไม่ Login
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Wrapper Login
  const login = async (credentials: any) => {
    try {
      // ยิง API Login เพื่อให้ Backend set cookie (httpOnly)
      await authService.login(credentials);
      // ดึงข้อมูล User ปัจจุบันมาเก็บใน Context
      await checkAuth();

    } catch (error) {
      throw error;
    }
  };

  // Wrapper Logout
  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      window.location.href = '/login'; // Hard refresh ไปหน้า login
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook สำหรับเรียกใช้ Context ง่ายๆ
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};