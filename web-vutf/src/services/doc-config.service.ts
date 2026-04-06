// src/services/doc-config.service.ts
import { api } from './api';
import type { DocumentConfigData } from '../types/doc-config';

const BASE_URL = '/doc-config';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const getDocConfig = async (): Promise<DocumentConfigData> => {
  const response = await api.get<ApiResponse<DocumentConfigData>>(BASE_URL);
  return response.data;
};

export const updateDocConfig = async (data: Partial<DocumentConfigData>): Promise<DocumentConfigData> => {
  const response = await api.patch<ApiResponse<DocumentConfigData>>(BASE_URL, data);
  return response.data;
};