// src/services/track-thesis.service.ts
import { api } from './api';
import { TrackThesisFilterParams, TrackThesisResponse, ActiveRoundOption } from '../types/track-thesis';

export const trackThesisService = {

    // ดึงรายชื่อคนขาดส่ง
    getUnsubmittedGroups: async (params: TrackThesisFilterParams): Promise<TrackThesisResponse> => {
        // Clean params: ลบค่าที่เป็น undefined/null/empty string ออก
        const queryParams: Record<string, any> = { ...params };

        Object.keys(queryParams).forEach(key => {
            if (queryParams[key] === undefined || queryParams[key] === '' || queryParams[key] === null) {
                delete queryParams[key];
            }
        });

        // Default Pagination
        if (!queryParams.page) queryParams.page = 1;
        if (!queryParams.limit) queryParams.limit = 10;

        return api.get<TrackThesisResponse>('/track-thesis/unsubmitted', queryParams);
    },

    // ดึงตัวเลือก "รอบที่เปิดอยู่" สำหรับ Dropdown
    getActiveRoundOptions: async (): Promise<ActiveRoundOption[]> => {
        return api.get<ActiveRoundOption[]>('/inspections/active-options');
    },

    getSubmittedGroups: async (params: TrackThesisFilterParams): Promise<TrackThesisResponse> => {
        const queryParams: Record<string, any> = { ...params };

        // Clean params
        Object.keys(queryParams).forEach(key => {
            if (queryParams[key] === undefined || queryParams[key] === '' || queryParams[key] === null) {
                delete queryParams[key];
            }
        });

        // Default Pagination
        if (!queryParams.page) queryParams.page = 1;
        if (!queryParams.limit) queryParams.limit = 10;

        return api.get<TrackThesisResponse>('/track-thesis/submitted', queryParams);
    },

    remindGroup: async (groupId: string, inspectionId: number): Promise<{ success: boolean; message: string }> => {
        const response = await api.post<any>(`/track-thesis/remind/${groupId}`, { inspectionId });
        return response.data;
    },

};

