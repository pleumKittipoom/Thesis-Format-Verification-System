// src/services/admin-thesis.service.ts
import { api } from './api';
import { 
  AdminThesisGroup, 
  PaginatedResponse, 
  ThesisFilterParams, 
  ThesisGroupStatus 
} from '../types/admin-thesis';

export const adminThesisService = {
  
  getGroups: async (params: ThesisFilterParams) => {
    return api.get<PaginatedResponse<AdminThesisGroup>>('/thesis-topics/groups', params);
  },

  updateStatus: async (groupId: string, status: ThesisGroupStatus, reason?: string) => {
    return api.patch(`/thesis-topics/groups/${groupId}/status`, {
      status,
      rejection_reason: reason
    });
  },

  deleteThesis: async (thesisId: string) => {
    return api.delete(`/thesis-topics/${thesisId}`);
  },

  updateThesisInfo: async (groupId: string, data: Record<string, any>) => {
    return api.patch(`/thesis-topics/groups/${groupId}/thesis`, data);
  },

  createGroup: async (data: any) => {
    return api.post('/thesis-topics/groups', data);
  },
};