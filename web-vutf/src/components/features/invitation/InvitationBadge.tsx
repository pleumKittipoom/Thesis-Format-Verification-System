// src/components/features/invitation/InvitationBadge.tsx
// Badge แสดงสถานะคำเชิญ

import React from 'react';
import { InvitationStatus } from '@/types/thesis';
import { FiClock, FiCheck, FiX } from 'react-icons/fi';

interface InvitationBadgeProps {
    /** สถานะคำเชิญ */
    status: InvitationStatus;
    /** ขนาดของ badge */
    size?: 'sm' | 'md' | 'lg';
}

/**
 * InvitationBadge - Badge แสดงสถานะคำเชิญ
 * * Single Responsibility: แสดงสถานะคำเชิญด้วย style ที่เหมาะสม
 * * Open/Closed: extend ได้ผ่าน props (size, status)
 * * Status colors:
 * - pending: yellow/orange
 * - approved: green
 * - rejected: red
 */
export const InvitationBadge: React.FC<InvitationBadgeProps> = ({
    status,
    size = 'md',
}) => {
    // Configuration ตาม status
    const statusConfig = {
        [InvitationStatus.PENDING]: {
            bgColor: 'bg-amber-100 dark:bg-amber-900/30',
            textColor: 'text-amber-700 dark:text-amber-300',
            borderColor: 'border-amber-200 dark:border-amber-800',
            icon: FiClock,
            label: 'รอตอบรับ',
        },
        [InvitationStatus.APPROVED]: {
            bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
            textColor: 'text-emerald-700 dark:text-emerald-300',
            borderColor: 'border-emerald-200 dark:border-emerald-800',
            icon: FiCheck,
            label: 'ตอบรับแล้ว',
        },
        [InvitationStatus.REJECTED]: {
            bgColor: 'bg-red-100 dark:bg-red-900/30',
            textColor: 'text-red-700 dark:text-red-300',
            borderColor: 'border-red-200 dark:border-red-800',
            icon: FiX,
            label: 'ปฏิเสธแล้ว',
        },
    };

    // Size configuration
    const sizeConfig = {
        sm: {
            padding: 'px-2 py-0.5',
            fontSize: 'text-[10px] sm:text-xs',
            iconSize: 'w-3 h-3',
            gap: 'gap-1',
        },
        md: {
            padding: 'px-2 py-0.5 sm:px-3 sm:py-1',
            fontSize: 'text-[10px] sm:text-sm',
            iconSize: 'w-3 h-3 sm:w-4 sm:h-4',
            gap: 'gap-1 sm:gap-1.5',
        },
        lg: {
            padding: 'px-3 py-1 sm:px-4 sm:py-1.5',
            fontSize: 'text-sm sm:text-base',
            iconSize: 'w-4 h-4 sm:w-5 sm:h-5',
            gap: 'gap-1.5 sm:gap-2',
        },
    };

    const config = statusConfig[status];
    const sizing = sizeConfig[size];
    const Icon = config.icon;

    return (
        <span
            className={`
        inline-flex items-center ${sizing.gap} ${sizing.padding}
        ${config.bgColor} ${config.textColor}
        border ${config.borderColor}
        rounded-full font-medium ${sizing.fontSize}
        transition-all duration-200
      `}
        >
            <Icon className={sizing.iconSize} />
            {config.label}
        </span>
    );
};

export default InvitationBadge;