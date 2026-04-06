// src/components/features/group/GroupDetailModal.tsx
// Modal แสดงรายละเอียดกลุ่มวิทยานิพนธ์

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiX, FiFileText, FiUsers, FiUser, FiAward,
    FiCheck, FiClock, FiXCircle, FiUserPlus
} from 'react-icons/fi';
import {
    ThesisGroup,
    GroupMemberRole,
    InvitationStatus,
    AdvisorRole,
} from '@/types/thesis';
import { InviteMemberModal } from './InviteMemberModal';

interface GroupDetailModalProps {
    /** กลุ่มที่จะแสดง */
    group: ThesisGroup | null;
    /** ปิด Modal */
    onClose: () => void;
    /** เป็น owner หรือไม่ */
    isOwner: boolean;
    /** Callback เมื่อเชิญสมาชิกสำเร็จ */
    onMemberInvited?: () => void;
}

/**
 * GroupDetailModal - Modal แสดงรายละเอียดกลุ่ม
 * * Features:
 * - แสดงข้อมูลวิทยานิพนธ์
 * - แสดงรายการสมาชิกพร้อมสถานะ
 * - แสดงอาจารย์ที่ปรึกษา
 * - ปุ่มเชิญสมาชิก (สำหรับ owner)
 */
export const GroupDetailModal: React.FC<GroupDetailModalProps> = ({
    group,
    onClose,
    isOwner,
    onMemberInvited,
}) => {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    if (!group) return null;

    const { thesis, members, advisor } = group;

    // Get main advisor
    const mainAdvisor = advisor?.find((a) => a.role === AdvisorRole.MAIN);
    const coAdvisors = advisor?.filter((a) => a.role === AdvisorRole.CO) || [];

    // Get owner
    const owner = members?.find((m) => m.role === GroupMemberRole.OWNER);
    const otherMembers = members?.filter((m) => m.role === GroupMemberRole.MEMBER) || [];

    // Status badge
    const getStatusBadge = (status: InvitationStatus | string) => {
        switch (status) {
            case InvitationStatus.APPROVED:
            case 'approved':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs rounded-full">
                        <FiCheck className="w-3 h-3" />
                        ตอบรับแล้ว
                    </span>
                );
            case InvitationStatus.PENDING:
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs rounded-full">
                        <FiClock className="w-3 h-3" />
                        รอตอบรับ
                    </span>
                );
            case InvitationStatus.REJECTED:
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-full">
                        <FiXCircle className="w-3 h-3" />
                        ปฏิเสธ
                    </span>
                );
            default:
                return null;
        }
    };

    const handleInviteSuccess = () => {
        setIsInviteModalOpen(false);
        onMemberInvited?.();
    };

    return (
        <>
            <AnimatePresence>
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col transition-colors"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none">
                                    <FiFileText className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {thesis?.thesis_name_th || 'ไม่มีชื่อ'}
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                        {thesis?.thesis_name_en || '-'}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded">
                                            {thesis?.thesis_code || '-'}
                                        </span>
                                        {thesis?.graduation_year && (
                                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                                ปี {thesis.graduation_year}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                            {/* Members Section */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <FiUsers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                        <h3 className="font-semibold text-gray-900 dark:text-white">สมาชิกกลุ่ม</h3>
                                        <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs rounded-full">
                                            {members?.length || 0} คน
                                        </span>
                                    </div>
                                    {isOwner && (
                                        <button
                                            onClick={() => setIsInviteModalOpen(true)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <FiUserPlus className="w-4 h-4" />
                                            เชิญสมาชิก
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    {/* Owner */}
                                    {owner && (
                                        <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/30">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center">
                                                    <FiUser className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {owner.student?.prefix_name || ''} {owner.student?.first_name} {owner.student?.last_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {owner.student?.student_code || owner.student_uuid}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="px-2 py-1 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-xs font-medium rounded-full">
                                                เจ้าของกลุ่ม
                                            </span>
                                        </div>
                                    )}

                                    {/* Other Members */}
                                    {otherMembers.map((member) => (
                                        <div
                                            key={member.member_id}
                                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                                    <FiUser className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {member.student?.prefix_name || ''} {member.student?.first_name} {member.student?.last_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {member.student?.student_code || member.student_uuid}
                                                    </p>
                                                </div>
                                            </div>
                                            {getStatusBadge(member.invitation_status)}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Advisors Section */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <FiAward className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    <h3 className="font-semibold text-gray-900 dark:text-white">อาจารย์ที่ปรึกษา</h3>
                                </div>

                                <div className="space-y-2">
                                    {mainAdvisor && (
                                        <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800/30">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center">
                                                    <FiAward className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {mainAdvisor.instructor?.first_name} {mainAdvisor.instructor?.last_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {mainAdvisor.instructor?.instructor_code}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="px-2 py-1 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-xs font-medium rounded-full">
                                                ที่ปรึกษาหลัก
                                            </span>
                                        </div>
                                    )}

                                    {coAdvisors.map((adv) => (
                                        <div
                                            key={adv.advisor_id}
                                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                                    <FiUser className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {adv.instructor?.first_name} {adv.instructor?.last_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {adv.instructor?.instructor_code}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
                                                ที่ปรึกษาร่วม
                                            </span>
                                        </div>
                                    ))}

                                    {!mainAdvisor && coAdvisors.length === 0 && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                            ยังไม่มีอาจารย์ที่ปรึกษา
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
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

            {/* Invite Member Modal */}
            {isInviteModalOpen && group && (
                <InviteMemberModal
                    groupId={group.group_id}
                    onClose={() => setIsInviteModalOpen(false)}
                    onSuccess={handleInviteSuccess}
                />
            )}
        </>
    );
};

export default GroupDetailModal;