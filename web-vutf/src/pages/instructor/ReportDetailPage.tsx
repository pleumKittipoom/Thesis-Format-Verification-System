// src/pages/instructor/ReportDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import { reportService } from '@/services/report.service';
import { ReportDetail } from '@/types/report-detail';
import { ReviewStatus, ReportData } from '@/types/report';

// Components
import { ReportHeaderCard } from '@/components/features/instructor/report-detail/ReportHeaderCard';
import { SubmissionFileCard } from '@/components/features/instructor/submission-detail/SubmissionFileCard';
import { SubmissionCommentCard } from '@/components/features/instructor/submission-detail/SubmissionCommentCard';
import { GroupMembersCard } from '@/components/features/instructor/submission-detail/GroupMembersCard';
import { AdvisorCard } from '@/components/features/instructor/submission-detail/AdvisorCard';
import { ReportActionCard } from '@/components/features/instructor/report-detail/ReportActionCard';
import { ReportTimeline } from '@/components/features/instructor/report-detail/ReportTimeline';

import { toast } from '@/utils/swal';

export const ReportDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState<ReportDetail | null>(null);
    const [history, setHistory] = useState<ReportData[]>([]);
    const [loading, setLoading] = useState(true);

    // Effect หลัก: โหลดข้อมูล Report ปัจจุบันเมื่อ ID เปลี่ยน
    useEffect(() => {
        if (id) fetchDetail(Number(id));
    }, [id]);

    const fetchDetail = async (reportId: number, isSilent = false) => {
        try {

            if (!isSilent) {
                setLoading(true);
            }

            const res = await reportService.getOne(reportId);
            const responseData = (res as any).data || res;
            const currentReport = responseData as unknown as ReportDetail;

            setData(currentReport);

            const submissionId = (currentReport as any).context?.submissionId || (currentReport as any).submissionId;
            if (submissionId) {
                fetchHistory(submissionId);
            }

        } catch (error) {
            console.error(error);
            if (!isSilent) {
                toast.fire({ icon: 'error', title: 'ไม่สามารถโหลดข้อมูลรายงานได้' });
                navigate(-1);
            }
        } finally {
            if (!isSilent) {
                setLoading(false);
            }
        }
    };

    // ฟังก์ชันดึงประวัติ
    const fetchHistory = async (submissionId: number) => {
        try {
            const historyRes = await reportService.getBySubmissionId(submissionId);
            const historyData = (historyRes as any).data || historyRes; // Handle wrapper if needed
            setHistory(historyData);
        } catch (error) {
            console.error("Failed to fetch history", error);
        }
    };

    const handleUpdateStatus = async (status: ReviewStatus) => {
        if (!data) return;
        try {
            await reportService.submitReview(data.id, { reviewStatus: status });
            setData(prev => prev ? { ...prev, reviewStatus: status } : null);

            // อัปเดตใน History ด้วย (เพื่อให้สีจุดเปลี่ยนทันที)
            setHistory(prev => prev.map(h => h.id === data.id ? { ...h, reviewStatus: status } : h));

            toast.fire({ icon: 'success', title: 'อัปเดตสถานะเรียบร้อย' });
        } catch (error) {
            console.error(error);
            toast.fire({ icon: 'error', title: 'เกิดข้อผิดพลาดในการอัปเดต' });
        }
    };

    const handleSaveComment = async (newComment: string) => {
        if (!data) return;
        try {
            await reportService.submitReview(data.id, {
                reviewStatus: data.reviewStatus,
                comment: newComment
            });
            setData(prev => prev ? { ...prev, comment: newComment } : null);
        } catch (error) {
            console.error(error);
            toast.fire({ icon: 'error', title: 'บันทึกคอมเมนต์ไม่สำเร็จ' });
            throw error;
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">กำลังโหลดข้อมูล...</div>;
    if (!data) return null;

    const rawType = data.file?.type || 'pdf';
    const safeMimeType = rawType.includes('/') ? rawType : `application/${rawType}`;

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">

            <button
                onClick={() => navigate('/instructor/report')}
                className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 mb-6 transition-colors font-medium"
            >
                <FiArrowLeft /> กลับไปหน้ารายการ
            </button>

            {/* แสดง Timeline Card ไว้บนสุด */}
            {history.length > 0 && (
                <div className="animate-enter-down">
                    <ReportTimeline reports={history} currentReportId={data.id} />
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6 animate-enter-up">

                {/* === Left Column === */}
                <div className="flex-1 space-y-6">
                    <ReportHeaderCard
                        data={data}
                        onStatusUpdate={() => {
                            if (id) fetchDetail(Number(id));
                        }}
                    />

                    {data.file ? (
                        <SubmissionFileCard
                            reportId={data.id}
                            title="เอกสารรายงานผลการตรวจสอบ (Verification Report)"
                            fileName={data.file.name || 'Unknown Filename'}
                            fileSize={data.file.size || 0}
                            fileUrl={data.file.url || '#'}
                            downloadUrl={data.file.downloadUrl || '#'}
                            mimeType={safeMimeType}
                            csv={data.csv}
                            originalFile={data.originalFile}
                            onReportUpdate={() => {
                                if (id) fetchDetail(Number(id), true);
                            }}
                        />
                    ) : (
                        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 flex items-center gap-3 text-red-600 dark:text-red-400">
                            <FiAlertCircle size={24} />
                            <div>
                                <p className="font-semibold">ไม่พบไฟล์รายงาน</p>
                                <p className="text-sm opacity-80">ข้อมูลไฟล์อาจไม่สมบูรณ์ หรือเกิดข้อผิดพลาดจากระบบ</p>
                            </div>
                        </div>
                    )}

                    <SubmissionCommentCard
                        comment={data.comment}
                        onSave={handleSaveComment}
                    />
                </div>

                {/* === Right Column === */}
                <div className="w-full lg:w-[360px] space-y-6">
                    <ReportActionCard
                        currentStatus={data.reviewStatus}
                        onUpdateStatus={handleUpdateStatus}
                    />

                    <GroupMembersCard members={data.groupMembers || []} />
                    <AdvisorCard advisors={data.advisors || []} />
                </div>

            </div>
        </div>
    );
};