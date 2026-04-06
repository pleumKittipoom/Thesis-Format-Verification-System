// src/services/dashboard.service.ts
import { api } from './api';
import {
    IDashboardOverview,
    IVerificationStats,
    IRecentUpload,
    IGroupRequest
} from '../types/dashboard.types';

interface DashboardResponse<T> {
    success: boolean;
    data: T;
}

export const dashboardService = {
    // 1. ดึงข้อมูล 4 การ์ดสรุปด้านบน
    getOverviewStats: () => {
        return api.get<DashboardResponse<IDashboardOverview>>('/dashboard/stats');
    },

    // 2. ดึงข้อมูลสถิติการตรวจ (รองรับการส่ง filter ปี/เทอม)
    getVerificationStats: (params?: { academicYear?: number; term?: number }) => {
        return api.get<DashboardResponse<IVerificationStats>>('/dashboard/verification-stats', params);
    },

    // 3. ดึงข้อมูลอัปโหลดล่าสุด
    getRecentUploads: () => {
        return api.get<DashboardResponse<{ waitingForVerify: number; items: IRecentUpload[] }>>('/dashboard/recent-uploads');
    },

    // 4. ดึงข้อมูลคำขอสร้างกลุ่ม
    getPendingGroupRequests: () => {
        return api.get<DashboardResponse<{ pendingCount: number; items: IGroupRequest[] }>>('/dashboard/group-requests');
    },

    // 5. อนุมัติกลุ่ม
    approveGroupRequest: (groupId: string) => {
        return api.patch<{ success: boolean; message: string }>(`/dashboard/group-requests/${groupId}/approve`, {});
    },

    // 6. ปฏิเสธกลุ่ม
    rejectGroupRequest: (groupId: string, reason?: string) => {
        return api.patch<{ success: boolean; message: string }>(`/dashboard/group-requests/${groupId}/reject`, { reason });
    },

    // 7. สถานะ python
    getSystemStatus: () => {
        return api.get<DashboardResponse<{ pythonEngine: { status: string, latency: string, activeWorkers: number } }>>('/dashboard/system-status');
    },
};