// src/components/features/instructor/report/ReportStatusBadge.tsx
import React from 'react';

interface Props {
    type: 'verification' | 'review';
    status: string;
}

export const ReportStatusBadge: React.FC<Props> = ({ type, status }) => {

    // Logic สำหรับ System Verification (Pass/Fail)
    if (type === 'verification') {
        const isPass = status === 'PASS';
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
        ${isPass
                    ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                    : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isPass ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {isPass ? 'ผ่านเกณฑ์' : 'ไม่ผ่านเกณฑ์'}
            </span>
        );
    }

    // Logic สำหรับ Instructor Review
    const getReviewStyle = (s: string) => {
        switch (s) {
            case 'PASSED': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300';
            case 'NOT_PASSED': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300';
            case 'NEEDS_REVISION': return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300';
            default: return 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400';
        }
    };

    const getReviewLabel = (s: string) => {
        switch (s) {
            case 'PASSED': return 'อนุมัติแล้ว';
            case 'NOT_PASSED': return 'ไม่อนุมัติ';
            case 'NEEDS_REVISION': return 'ต้องแก้ไข';
            default: return 'รอดำเนินการ';
        }
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium border ${getReviewStyle(status)}`}>
            {getReviewLabel(status)}
        </span>
    );
};