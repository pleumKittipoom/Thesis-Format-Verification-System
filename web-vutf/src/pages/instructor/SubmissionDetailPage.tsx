// src/pages/instructor/SubmissionDetailPage.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { submissionService } from '../../services/submission.service';
import { SubmissionDetail } from '../../types/submission';

// Components
import { SubmissionHeaderCard } from '../../components/features/instructor/submission-detail/SubmissionHeaderCard';
import { SubmissionFileCard } from '../../components/features/instructor/submission-detail/SubmissionFileCard';
import { SubmissionCommentCard } from '../../components/features/instructor/submission-detail/SubmissionCommentCard';
import { GroupMembersCard } from '../../components/features/instructor/submission-detail/GroupMembersCard';
import { ActionCard } from '../../components/features/instructor/submission-detail/ActionCard';
import { AdvisorCard } from '../../components/features/instructor/submission-detail/AdvisorCard';

import { toast } from '@/utils/swal';

export const SubmissionDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<SubmissionDetail | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Ref สำหรับเก็บ Interval เพื่อจัดการ Polling
    const pollingInterval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (id) fetchDetail(Number(id));

        // Cleanup: หยุด Polling เมื่อออกจากหน้า
        return () => stopPolling();
    }, [id]);

    // Logic Polling: ถ้าสถานะเป็น IN_PROGRESS ให้เช็คใหม่เรื่อยๆ
    useEffect(() => {
        if (data?.status === 'IN_PROGRESS') {
            startPolling(data.submissionId);
        } else {
            stopPolling();
        }
    }, [data?.status]); // run เมื่อ status เปลี่ยน

    const startPolling = (submissionId: number) => {
        if (pollingInterval.current) return; // ถ้า Poll อยู่แล้วไม่ต้องเริ่มใหม่

        // เช็คสถานะทุกๆ 3 วินาที
        pollingInterval.current = setInterval(() => {
            fetchDetail(submissionId, true);
        }, 3000);
    };

    const stopPolling = () => {
        if (pollingInterval.current) {
            clearInterval(pollingInterval.current);
            pollingInterval.current = null;
        }
    };

    const fetchDetail = async (submissionId: number, isPolling = false) => {
        try {
            if (!isPolling) setLoading(true); // ถ้าไม่ใช่ Polling ให้ขึ้น Loading ใหญ่
            const res = await submissionService.getById(submissionId);
            
            // ถ้าเป็น Polling ให้เช็คว่าค่าเปลี่ยนไหมค่อย set (เพื่อ performance)
            if (isPolling) {
                setData(prev => {
                    // ถ้าสถานะเปลี่ยนจาก IN_PROGRESS -> อย่างอื่น ให้หยุด Poll ทันที
                    if (prev?.status === 'IN_PROGRESS' && res.status !== 'IN_PROGRESS') {
                        stopPolling();
                        toast.fire({ icon: 'success', title: 'การตรวจสอบเสร็จสิ้น' });
                    }
                    return res;
                });
            } else {
                setData(res);
            }

        } catch (error) {
            console.error(error);
            if (!isPolling) {
                toast.fire({
                    icon: 'error',
                    title: 'ไม่สามารถโหลดข้อมูลได้ หรือข้อมูลไม่ถูกต้อง'
                });
                navigate(-1);
            }
        } finally {
            if (!isPolling) setLoading(false);
        }
    };

    const handleSaveComment = async (newComment: string) => {
        if (!data) return;
        try {
            await submissionService.updateComment(data.submissionId, newComment);
            setData(prev => prev ? { ...prev, comment: newComment } : null);
            toast.fire({
                icon: 'success',
                title: 'บันทึกคอมเมนต์เรียบร้อย'
            });
        } catch (error) {
            toast.fire({
                icon: 'error',
                title: 'บันทึกคอมเมนต์ไม่สำเร็จ'
            });
            throw error;
        }
    };

    const handleVerifySubmission = async (submissionId: number) => {
        try {
            await submissionService.verify(submissionId); 
            
            toast.fire({
                icon: 'success',
                title: 'ส่งตรวจสอบเรียบร้อยแล้ว',
                text: 'ระบบกำลังดำเนินการตรวจสอบไฟล์'
            });
            
            // Reload ข้อมูลทันที เพื่อให้ status เปลี่ยนเป็น IN_PROGRESS และเริ่ม Polling
            fetchDetail(submissionId); 
        } catch (error) {
            console.error(error);
            toast.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถส่งตรวจสอบได้'
            });
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500 dark:text-gray-400">กำลังโหลดข้อมูล...</div>;
    if (!data) return null;

    const rawType = data.mimeType || 'pdf';
    const safeMimeType = rawType.includes('/') ? rawType : `application/${rawType}`;

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">

            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 mb-6 transition-colors font-medium"
            >
                <FiArrowLeft /> ย้อนกลับ
            </button>

            <div className="flex flex-col lg:flex-row gap-6">

                {/* === Left Column === */}
                <div className="flex-1 space-y-6">
                    <SubmissionHeaderCard data={data} />

                    <SubmissionFileCard
                        fileName={data.fileName}
                        fileSize={data.fileSize}
                        fileUrl={data.fileUrl}
                        downloadUrl={data.downloadUrl || data.fileUrl}
                        mimeType={safeMimeType} 
                    />

                    <SubmissionCommentCard
                        comment={data.comment}
                        onSave={handleSaveComment}
                    />
                </div>

                {/* === Right Column === */}
                <div className="w-full lg:w-[360px] space-y-6">
                    <GroupMembersCard members={data.groupMembers} />
                    <AdvisorCard advisors={data.advisors} />
                    
                    <ActionCard 
                        status={data.status} 
                        submissionId={data.submissionId}
                        onVerify={handleVerifySubmission}
                    />
                </div>

            </div>
        </div>
    );
};