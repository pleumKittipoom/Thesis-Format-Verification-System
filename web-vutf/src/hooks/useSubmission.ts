// src/hooks/useSubmission.ts
// Custom hook สำหรับจัดการ Submission operations

import { useState, useCallback } from 'react';
import { submissionService } from '@/services/submission.service';
import type { Submission } from '@/types/submission';
import { translateSubmissionError } from '@/types/submission';

/**
 * useSubmission Hook
 * 
 * Single Responsibility: จัดการ state และ operations สำหรับ file upload
 * 
 * Features:
 * - Submit file with loading state
 * - Error handling with Thai messages
 * - Upload progress tracking (future enhancement)
 */
export function useSubmission() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    /**
     * Submit file
     */
    const submitFile = useCallback(async (data: {
        file: File;
        inspectionId: number;
        groupId: string;
    }): Promise<Submission | null> => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await submissionService.createSubmission(data);
            setSuccess(true);
            return result;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'เกิดข้อผิดพลาดในการอัพโหลด';
            setError(translateSubmissionError(errorMessage));
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Reset state
     */
    const reset = useCallback(() => {
        setLoading(false);
        setError(null);
        setSuccess(false);
    }, []);

    return {
        submitFile,
        loading,
        error,
        success,
        reset,
    };
}

/**
 * useSubmissions Hook
 * 
 * Single Responsibility: Fetch และ manage submissions list
 */
export function useSubmissions(groupId: string | null, inspectionId?: number) {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch submissions by group
     */
    const fetchSubmissions = useCallback(async () => {
        if (!groupId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await submissionService.getByGroup(groupId);
            if (inspectionId) {
                const filteredData = data.filter((sub: Submission) => sub.inspectionId === inspectionId);
                setSubmissions(filteredData);
            } else {
                setSubmissions(data);
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
            setError(translateSubmissionError(errorMessage));
        } finally {
            setLoading(false);
        }
    }, [groupId, inspectionId]);

    /**
     * Download file
     * แก้ไข: รองรับ downloadUrl และบังคับโหลดไฟล์
     */
    const downloadFile = useCallback(async (submissionId: number) => {
        try {
            // 1. เรียก Service เพื่อขอ URL ล่าสุด (สดใหม่เสมอ)
            const res = await submissionService.getFileUrl(submissionId);
            
            // 2. เลือกใช้ downloadUrl ก่อน ถ้าไม่มีค่อยใช้ url ธรรมดา
            const targetUrl = res.downloadUrl || res.url;

            // 3. สร้าง Link ชั่วคราวเพื่อสั่งดาวน์โหลด
            const link = document.createElement('a');
            link.href = targetUrl;
            link.setAttribute('download', ''); // ใส่ attribute download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err: unknown) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'เกิดข้อผิดพลาดในการดาวน์โหลด';
            setError(translateSubmissionError(errorMessage));
        }
    }, []);

    /**
     * Refresh submissions
     */
    const refresh = useCallback(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    return {
        submissions,
        loading,
        error,
        fetchSubmissions,
        downloadFile,
        refresh,
    };
}
