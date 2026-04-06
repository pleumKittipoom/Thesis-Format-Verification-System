// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: string[];
  allowedPermissions?: string[];
}

export const ProtectedRoute = ({ allowedRoles, allowedPermissions }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  // 1. รอตรวจสอบสิทธิ์ (แสดง Loading หมุนๆ ระหว่างรอ API /me)
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 2. ถ้าไม่มี User -> ดีดไป Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role.toLowerCase();

  // 3. เช็คว่า Role ตรงกับที่อนุญาตหรือไม่ (ด่านแรก)
  const hasRole = allowedRoles.includes(userRole);
  if (!hasRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. ถ้าเป็น Admin ให้ผ่านทุกกรณี (Superuser Bypass)
  if (userRole === 'admin') {
    return <Outlet />;
  }

  // 5. ถ้า Route นี้มีการจำกัด Permission เพิ่มเติม (ด่านสอง สำหรับ Instructor)
  if (allowedPermissions && allowedPermissions.length > 0) {
    
    // แปลงสิทธิ์ของ User จาก Object เป็น Array ของ String เช่น ['manage:users', 'approve:thesis']
    const userPerms = (user as any).permissions?.map((p: any) => `${p.action}:${p.resource}`) || [];

    // เช็คว่า User มีสิทธิ์ตรงกับที่ Route ต้องการหรือไม่ (มีอย่างน้อย 1 สิทธิ์ที่ตรงกันก็ผ่านได้)
    const hasPermission = allowedPermissions.some(perm => userPerms.includes(perm));

    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // ผ่านทุกด่าน -> แสดงผล Component ตามปกติ
  return <Outlet />;
};