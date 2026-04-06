// src/services/instructor.service.ts
import { api } from './api';
import { ApiResponse, InstructorProfile, UpdateInstructorProfileRequest } from '../types/profile.types';
import { AdvisedGroupResponse } from '@/types/group.types';

export const getInstructorProfile = async (): Promise<InstructorProfile> => {
  const response = await api.get<ApiResponse<InstructorProfile>>('/instructors/profile');
  return response.data;
};

export const updateInstructorProfile = async (data: UpdateInstructorProfileRequest): Promise<InstructorProfile> => {
  const response = await api.patch<ApiResponse<InstructorProfile>>('/instructors/profile', data);
  return response.data;
};

export const getMyAdvisedGroups = async (): Promise<AdvisedGroupResponse[]> => {
  const response = await api.get<ApiResponse<AdvisedGroupResponse[]>>('/instructors/my-advised-groups-progress');
  return response.data;
};
