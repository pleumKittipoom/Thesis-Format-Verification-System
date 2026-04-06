// src/services/user.service.ts
import { api } from './api';
import { UserResponse, User, Permission } from '../types/user';

// Helper function
const buildQuery = (params: Record<string, any>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  });
  return query.toString() ? `?${query.toString()}` : '';
};

export const userService = {

  getStudents: async (
    page = 1,
    limit = 10,
    search = '',
    filters?: { academicYear?: string; term?: string; sectionId?: number }
  ) => {
    const queryString = buildQuery({
      page,
      limit,
      search,
      role: 'student',
      academicYear: filters?.academicYear,
      term: filters?.term,
      sectionId: filters?.sectionId
    });

    const response = await api.get<UserResponse<User>>(`/users${queryString}`);
    return response;
  },

  getInstructors: async (page = 1, limit = 10, search = '') => {
    const queryString = buildQuery({ page, limit, search, role: 'instructor' });
    const response = await api.get<UserResponse<User>>(`/users${queryString}`);
    return response;
  },

  createInstructor: async (data: any) => {
    return await api.post('/instructors', data);
  },

  inviteStudents: async (emails: string[]) => {
    const response = await api.post('/students/invite', { emails });
    return response.data;
  },

  validateInviteToken: async (token: string) => {
    const response = await api.get<any>(`/students/validate-invite-token?token=${token}`);
    return response.data;
  },

  setupProfile: async (data: {
    token: string;
    password: string;
    prefixName: string;
    firstName: string;
    lastName: string;
    phone: string;
    sectionId: number;
  }) => {
    const payload = {
      token: data.token,
      password: data.password,
      prefixName: data.prefixName,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      section_id: data.sectionId
    };

    const response = await api.post('/students/setup-profile', payload);
    return response.data;
  },

  deleteUser: async (id: string) => {
    return await api.delete(`/users/${id}`);
  },

  updateUser: async (id: string, data: any) => {
    return await api.patch(`/users/${id}`, data);
  },

  getAllPermissions: async (): Promise<Permission[]> => {
    const response = await api.get<any>('/permissions');
    return response.data;
  },

  updatePermissions: async (id: string, permissionIds: number[]) => {
    const response = await api.patch<any>(`/users/${id}/permissions`, { permissionIds });
    return response.data;
  },

  unlockUser: async (id: string) => {
    const response = await api.patch<any>(`/users/${id}/unlock`, {}); 
    return response.data;
  },
};