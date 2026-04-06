// src/types/auth.ts
// (Request)
export interface LoginRequest {
  email: string;
  password?: string;
}

// (Response)
export interface UserProfile {
  userId: string;
  email: string;
  role: string;
}

export interface LoginResponseData {
  userId: string;
  email: string;
  role: string;
  message: string;
}

export interface RegisterRequest {
  email: string;
  prefixName: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  confirmPassword: string;
  sectionId: number;
}

export interface RegisterResponse {
  userId: string;
  email: string;
  firstName: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyForgotOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
}