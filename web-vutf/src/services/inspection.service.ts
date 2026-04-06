// src/services/inspection.service.ts

import { api } from './api';
import { CreateInspectionDto, InspectionRound } from '../types/inspection';

// Interface สำหรับรับค่า Query Params
export interface GetInspectionParams {
    page?: number;
    limit?: number;
    search?: string;
}

// Interface สำหรับ Response ที่มี Pagination
export interface GetAllResponse {
    data: InspectionRound[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
        limit: number;
    };
}

export const inspectionService = {
    getAll: async (params?: GetInspectionParams) => {
        const queryString = params
            ? '?' + new URLSearchParams(params as any).toString()
            : '';

        const response = await api.get<GetAllResponse>(`/inspections${queryString}`);

        return response;
    },

    getActiveRound: async (): Promise<InspectionRound> => {
        const response = await api.get<{ success: boolean; data: InspectionRound }>('/inspections/active');

        return response.data;
    },

    create: async (data: CreateInspectionDto) => {
        return await api.post('/inspections', data);
    },

    update: async (id: number, data: Partial<CreateInspectionDto>) => {
        return await api.patch(`/inspections/${id}`, data);
    },

    remove: async (id: number) => {
        return await api.delete(`/inspections/${id}`);
    },

    toggleStatus: async (id: number) => {
        return await api.patch(`/inspections/${id}/status`, {});
    },

    getAvailableRoundsForGroup: async (groupId: string): Promise<InspectionRound[]> => {
        const response = await api.get<any>(`/inspections/group/${groupId}/available`);
        return response.data?.data || response.data || [];
    },

    getMyAvailableRounds: async (): Promise<InspectionRound[]> => {
        const response = await api.get<any>('/inspections/my-available');
        if (Array.isArray(response)) {
            return response;
        }
        return response.data?.data || response.data || [];
    },
};