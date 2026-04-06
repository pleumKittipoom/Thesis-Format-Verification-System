// src/components/features/submission/SubmissionStatusBadge.tsx
// Badge แสดงสถานะ Submission

import React from 'react';
import { FiClock, FiLoader, FiCheckCircle } from 'react-icons/fi';
import { SubmissionStatus, type SubmissionStatusBadgeProps } from '@/types/submission';

/**
 * SubmissionStatusBadge - Badge แสดงสถานะ Submission
 * * Single Responsibility: แสดงสถานะของ submission ด้วย badge
 * * Props:
 * - status: สถานะ (PENDING, IN_PROGRESS, COMPLETED)
 * - size: ขนาด (sm, md, lg)
 * - className: custom className
 */
export const SubmissionStatusBadge: React.FC<SubmissionStatusBadgeProps> = ({
    status,
    size = 'md',
    className = '',
}) => {
    // Configuration for each status
    const statusConfig = {
        [SubmissionStatus.PENDING]: {
            label: 'รอดำเนินการ',
            icon: FiClock,
            bgColor: 'bg-amber-100 dark:bg-amber-900/30',
            textColor: 'text-amber-700 dark:text-amber-300',
            iconColor: 'text-amber-600 dark:text-amber-400',
        },
        [SubmissionStatus.IN_PROGRESS]: {
            label: 'กำลังตรวจ',
            icon: FiLoader,
            bgColor: 'bg-blue-100 dark:bg-blue-900/30',
            textColor: 'text-blue-700 dark:text-blue-300',
            iconColor: 'text-blue-600 dark:text-blue-400',
        },
        [SubmissionStatus.COMPLETED]: {
            label: 'ตรวจเสร็จแล้ว',
            icon: FiCheckCircle,
            bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
            textColor: 'text-emerald-700 dark:text-emerald-300',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
        },
    };

    // Size configuration
    const sizeConfig = {
        sm: {
            padding: 'px-2 py-0.5',
            text: 'text-xs',
            icon: 'w-3 h-3',
            gap: 'gap-1',
        },
        md: {
            padding: 'px-2.5 py-1',
            text: 'text-sm',
            icon: 'w-4 h-4',
            gap: 'gap-1.5',
        },
        lg: {
            padding: 'px-3 py-1.5',
            text: 'text-base',
            icon: 'w-5 h-5',
            gap: 'gap-2',
        },
    };

    const config = statusConfig[status];
    const sizeStyle = sizeConfig[size];
    const Icon = config.icon;

    return (
        <span
            className={`
        inline-flex items-center ${sizeStyle.gap} ${sizeStyle.padding}
        ${config.bgColor} ${config.textColor} ${sizeStyle.text}
        font-medium rounded-full whitespace-nowrap
        ${className}
      `}
        >
            <Icon className={`${sizeStyle.icon} ${config.iconColor} ${status === SubmissionStatus.IN_PROGRESS ? 'animate-spin' : ''}`} />
            {config.label}
        </span>
    );
};

export default SubmissionStatusBadge;