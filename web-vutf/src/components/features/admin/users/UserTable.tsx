// src/components/features/admin/users/UserTable.tsx
import { useState, useEffect, useRef } from 'react';
import {
  FiEdit2,
  FiTrash2,
  FiMoreHorizontal,
  FiEye,
  FiUser,
  FiInbox,
  FiLayers,
  FiUsers,
  FiRefreshCw,
  FiMail,
  FiActivity,
  FiSettings,
  FiHash,
  FiShield,
  FiUnlock,
} from 'react-icons/fi';
import { User } from '../../../../types/user';
import { InstructorPermissionModal } from './InstructorPermissionModal';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { userService } from '../../../../services/user.service';

interface UserTableProps {
  data: User[];
  totalItems: number;
  role: 'student' | 'instructor';
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onDetail: (user: User) => void;
  onRefresh?: () => void;
}

export const UserTable = ({ data, totalItems, role, isLoading, onEdit, onDelete, onDetail, onRefresh }: UserTableProps) => {
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [selectedInstructorForPerm, setSelectedInstructorForPerm] = useState<User | null>(null);

  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  // ปิดเมนูเมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenActionId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenActionId(prev => prev === id ? null : id);
  };

  const handleUnlock = async (id: string) => {
    try {
      await userService.unlockUser(id);
      toast.success('ปลดล็อคบัญชีเรียบร้อยแล้ว');
      setOpenActionId(null);
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด ไม่สามารถปลดล็อคได้');
    }
  };

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 flex flex-col items-center justify-center gap-3 animate-pulse transition-colors">
        <div className="w-10 h-10 border-4 border-blue-100 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  // --- Empty State ---
  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 flex flex-col items-center justify-center gap-4 text-center transition-colors">
        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-500">
          <FiInbox size={32} />
        </div>
        <div>
          <h3 className="text-gray-800 dark:text-white font-semibold">ไม่พบข้อมูล</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">ลองเปลี่ยนคำค้นหา หรือตัวกรองข้อมูล</p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="mt-4 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            โหลดข้อมูลใหม่
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col transition-colors">
      <InstructorPermissionModal
        isOpen={permissionModalOpen}
        onClose={() => {
          setPermissionModalOpen(false);
          setSelectedInstructorForPerm(null);
        }}
        user={selectedInstructorForPerm}
        onSuccess={() => {
          if (onRefresh) onRefresh(); // ถ้าเซฟเสร็จ ให้รีเฟรชตารางใหม่
        }}
      />
      {/* ส่วนหัวตาราง*/}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800 transition-colors">
        <div className="flex items-center gap-3">
          {/* Icon Box */}
          <div className={`p-2.5 rounded-xl ${role === 'student'
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
            : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
            }`}>
            {role === 'student' ? <FiUser size={20} /> : <FiUsers size={20} />}
          </div>

          {/* Title & Count */}
          <div>
            <h3 className="font-bold text-gray-800 dark:text-white text-base flex items-center gap-2">
              {role === 'student' ? 'ข้อมูลนักศึกษา' : 'ข้อมูลอาจารย์'}
              <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-xs font-medium">
                {totalItems}
              </span>
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              รายชื่อ{role === 'student' ? 'นักศึกษา' : 'อาจารย์'}ทั้งหมดในระบบ
            </p>
          </div>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
            title="รีเฟรชข้อมูล"
          >
            <FiRefreshCw size={20} />
          </button>
        )}
      </div>

      <div className="overflow-x-auto overflow-y-visible pb-24 sm:pb-0 min-h-[300px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider transition-colors">
              <th className="px-6 py-4">
                <div className="flex items-center gap-1">
                  <FiUser size={14} /> ชื่อ - นามสกุล
                </div>
              </th>
              <th className="px-6 py-4">
                <div className="flex items-center gap-1">
                  <FiHash size={14} />
                  {role === 'student' ? 'รหัสนักศึกษา' : 'รหัสอาจารย์'}
                </div>
              </th>

              {role === 'student' && (
                <th className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <FiLayers size={14} /> กลุ่มเรียน
                  </div>
                </th>
              )}

              <th className="px-6 py-4">
                <div className="flex items-center gap-1">
                  <FiMail size={14} /> อีเมล
                </div>
              </th>

              <th className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <FiActivity size={14} /> สถานะ
                </div>
              </th>

              <th className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <FiSettings size={14} /> จัดการ
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
            {data.map((item) => {
              const id = item.user_uuid;

              // Extract Data logic
              let name = '-';
              let code = '-';
              let sectionName = null;

              if (role === 'student' && item.student) {
                name = `${item.student.prefix_name || ''}${item.student.first_name} ${item.student.last_name}`;
                code = item.student.student_code;
                sectionName = item.student.section?.section_name;
              } else if (role === 'instructor' && item.instructor) {
                name = `${item.instructor.first_name} ${item.instructor.last_name}`;
                code = item.instructor.instructor_code;
              }

              const isOpen = openActionId === id;
              const firstChar = name !== '-' ? name.charAt(0) : '?';

              // Random avatar color based on name length (updated for dark mode)
              const colors = [
                'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
                'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
                'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
                'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
              ];
              const colorClass = colors[name.length % colors.length];

              return (
                <tr key={id} className="hover:bg-blue-50/30 dark:hover:bg-gray-700/30 transition-colors duration-150 group">

                  {/* Column 1: Name & Avatar */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${colorClass}`}>
                        {firstChar}
                      </div>
                      <div>
                        <div className="text-sm text-gray-800 dark:text-white">{name}</div>
                        {/* Mobile view only: show email below name */}
                        <div className="text-xs text-gray-400 dark:text-gray-500 sm:hidden">{item.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Code */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded border border-gray-100 dark:border-gray-600 text-xs">
                      {code}
                    </span>
                  </td>

                  {/* Column 3: Section (Student Only) */}
                  {role === 'student' && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sectionName ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50">
                          {sectionName}
                        </span>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600 text-sm">-</span>
                      )}
                    </td>
                  )}

                  {/* Column 4: Email */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300 text-sm">
                    {item.email}
                  </td>

                  {/* Column 5: Status */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${item.isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50'
                      : 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      {item.isActive ? 'ใช้งานปกติ' : 'ถูกระงับ'}
                    </span>
                  </td>

                  {/* Column 6: Action */}
                  <td className="px-6 py-4 whitespace-nowrap text-center relative">
                    <button
                      onClick={(e) => handleToggleMenu(id, e)}
                      className={`p-2 rounded-lg transition-all duration-200 outline-none
                        ${isOpen
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-700'}
                      `}
                    >
                      <FiMoreHorizontal size={20} />
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                      <div
                        ref={menuRef}
                        className="absolute right-8 top-8 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right transition-colors"
                      >
                        <div className="p-1">
                          <button
                            onClick={() => { onDetail(item); setOpenActionId(null); }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg flex items-center gap-2.5 transition-colors"
                          >
                            <FiEye size={16} className="text-gray-400 dark:text-gray-500" /> ดูรายละเอียด
                          </button>

                          <button
                            onClick={() => { onEdit(item); setOpenActionId(null); }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg flex items-center gap-2.5 transition-colors"
                          >
                            <FiEdit2 size={16} className="text-gray-400 dark:text-gray-500" /> แก้ไขข้อมูล
                          </button>

                          {role === 'instructor' && item.isActive && isAdmin && (
                            <button
                              onClick={() => {
                                setSelectedInstructorForPerm(item);
                                setPermissionModalOpen(true);
                                setOpenActionId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg flex items-center gap-2.5 transition-colors"
                            >
                              <FiShield size={16} className="text-gray-400 dark:text-gray-500" /> จัดการสิทธิ์
                            </button>
                          )}

                          {isAdmin && item.isLocked && (
                            <button
                              onClick={() => handleUnlock(id)}
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-green-600 dark:hover:text-green-400 rounded-lg flex items-center gap-2.5 transition-colors"
                            >
                              <FiUnlock size={16} className="text-gray-400 dark:text-gray-500" /> Unlock Login
                            </button>
                          )}

                          <div className="h-px bg-gray-100 dark:bg-gray-700 my-1 mx-2"></div>

                          <button
                            onClick={() => { onDelete(id); setOpenActionId(null); }}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-2.5 transition-colors group/del"
                          >
                            <FiTrash2 size={16} className="text-red-400 dark:text-red-500 group-hover/del:text-red-600 dark:group-hover/del:text-red-400" />
                            {item.isActive ? 'ระงับการใช้งาน' : 'ระงับการใช้งาน'}
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};