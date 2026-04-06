// src/components/features/invitation/InvitationCard.tsx
// การ์ดแสดงคำเชิญ

import React from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiUser, FiUsers, FiAward, FiCalendar } from 'react-icons/fi';
import { InvitationBadge } from './InvitationBadge';
import { InvitationActions } from './InvitationActions';
import {
    InvitationCardData,
    InvitationStatus,
    AdvisorRole,
    GroupMemberRole,
} from '@/types/thesis';

interface InvitationCardProps {
    /** ข้อมูลคำเชิญ */
    invitation: InvitationCardData;
    /** Callback เมื่อ action สำเร็จ */
    onActionSuccess?: (memberId: string, action: 'accept' | 'reject') => void;
    /** แสดง animation หรือไม่ */
    animated?: boolean;
}

/**
 * InvitationCard - การ์ดแสดงคำเชิญ
 * * Composition: ใช้ InvitationBadge และ InvitationActions
 * * Single Responsibility: แสดงข้อมูลคำเชิญและจัด layout
 * * Features:
 * - แสดงชื่อวิทยานิพนธ์
 * - แสดงผู้เชิญ (Owner)
 * - แสดงสมาชิกอื่นๆ
 * - แสดงอาจารย์ที่ปรึกษา
 * - วันที่ถูกเชิญ
 * - ปุ่ม Accept/Reject (เฉพาะ status = pending)
 */
export const InvitationCard: React.FC<InvitationCardProps> = ({
    invitation,
    onActionSuccess,
    animated = true,
}) => {
    const {
        member_id,
        invitation_status,
        invited_at,
        thesis,
        owner,
        members,
        advisors,
    } = invitation;

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Get main advisor (with defensive check)
    const mainAdvisor = advisors?.find((a) => a.role === AdvisorRole.MAIN);
    const coAdvisors = advisors?.filter((a) => a.role === AdvisorRole.CO) || [];

    // Get other members (excluding owner) - with defensive check
    const otherMembers = members?.filter((m) => m.role === GroupMemberRole.MEMBER) || [];

    const CardWrapper = animated ? motion.div : 'div';
    const animationProps = animated
        ? {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
            transition: { duration: 0.3 },
            layout: true,
        }
        : {};

    return (
        <CardWrapper
            {...animationProps}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
        >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-gray-50 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                        {/* Icon */}
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none flex-shrink-0">
                            <FiFileText className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                        </div>

                        {/* Thesis Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate leading-tight">
                                {thesis?.thesis_name_th || 'ไม่มีชื่อวิทยานิพนธ์'}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                                {thesis?.thesis_name_en || '-'}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] sm:text-xs font-medium rounded">
                                    {thesis?.thesis_code || '-'}
                                </span>
                                {thesis?.graduation_year && (
                                    <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
                                        ปี {thesis.graduation_year}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Invitation Badge */}
                    <div className="flex sm:block justify-end shrink-0">
                        <InvitationBadge status={invitation_status} size="md" />
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
                {/* Invited By (Owner) */}
                {owner && (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                            <FiUser className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">ผู้เชิญ</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {owner.first_name} {owner.last_name}
                            </p>
                        </div>
                    </div>
                )}

                {/* Other Members */}
                {otherMembers.length > 0 && (
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <FiUsers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">สมาชิกอื่น</p>
                            <div className="flex flex-wrap gap-1.5">
                                {otherMembers.slice(0, 3).map((m) => (
                                    <span
                                        key={m.member_id}
                                        className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-xs rounded-full"
                                    >
                                        {m.student?.first_name} {m.student?.last_name}
                                    </span>
                                ))}
                                {otherMembers.length > 3 && (
                                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full">
                                        +{otherMembers.length - 3} คน
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Invited At */}
                <div className="flex items-center gap-3 pt-2 border-t border-gray-50 dark:border-gray-700">
                    <FiCalendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        ได้รับเชิญเมื่อ {formatDate(invited_at)}
                    </span>
                </div>
            </div>

            {/* Actions (only for pending) */}
            {invitation_status === InvitationStatus.PENDING && (
                <div className="px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
                    <InvitationActions
                        memberId={member_id}
                        onSuccess={(action) => onActionSuccess?.(member_id, action)}
                        size="md"
                    />
                </div>
            )}
        </CardWrapper>
    );
};

export default InvitationCard;