// src/services/submission.service.ts
// Service สำหรับจัดการ Submission API

import { api } from './api';
import { Submission, SubmissionFileUrl, SubmissionResponse, SubmissionFilterParams, SubmissionDetail, } from '../types/submission';

/**
 * Submission Service
 * 
 * Single Responsibility: จัดการ API calls สำหรับ Submission
 * 
 * Methods:
 * - createSubmission: ส่งไฟล์ (OWNER only)
 * - getByGroup: ดู submissions ของกลุ่ม
 * - getById: ดู submission by ID
 * - getFileUrl: Get download URL (presigned)
 */
export const submissionService = {
    /**
     * ส่งไฟล์ Submission (OWNER only)
     * 
     * @param data - ข้อมูลสำหรับสร้าง submission
     * @returns Promise<Submission>
     */
    async createSubmission(data: {
        file: File;
        inspectionId: number;
        groupId: string;
    }): Promise<Submission> {
        const formData = new FormData();
        formData.append('file', data.file);
        formData.append('inspectionId', String(data.inspectionId));
        formData.append('groupId', data.groupId);

        return api.postFormData<Submission>('/submissions', formData);
    },

    /**
     * ดู submissions ของกลุ่ม
     * 
     * @param groupId - ID ของกลุ่ม
     * @returns Promise<Submission[]>
     */
    async getByGroup(groupId: string): Promise<Submission[]> {
        const response = await api.get<{ data: Submission[] }>(`/submissions/group/${groupId}`);
        return response.data || [];
    },

    /**
     * ดู submission by ID
     * 
     * @param id - Submission ID
     * @returns Promise<Submission>
     */
    async getById(id: number): Promise<SubmissionDetail> {
        const response = await api.get<{ data: SubmissionDetail }>(`/submissions/${id}`);
        return response.data;
    },

    /**
     * Get download URL (presigned)
     * URL มีอายุ 1 ชั่วโมง
     * 
     * @param id - Submission ID
     * @returns Promise<SubmissionFileUrl>
     */
    async getFileUrl(id: number): Promise<SubmissionFileUrl> {
        const response = await api.post<SubmissionFileUrl>(`/submissions/${id}/file`, {});
        return response.data;
    },

    /**
       * ดึงข้อมูล Submission ทั้งหมด (รองรับ Filter & Pagination)
       */
    getAll: async (params: SubmissionFilterParams): Promise<SubmissionResponse> => {
        return api.get<SubmissionResponse>('/submissions', params);
    },

    /**
      * อัปเดตคอมเมนต์ (ไม่ต้องเปลี่ยนสถานะ)
      */
    async updateComment(id: number, comment: string) {
        return api.patch(`/submissions/${id}/comment`, { comment });
    },

    /**
     * ส่งคำร้องขอตรวจสอบ (Verification)
     */
    verify: async (id: number) => {
        return api.post('/report-file/verify-batch', { submissionIds: [id] });
    },

    /**
     * ส่งคำร้องขอตรวจสอบหลายรายการ (Batch Verification)
     */
    verifyBatch: async (submissionIds: number[]) => {
        return api.post('/report-file/verify-batch', { submissionIds });
    },

    /**
     * Get status summary for polling (lightweight)
     * Returns only inProgressCount
     */
    getStatusSummary: async (): Promise<{ inProgressCount: number }> => {
        const response = await api.get<{ data: { inProgressCount: number } }>('/submissions/status-summary');
        return response.data;
    }
};
