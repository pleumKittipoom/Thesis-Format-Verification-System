// src/pages/student/InvitationsPage.tsx
// หน้าแสดงรายการคำเชิญ

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiInbox, FiLoader, FiRefreshCw } from 'react-icons/fi';
import { InvitationCard } from '@/components/features/invitation/InvitationCard';
import { groupMemberService } from '@/services/group-member.service';
import { InvitationCardData, InvitationStatus } from '@/types/thesis';
import { useTitle } from '@/hooks/useTitle';

type FilterType = 'all' | 'pending' | 'approved' | 'rejected';

/**
 * InvitationsPage - หน้าแสดงรายการคำเชิญ
 * * Route: /student/invitations
 * * Features:
 * - ดึงและแสดงรายการคำเชิญ
 * - Filter ตาม status
 * - Update UI หลัง accept/reject
 */
const InvitationsPage: React.FC = () => {
    useTitle('คำเชิญเข้าร่วมกลุ่ม');

    const [invitations, setInvitations] = useState<InvitationCardData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterType>('pending');

    /**
     * Fetch invitations
     */
    const fetchInvitations = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await groupMemberService.getMyInvitations();
            setInvitations(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchInvitations();
    }, [fetchInvitations]);

    /**
     * Handle action success - อัพเดท UI
     */
    const handleActionSuccess = (memberId: string, action: 'accept' | 'reject') => {
        setInvitations((prev) =>
            prev.map((inv) =>
                inv.member_id === memberId
                    ? {
                        ...inv,
                        invitation_status:
                            action === 'accept'
                                ? InvitationStatus.APPROVED
                                : InvitationStatus.REJECTED,
                    }
                    : inv
            )
        );
    };

    // Filter invitations
    const filteredInvitations = invitations.filter((inv) => {
        if (filter === 'all') return true;
        return inv.invitation_status === filter;
    });

    // Count by status
    const countByStatus = {
        all: invitations.length,
        pending: invitations.filter((i) => i.invitation_status === InvitationStatus.PENDING).length,
        approved: invitations.filter((i) => i.invitation_status === InvitationStatus.APPROVED).length,
        rejected: invitations.filter((i) => i.invitation_status === InvitationStatus.REJECTED).length,
    };

    // Filter buttons config
    const filterButtons: { key: FilterType; label: string; color: string }[] = [
        { key: 'all', label: 'ทั้งหมด', color: 'gray' },
        { key: 'pending', label: 'รอตอบรับ', color: 'amber' },
        { key: 'approved', label: 'ตอบรับแล้ว', color: 'emerald' },
        { key: 'rejected', label: 'ปฏิเสธแล้ว', color: 'red' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/30 transition-colors">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-8"
                >
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <span>หน้าหลัก</span>
                        <span>/</span>
                        <span className="text-blue-600 dark:text-blue-400 font-medium">คำเชิญ</span>
                    </div>

                    {/* Title */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-200 dark:shadow-none">
                                <FiMail className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    คำเชิญเข้าร่วมกลุ่ม
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">
                                    จัดการคำเชิญเข้าร่วมกลุ่มวิทยานิพนธ์
                                </p>
                            </div>
                        </div>

                        {/* Refresh Button */}
                        <button
                            onClick={fetchInvitations}
                            disabled={isLoading}
                            className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            <FiRefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </motion.div>

                {/* Filter Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="mb-6"
                >
                    <div className="flex items-center gap-2 p-1.5 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-x-auto transition-colors">
                        {filterButtons.map((btn) => (
                            <button
                                key={btn.key}
                                onClick={() => setFilter(btn.key)}
                                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap
                  transition-all duration-200
                  ${filter === btn.key
                                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    }
                `}
                            >
                                {btn.label}
                                <span className={`
                  px-1.5 py-0.5 text-xs rounded-full
                  ${filter === btn.key ? 'bg-gray-100 dark:bg-gray-700' : 'bg-gray-200/50 dark:bg-gray-600'}
                `}>
                                    {countByStatus[btn.key]}
                                </span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Content */}
                {isLoading ? (
                    // Loading State
                    <div className="flex flex-col items-center justify-center py-16">
                        <FiLoader className="w-10 h-10 text-blue-500 dark:text-blue-400 animate-spin mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">กำลังโหลดคำเชิญ...</p>
                    </div>
                ) : error ? (
                    // Error State
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4 transition-colors">
                            <FiMail className="w-8 h-8 text-red-500 dark:text-red-400" />
                        </div>
                        <p className="text-gray-900 dark:text-white font-medium mb-2">เกิดข้อผิดพลาด</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{error}</p>
                        <button
                            onClick={fetchInvitations}
                            className="px-4 py-2 bg-blue-600 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
                        >
                            ลองใหม่อีกครั้ง
                        </button>
                    </div>
                ) : filteredInvitations.length === 0 ? (
                    // Empty State
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-16"
                    >
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700/50 rounded-full flex items-center justify-center mb-4 transition-colors">
                            <FiInbox className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                        </div>
                        <p className="text-gray-900 dark:text-white font-medium mb-2">ไม่มีคำเชิญ</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {filter === 'all'
                                ? 'คุณยังไม่มีคำเชิญเข้าร่วมกลุ่มวิทยานิพนธ์'
                                : `ไม่มีคำเชิญในหมวด "${filterButtons.find((b) => b.key === filter)?.label}"`
                            }
                        </p>
                    </motion.div>
                ) : (
                    // Invitation List
                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {filteredInvitations.map((invitation) => (
                                <InvitationCard
                                    key={invitation.member_id}
                                    invitation={invitation}
                                    onActionSuccess={handleActionSuccess}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvitationsPage;