// src/components/features/submission/ReviewRoundSection.tsx
import React from 'react';
import { FiClock, FiLoader, FiCheckCircle } from 'react-icons/fi';
import { SubmissionReviewCard } from './SubmissionReviewCard';
import { SubmissionStatus, type Submission } from '@/types/submission';
import { StudentReportData } from '@/types/report';

interface ReviewRoundSectionProps {
    /** ลำดับรอบ */
    roundNumber: number;
    /** ชื่อรอบ */
    roundTitle?: string;
    /** Submission ของรอบนี้ */
    submission: Submission;
    /** Report */
    reportFile?: StudentReportData | null;

    loadingAction?: string | null;

    /** Callback download original */
    onDownloadOriginal?: () => void;
    /** Callback preview original */
    onPreviewOriginal?: () => void;
    /** Callback download report */
    onDownloadReport?: () => void;
    /** Callback preview report */
    onPreviewReport?: () => void;
}

export const ReviewRoundSection: React.FC<ReviewRoundSectionProps> = ({
    roundNumber,
    roundTitle,
    submission,
    reportFile,
    loadingAction,
    onDownloadOriginal,
    onPreviewOriginal,
    onDownloadReport,
    onPreviewReport,
}) => {  
    /**
     * Get status config
     */
    const getStatusConfig = (status: SubmissionStatus) => {
        switch (status) {
            case SubmissionStatus.PENDING:
                return {
                    label: 'รอดำเนินการ',
                    icon: FiClock,
                    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
                    textColor: 'text-amber-700 dark:text-amber-300',
                    iconColor: 'text-amber-600 dark:text-amber-400',
                };
            case SubmissionStatus.IN_PROGRESS:
                return {
                    label: 'กำลังตรวจ',
                    icon: FiLoader,
                    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
                    textColor: 'text-blue-700 dark:text-blue-300',
                    iconColor: 'text-blue-600 dark:text-blue-400',
                };
            case SubmissionStatus.COMPLETED:
                return {
                    label: 'ตรวจเสร็จ',
                    icon: FiCheckCircle,
                    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
                    textColor: 'text-emerald-700 dark:text-emerald-300',
                    iconColor: 'text-emerald-600 dark:text-emerald-400',
                };
            default:
                return {
                    label: status,
                    icon: FiClock,
                    bgColor: 'bg-gray-100 dark:bg-gray-700',
                    textColor: 'text-gray-700 dark:text-gray-300',
                    iconColor: 'text-gray-600 dark:text-gray-400',
                };
        }
    };

    const statusConfig = getStatusConfig(submission.status);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="mb-8 last:mb-0">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {roundTitle
                        ? `รอบที่ ${roundNumber}: ${roundTitle}`
                        : `รอบที่ ${roundNumber}`
                    }
                </h3>
                <span className={`
                    inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium
                    ${statusConfig.bgColor} ${statusConfig.textColor}
                `}>
                    <StatusIcon className={`w-4 h-4 ${statusConfig.iconColor} ${submission.status === SubmissionStatus.IN_PROGRESS ? 'animate-spin' : ''}`} />
                    {statusConfig.label}
                </span>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original File Card */}
                <SubmissionReviewCard
                    type="original"
                    file={{
                        fileName: submission.fileName,
                        fileSize: submission.fileSize,
                        submittedAt: submission.submittedAt,
                    }}
                    onDownload={onDownloadOriginal}
                    onPreview={onPreviewOriginal}
                    // เช็คว่า Action ตรงกับของตัวเองไหม
                    isPreviewLoading={loadingAction === `preview_original_${submission.submissionId}`}
                    isDownloadLoading={loadingAction === `download_original_${submission.submissionId}`}
                    isDisabled={!!loadingAction}
                />

                {/* Report File Card */}
                <SubmissionReviewCard
                    type="report"
                    // ถ้ามี reportFile ส่งเข้ามา แสดงว่าอาจารย์ตรวจแล้ว
                    file={reportFile ? {
                        fileName: reportFile.file_name,
                        fileSize: reportFile.file_size,
                        submittedAt: reportFile.reported_at, // วันที่รายงานผล
                        verifiedAt: reportFile.reported_at,
                        comment: reportFile.comment
                    } : undefined}
                    
                    reviewerName={reportFile?.comment_by_name} 
                    status={reportFile?.review_status}
                    
                    onDownload={onDownloadReport}
                    onPreview={onPreviewReport}
                    
                    isPreviewLoading={loadingAction === `preview_report_${submission.submissionId}`}
                    isDownloadLoading={loadingAction === `download_report_${submission.submissionId}`}
                    isDisabled={!!loadingAction}
                />
            </div>
        </div>
    );
};

export default ReviewRoundSection;