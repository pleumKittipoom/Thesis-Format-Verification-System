// src/components/features/group/InviteMemberModal.tsx
// Modal สำหรับเชิญสมาชิกใหม่

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSearch, FiUser, FiPlus, FiLoader, FiCheck } from 'react-icons/fi';
import { useStudentSearch } from '@/hooks/useStudentSearch';
import { groupMemberService } from '@/services/group-member.service';
import { StudentInfo } from '@/types/thesis';
import Swal from 'sweetalert2';

interface InviteMemberModalProps {
    /** รหัสกลุ่ม */
    groupId: string;
    /** ปิด Modal */
    onClose: () => void;
    /** Callback เมื่อเชิญสำเร็จ */
    onSuccess?: () => void;
}

/**
 * InviteMemberModal - Modal สำหรับเชิญสมาชิกใหม่
 * * Features:
 * - ค้นหานักศึกษา
 * - เลือกและเชิญเข้ากลุ่ม
 */
export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
    groupId,
    onClose,
    onSuccess,
}) => {
    // Suppress unused
    // console.log(groupId);
    const { query, setQuery, results, isLoading: isSearching } = useStudentSearch();
    const [isInviting, setIsInviting] = useState(false);
    const [invitedStudents, setInvitedStudents] = useState<Set<string>>(new Set());

    const handleInvite = async (student: StudentInfo) => {
        setIsInviting(true);
        try {
            await groupMemberService.inviteMember(groupId, student.student_uuid);

            // Mark as invited
            setInvitedStudents((prev) => new Set(prev).add(student.student_uuid));

            Swal.fire({
                icon: 'success',
                title: 'ส่งคำเชิญสำเร็จ',
                text: `ส่งคำเชิญไปยัง ${student.first_name} ${student.last_name} เรียบร้อยแล้ว`,
                timer: 2000,
                showConfirmButton: false,
                customClass: {
                    popup: 'dark:bg-gray-800 dark:text-white',
                    title: 'dark:text-white',
                    htmlContainer: 'dark:text-gray-300'
                }
            });

            onSuccess?.();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error instanceof Error ? error.message : 'ไม่สามารถส่งคำเชิญได้',
                customClass: {
                    popup: 'dark:bg-gray-800 dark:text-white',
                    title: 'dark:text-white',
                    htmlContainer: 'dark:text-gray-300'
                }
            });
        } finally {
            setIsInviting(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/50"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden transition-colors"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">เชิญสมาชิกใหม่</h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="p-5">
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="ค้นหานักศึกษาด้วยชื่อหรือรหัส..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 transition-all"
                            />
                            {isSearching && (
                                <FiLoader className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
                            )}
                        </div>
                    </div>

                    {/* Results */}
                    <div className="max-h-80 overflow-y-auto border-t border-gray-100 dark:border-gray-700 custom-scrollbar">
                        {query.length >= 2 && (
                            <>
                                {isSearching ? (
                                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                        <FiLoader className="w-6 h-6 animate-spin mx-auto mb-2" />
                                        กำลังค้นหา...
                                    </div>
                                ) : results.length > 0 ? (
                                    <ul>
                                        {results.map((student) => {
                                            const isInvited = invitedStudents.has(student.student_uuid);
                                            return (
                                                <li
                                                    key={student.student_uuid}
                                                    className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-50 dark:border-gray-700 last:border-0 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                                            <FiUser className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                                {student.first_name} {student.last_name}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                {student.student_code || student.student_id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {isInvited ? (
                                                        <span className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs rounded-lg">
                                                            <FiCheck className="w-4 h-4" />
                                                            ส่งแล้ว
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleInvite(student)}
                                                            disabled={isInviting}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors disabled:opacity-50"
                                                        >
                                                            {isInviting ? (
                                                                <FiLoader className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <FiPlus className="w-4 h-4" />
                                                            )}
                                                            เชิญ
                                                        </button>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                        ไม่พบนักศึกษาที่ค้นหา
                                    </div>
                                )}
                            </>
                        )}

                        {query.length < 2 && (
                            <div className="p-8 text-center text-gray-400 dark:text-gray-500">
                                <FiSearch className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">พิมพ์อย่างน้อย 2 ตัวอักษรเพื่อค้นหา</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        >
                            ปิด
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default InviteMemberModal;