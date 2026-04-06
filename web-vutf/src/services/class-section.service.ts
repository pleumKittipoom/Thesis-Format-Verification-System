// src/services/class-section.service.ts
import { api } from './api';
import { ClassSection, SectionFilter } from '../types/class-section';

const ENDPOINT = '/class-sections';

export const classSectionService = {
  // ---------------------------------------------------------------------------
  // 1. Get All with Filter
  // ---------------------------------------------------------------------------
  getAll: async (filter: SectionFilter) => {
    // api.get รองรับ params เป็น argument ที่ 2 แล้วแปลงเป็น query string ให้เอง
    return await api.get<{ data: ClassSection[]; meta: any }>(ENDPOINT, filter as Record<string, any>);
  },

  getCurrentSemester: async () => {
    const response = await api.get<{ success: boolean; data: { academic_year: number; term: string } }>(
      `${ENDPOINT}/current-semester`
    );
    return response.data.data; // ส่งเฉพาะ { academic_year, term } กลับไป
  },

  // ---------------------------------------------------------------------------
  // 2. Create
  // ---------------------------------------------------------------------------
  create: async (data: Partial<ClassSection>) => {
    return await api.post(ENDPOINT, data);
  },

  // ---------------------------------------------------------------------------
  // 3. Update
  // ---------------------------------------------------------------------------
  update: async (id: number, data: Partial<ClassSection>) => {
    return await api.put(`${ENDPOINT}/${id}`, data);
  },

  // ---------------------------------------------------------------------------
  // 4. Delete
  // ---------------------------------------------------------------------------
  delete: async (id: number) => {
    return await api.delete(`${ENDPOINT}/${id}`);
  }
  
};