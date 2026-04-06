// src/services/student.service.ts
import { api } from './api';
import { ApiResponse, StudentProfile, UpdateStudentProfileRequest } from '../types/profile.types';

const ENDPOINT = '/students/profile';

export const getStudentProfile = async (): Promise<StudentProfile> => {
  const response = await api.get<ApiResponse<StudentProfile>>(ENDPOINT);
  return response.data;
};

export const updateStudentProfile = async (data: UpdateStudentProfileRequest): Promise<StudentProfile> => {
  const response = await api.patch<ApiResponse<StudentProfile>>(ENDPOINT, data);
  return response.data;
};