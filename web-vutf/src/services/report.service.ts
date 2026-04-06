// src/services/report.service.ts
import { api } from './api';
import { ReportData, ReportFilterParams, StudentReportData, VerificationStatus } from '../types/report';

// Interface สำหรับ Response (Data + Meta)
export interface ReportResponse {
  data: ReportData[];
  meta: {
    page: number;
    total: number;
    lastPage: number;
    limit: number;
  };
}

export const reportService = {
  /**
   * ดึงข้อมูล Report ทั้งหมด (พร้อม Filter & Pagination)
   * GET /report-file
   */
  getAll: async (params: ReportFilterParams): Promise<ReportResponse> => {
    return api.get<ReportResponse>('/report-file', params);
  },

  /**
   * ดึงรายละเอียด Report ตาม ID
   * GET /report-file/:id
   */
  getOne: async (id: number): Promise<ReportData> => {
    return api.get<ReportData>(`/report-file/${id}`);
  },

  /** 
   * ดึงประวัติ Report ทั้งหมดของ Submission นี้ 
   */
  getBySubmissionId: async (submissionId: number): Promise<ReportData[]> => {
    return api.get<ReportData[]>(`/report-file/submission/${submissionId}`);
  },


  /**
   * อาจารย์กดตรวจสอบ/ให้ผลลัพธ์ (Review)
   * PATCH /report-file/:id/review
   */
  submitReview: async (id: number, data: { reviewStatus: string; comment?: string }) => {
    return api.patch(`/report-file/${id}/review`, data);
  },

  /**
   * สำหรับนักศึกษา: ดึง Report ที่ตรวจแล้วเท่านั้น
   * GET /report-file/submission/:submissionId/student
   */
  getForStudent: async (submissionId: number): Promise<StudentReportData[]> => {
    return api.get<StudentReportData[]>(`/report-file/submission/${submissionId}/student`);
  },

  /**
   * อัปเดตสถานะการตรวจสอบอัตโนมัติ (Verification Status)
   * PATCH /report-file/:id/verification-status
   */
  updateVerificationStatus: async (id: number, status: VerificationStatus) => {
    return api.patch(`/report-file/${id}/verification-status`, { status });
  },
};