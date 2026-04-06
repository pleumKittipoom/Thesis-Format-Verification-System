// src/pages/student/GroupSubmissionPage.tsx
// หน้าส่งไฟล์ Submission สำหรับ Inspection Round

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiArrowLeft,
    FiLoader,
    FiUploadCloud,
    FiFileText,
    FiCalendar,
    FiClipboard,
    FiAlertCircle
} from 'react-icons/fi';
import { useTitle } from '@/hooks/useTitle';
import { useAuth } from '@/contexts/AuthContext';
import { thesisGroupService } from '@/services/thesis-group.service';
import { inspectionService } from '@/services/inspection.service';
import { ThesisGroup, GroupMemberRole } from '@/types/thesis';
import { InspectionRound } from '@/types/inspection';

// Components
import {
    SubmissionUploadForm,
    SubmissionList
} from '@/components/features/submission';

/**
 * GroupSubmissionPage - หน้าส่งไฟล์ Submission
 * * Single Responsibility: จัดการ UI สำหรับส่งไฟล์ตาม Inspection Round
 * * Features:
 * - แสดงรอบตรวจที่เปิดอยู่ (Active Inspection Round)
 * - ปุ่มส่งไฟล์ (แสดงเฉพาะ OWNER)
 * - แสดง submission history
 * - Download ไฟล์ที่ส่งแล้ว
 */
const GroupSubmissionPage: React.FC = () => {
    useTitle('ส่งไฟล์ตรวจความก้าวหน้า');
    const { groupId } = useParams<{ groupId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [group, setGroup] = useState<ThesisGroup | null>(null);
    const [activeRound, setActiveRound] = useState<InspectionRound | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [roundError, setRoundError] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    /**
     * Fetch group data
     */
    const fetchGroup = useCallback(async () => {
        if (!groupId) return;
        try {
            const data = await thesisGroupService.getThesisGroupById(groupId);
            setGroup(data);
        } catch (error) {
            console.error('Error fetching group:', error);
            navigate('/student/group-management');
        }
    }, [groupId, navigate]);

    /**
     * Fetch active inspection round
     */
    const fetchActiveRound = useCallback(async () => {
        try {
            const data = await inspectionService.getActiveRound();
            setActiveRound(data);
            setRoundError(null);
        } catch (error) {
            console.error('Error fetching active round:', error);
            setRoundError('ไม่มีรอบตรวจที่เปิดรับไฟล์ในขณะนี้');
            setActiveRound(null);
        }
    }, []);

    /**
     * Load initial data
     */
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await Promise.all([fetchGroup(), fetchActiveRound()]);
            setIsLoading(false);
        };
        loadData();
    }, [fetchGroup, fetchActiveRound]);

    // Check if current user is owner
    const creatorId = typeof group?.created_by === 'object'
        ? group.created_by?.user_uuid
        : group?.created_by;
    const isOwner = group?.members.some(
        m => m.student_uuid === user?.id && m.role?.toLowerCase() === GroupMemberRole.OWNER.toLowerCase()
    ) || (creatorId === user?.id) || false;

    /**
     * Check if submission is allowed
     */
    const isSubmissionAllowed = useCallback(() => {
        if (!activeRound) return false;
        if (activeRound.status !== 'OPEN' || !activeRound.isActive) return false;

        const now = new Date();
        const start = new Date(activeRound.startDate);
        const end = new Date(activeRound.endDate);

        return now >= start && now <= end;
    }, [activeRound]);

    /**
     * Get submission status message
     */
    const getSubmissionStatusMessage = useCallback((): { type: 'info' | 'success' | 'warning' | 'error'; message: string } | null => {
        if (!activeRound) {
            return { type: 'info', message: 'ไม่มีรอบตรวจที่เปิดรับไฟล์ในขณะนี้' };
        }

        const now = new Date();
        const start = new Date(activeRound.startDate);
        const end = new Date(activeRound.endDate);

        if (now < start) {
            return {
                type: 'warning',
                message: `รอบตรวจจะเปิดรับไฟล์ในวันที่ ${formatDate(activeRound.startDate)}`
            };
        }

        if (now > end) {
            return { type: 'error', message: 'หมดเวลาส่งไฟล์แล้ว' };
        }

        if (!isOwner) {
            return { type: 'info', message: 'เฉพาะหัวหน้ากลุ่มเท่านั้นที่สามารถส่งไฟล์ได้' };
        }

        return { type: 'success', message: 'สามารถส่งไฟล์ได้' };
    }, [activeRound, isOwner]);

    /**
     * Format date to Thai
     */
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    /**
     * Handle upload success
     */
    const handleUploadSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
                <FiLoader className="w-10 h-10 text-blue-500 dark:text-blue-400 animate-spin" />
            </div>
        );
    }

    if (!group || !groupId) return null;

    const submissionStatus = getSubmissionStatusMessage();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/30 transition-colors">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors"
                >
                    <FiArrowLeft /> ย้อนกลับ
                </button>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <FiUploadCloud className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                        ส่งไฟล์ตรวจความก้าวหน้า
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        โครงงาน: {group.thesis.thesis_name_th || 'ไม่มีชื่อ'}
                    </p>
                </div>

                {/* Active Inspection Round Info */}
                {activeRound && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6 transition-colors"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none flex-shrink-0">
                                <FiClipboard className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {activeRound.title}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {activeRound.description || `รอบที่ ${activeRound.roundNumber} - ${activeRound.term}/${activeRound.academicYear}`}
                                </p>

                                <div className="flex flex-wrap gap-4 mt-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                        <FiCalendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                        <span>เริ่ม: {formatDate(activeRound.startDate)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                        <FiCalendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                        <span>สิ้นสุด: {formatDate(activeRound.endDate)}</span>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className="mt-4">
                                    <span className={`
                    inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                    ${activeRound.status === 'OPEN' && activeRound.isActive
                                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                        }
                  `}>
                                        {activeRound.status === 'OPEN' && activeRound.isActive ? 'เปิดรับไฟล์' : 'ปิดรับไฟล์'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* No Active Round Message */}
                {roundError && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 px-5 py-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl mb-6 transition-colors"
                    >
                        <FiAlertCircle className="w-5 h-5 text-amber-500 dark:text-amber-400 flex-shrink-0" />
                        <p className="text-amber-700 dark:text-amber-300">{roundError}</p>
                    </motion.div>
                )}

                {/* Status Message */}
                {submissionStatus && submissionStatus.type !== 'success' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`
              flex items-center gap-3 px-5 py-4 rounded-xl mb-6 transition-colors
              ${submissionStatus.type === 'info' ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800' : ''}
              ${submissionStatus.type === 'warning' ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800' : ''}
              ${submissionStatus.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800' : ''}
            `}
                    >
                        <FiAlertCircle className={`w-5 h-5 flex-shrink-0
              ${submissionStatus.type === 'info' ? 'text-blue-500 dark:text-blue-400' : ''}
              ${submissionStatus.type === 'warning' ? 'text-amber-500 dark:text-amber-400' : ''}
              ${submissionStatus.type === 'error' ? 'text-red-500 dark:text-red-400' : ''}
            `} />
                        <p className={`
              ${submissionStatus.type === 'info' ? 'text-blue-700 dark:text-blue-300' : ''}
              ${submissionStatus.type === 'warning' ? 'text-amber-700 dark:text-amber-300' : ''}
              ${submissionStatus.type === 'error' ? 'text-red-700 dark:text-red-300' : ''}
            `}>{submissionStatus.message}</p>
                    </motion.div>
                )}

                {/* Upload Form (Owner only when allowed) */}
                {isOwner && isSubmissionAllowed() && activeRound && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6 transition-colors"
                    >
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                            <FiUploadCloud className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                            ส่งไฟล์
                        </h3>
                        <SubmissionUploadForm
                            groupId={groupId}
                            inspectionId={activeRound.inspectionId}
                            onSuccess={handleUploadSuccess}
                        />
                    </motion.div>
                )}

                {/* Submission History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors"
                >
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                        <FiFileText className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                        ประวัติการส่งไฟล์
                    </h3>
                    <SubmissionList
                        groupId={groupId}
                        refreshTrigger={refreshTrigger}
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default GroupSubmissionPage;