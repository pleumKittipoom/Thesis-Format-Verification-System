// src/components/features/group/GroupTable.tsx
// Component แสดงตารางกลุ่มวิทยานิพนธ์

import React from 'react';
import { FiUsers, FiUser, FiEye, FiEdit, FiTrash2, FiLoader, FiInbox, FiCheckCircle, FiClock, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

/**
 * ข้อมูลกลุ่มสำหรับแสดงในตาราง
 */
export interface GroupTableData {
    group_id: string;
    thesis_id: string | null;
    thesis_code: string;
    thesis_name_th: string;
    member_count: number;
    totalMemberCount?: number;
    members?: any[];
    status: 'incomplete' | 'pending' | 'approved' | 'rejected' | string;
    role: 'owner' | 'member';
    created_at: string;
    rejection_reason?: string | null;
}

interface GroupTableProps {
    /** ข้อมูลกลุ่ม */
    groups: GroupTableData[];
    /** สถานะกำลังโหลด */
    isLoading?: boolean;
    /** Callback เมื่อคลิกดูรายละเอียด */
    onView?: (groupId: string) => void;
    /** Callback เมื่อคลิกแก้ไข */
    onEdit?: (groupId: string) => void;
    /** Callback เมื่อคลิกลบ */
    onDelete?: (groupId: string) => void;
}

/**
 * GroupTable - ตารางแสดงกลุ่มวิทยานิพนธ์
 * * Single Responsibility: แสดงข้อมูลกลุ่มในรูปแบบตาราง
 * * Features:
 * - Responsive design
 * - Loading/Empty states
 * - Action buttons
 */
export const GroupTable: React.FC<GroupTableProps> = ({
    groups,
    isLoading = false,
    onView,
    onEdit,
    onDelete,
}) => {
    // Status badge styles
    const getStatusStyle = (status: GroupTableData['status']) => {
        switch (status) {
            case 'approved': // อนุมัติแล้ว
                return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
            case 'pending': // รออนุมัติ
                return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
            case 'incomplete': // ยังไม่สมบูรณ์
                return 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600';
            case 'rejected': // ปฏิเสธ
                return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800';
            default:
                return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600';
        }
    };

    const getStatusLabel = (status: GroupTableData['status']) => {
        switch (status) {
            case 'approved':
                return 'อนุมัติแล้ว';
            case 'pending':
                return 'รออนุมัติ';
            case 'incomplete':
                return 'รอสมาชิกตอบรับ';
            case 'rejected':
                return 'ปฏิเสธ';
            default:
                return status;
        }
    };

    // Role badge styles
    const getRoleStyle = (role: GroupTableData['role']) => {
        return role === 'owner'
            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
    };

    const getDisplayMemberCount = (group: GroupTableData) => {
        // Priority 1: นับสดจาก Array members (ถ้ามี) โดยตัดคน Reject ออก
        if (group.members && Array.isArray(group.members)) {
            return group.members.filter((m: any) => m.invitation_status !== 'rejected').length;
        }
        // Priority 2: ใช้ค่าจาก Backend ถ้าส่งมา
        return group.totalMemberCount ?? group.member_count ?? 0;
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <FiLoader className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-500 dark:text-gray-400">กำลังโหลดข้อมูลกลุ่ม...</p>
            </div>
        );
    }

    // กรองข้อมูลกลุ่มที่ thesis_id ไม่เป็น null เท่านั้น (หากถูก Soft Delete ใน Backend ข้อมูล thesis จะกลายเป็น null)
    const activeGroups = groups.filter(group => group.thesis_id !== null);

    // Empty state
    if (activeGroups.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16"
            >
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 transition-colors">
                    <FiInbox className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-900 dark:text-white font-medium mb-2">ยังไม่มีกลุ่มวิทยานิพนธ์</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    คุณยังไม่ได้เป็นสมาชิกในกลุ่มวิทยานิพนธ์ใดๆ
                </p>
            </motion.div>
        );
    }

    return (
        <div className="overflow-x-auto">
            {/* Desktop Table View - แสดงเฉพาะหน้าจอ md ขึ้นไป */}
            <table className="w-full hidden md:table">
                <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                        <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">รหัสวิทยานิพนธ์</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">ชื่อวิทยานิพนธ์</th>
                        <th className="text-center py-4 px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">สมาชิก</th>
                        <th className="text-center py-4 px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">บทบาท</th>
                        <th className="text-center py-4 px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">สถานะ</th>
                        <th className="text-center py-4 px-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {activeGroups.map((group, index) => (
                        <motion.tr
                            key={group.group_id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                        >
                            <td className="py-4 px-4">
                                <span className="font-mono text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                                    {group.thesis_code}
                                </span>
                            </td>
                            <td className="py-4 px-4">
                                <p className="text-gray-900 dark:text-white font-medium text-sm line-clamp-2 max-w-xs">{group.thesis_name_th}</p>
                                {group.status === 'rejected' && group.rejection_reason && (
                                    <div className="flex items-center gap-1 mt-1 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-md w-fit border border-red-100 dark:border-red-800">
                                        <FiAlertCircle className="w-3 h-3 flex-shrink-0" />
                                        <p className="text-[12px] font-medium leading-tight">หมายเหตุ: กรุณารีบดำเนินการแก้ไขข้อมูล</p>
                                    </div>
                                )}
                            </td>
                            <td className="py-4 px-4 text-center">
                                <div className="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                                    <FiUsers className="w-4 h-4" />
                                    <span className="text-sm font-medium">{getDisplayMemberCount(group)}</span>
                                </div>
                            </td>
                            <td className="py-4 px-4 text-center">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleStyle(group.role)}`}>
                                    {group.role === 'owner' ? <><FiUser className="w-3 h-3" /> เจ้าของ</> : 'สมาชิก'}
                                </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(group.status)}`}>
                                    {group.status === 'approved' && <FiCheckCircle className="w-3.5 h-3.5" />}
                                    {group.status === 'pending' && <FiClock className="w-3.5 h-3.5" />}
                                    {group.status === 'incomplete' && <FiUsers className="w-3.5 h-3.5" />}
                                    {group.status === 'rejected' && <FiXCircle className="w-3.5 h-3.5" />}
                                    {getStatusLabel(group.status)}
                                </span>
                            </td>
                            <td className="py-4 px-4">
                                <div className="flex items-center justify-center gap-1">
                                    {onView && (
                                        <button onClick={() => onView(group.group_id)} className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="ดูรายละเอียด">
                                            <FiEye className="w-4 h-4" />
                                        </button>
                                    )}
                                    {onEdit && group.role === 'owner' && group.status !== 'approved' && (
                                        <button onClick={() => onEdit(group.group_id)} className="p-2 text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors" title="แก้ไข">
                                            <FiEdit className="w-4 h-4" />
                                        </button>
                                    )}
                                    {onDelete && group.role === 'owner' && (
                                        <button onClick={() => onDelete(group.group_id)} className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="ลบ">
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>

            {/* Mobile Card View - แสดงเฉพาะหน้าจอขนาดเล็กกว่า md */}
            <div className="md:hidden space-y-4">
                {activeGroups.map((group, index) => (
                    <motion.div
                        key={group.group_id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-3 transition-colors"
                    >
                        <div className="flex justify-between items-start gap-2">
                            <span className="font-mono text-[12px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded shrink-0">
                                {group.thesis_code}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getRoleStyle(group.role)}`}>
                                {group.role === 'owner' ? <FiUser className="w-2.5 h-2.5" /> : null}
                                {group.role === 'owner' ? 'เจ้าของ' : 'สมาชิก'}
                            </span>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-gray-900 dark:text-white font-bold text-sm leading-snug">
                                {group.thesis_name_th}
                            </h3>
                            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-[12px]">
                                <span className="flex items-center gap-1"><FiUsers className="w-3 h-3" /> {getDisplayMemberCount(group)} สมาชิก</span>
                                <span>•</span>
                                <span className={`font-semibold ${getStatusStyle(group.status).split(' ')[1]}`}>
                                    {getStatusLabel(group.status)}
                                </span>
                            </div>
                        </div>

                        {group.status === 'rejected' && group.rejection_reason && (
                            <div className="flex items-start gap-1.5 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                                <FiAlertCircle className="w-3.5 h-3.5 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-red-600 dark:text-red-400 leading-tight">หมายเหตุ: กรุณารีบดำเนินการแก้ไขข้อมูล</p>
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50 dark:border-gray-700">
                            {onView && (
                                <button onClick={() => onView(group.group_id)} className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-[12px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors">
                                    <FiEye className="w-3.5 h-3.5" /> รายละเอียด
                                </button>
                            )}
                            {onEdit && group.role === 'owner' && group.status !== 'approved' && (
                                <button onClick={() => onEdit(group.group_id)} className="p-2 text-amber-500 bg-amber-50 dark:bg-amber-900/20 rounded-lg transition-colors">
                                    <FiEdit className="w-4 h-4" />
                                </button>
                            )}
                            {onDelete && group.role === 'owner' && (
                                <button onClick={() => onDelete(group.group_id)} className="p-2 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg transition-colors">
                                    <FiTrash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default GroupTable;