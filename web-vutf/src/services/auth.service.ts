// src/services/auth.service.ts

import { api } from './api';
// import { ApiResponse } from '../types';
import { LoginRequest, LoginResponseData, RegisterRequest, RegisterResponse } from '../types/auth';
import { ForgotPasswordRequest, VerifyForgotOtpRequest, ResetPasswordRequest } from '../types/auth';

// DTO สำหรับการ Request OTP
interface RequestOtpDto {
  email: string;
}

// DTO สำหรับการ Verify OTP
interface VerifyOtpDto {
  email: string;
  otp: string;
}

// Response ของ Verify OTP
interface VerifyOtpResponse {
  registrationToken: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  code?: string;
}

export const authService = {
  login: async (credentials: LoginRequest) => {
    return api.post<LoginResponseData>('/auth/login', credentials);
  },

  logout: async () => {
    return api.post('/auth/logout', {});
  },

  getMe: async () => {
    return api.get<ApiResponse<UserProfile>>('/auth/me');
  },

  // ขอ OTP
  requestRegistrationOtp: async (data: RequestOtpDto) => {
    return api.post('/auth/request-registration-otp', data);
  },

  // ยืนยัน OTP
  verifyRegistrationOtp: async (data: VerifyOtpDto) => {
    return api.post<VerifyOtpResponse>('/auth/verify-registration-otp', data);
  },

  // สมัครสมาชิก (ส่ง Cookie registrationToken ไปอัตโนมัติ)
  register: async (data: RegisterRequest) => {
    return api.post<RegisterResponse>('/auth/register', data);
  },

  // ขอ OTP ลืมรหัสผ่าน
  requestForgotPasswordOtp: async (data: ForgotPasswordRequest) => {
    return api.post('/auth/forgot-password', data);
  },

  // ยืนยัน OTP (Backend จะ set cookie 'resetToken' ให้)
  verifyForgotPasswordOtp: async (data: VerifyForgotOtpRequest) => {
    return api.post('/auth/verify-forgot-otp', data);
  },

  // ตั้งรหัสผ่านใหม่ (Cookie จะถูกส่งไปเองอัตโนมัติ)
  resetPassword: async (data: ResetPasswordRequest) => {
    return api.post('/auth/reset-password', data);
  }
};