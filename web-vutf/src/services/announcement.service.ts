import { api } from './api';
import { Announcement, AnnouncementResponse } from '../types/announcement';

export const announcementService = {
  getAll: async (page = 1, limit = 10, search = '') => {
    return await api.get<AnnouncementResponse>('/announcements', { 
      page, 
      limit, 
      search 
    });
  },

  create: async (data: Partial<Announcement>) => {
    return await api.post('/announcements', data);
  },

  update: async (id: string, data: Partial<Announcement>) => {
    return await api.put(`/announcements/${id}`, data);
  },

  delete: async (id: string) => {
    return await api.delete(`/announcements/${id}`);
  },
};