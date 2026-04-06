import { api } from './api';

// Helper function ช่วยต่อ Query String
const buildQuery = (params: Record<string, any>) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            query.append(key, String(value));
        }
    });
    return query.toString() ? `?${query.toString()}` : '';
};

export const auditLogService = {
    getRecent: async () => {
        const response = await api.get<any>('/audit-logs/recent');
        return response;
    },

    getAll: async (params: {
        page?: number; limit?: number; search?: string;
        action?: string; startDate?: string; endDate?: string;
    }) => {
        const queryString = buildQuery(params);
        const response = await api.get<any>(`/audit-logs${queryString}`);
        return response;
    },

    getStats: async (params: {
        search?: string; action?: string; startDate?: string; endDate?: string;
    }) => {
        const queryString = buildQuery(params);
        const response = await api.get<any>(`/audit-logs/stats${queryString}`);
        return response.data;
    }
};