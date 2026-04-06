// src/types/profile.types.ts

export interface StudentProfile {
  student_uuid: string;
  student_code: string;
  prefix_name: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  email: string | null;
  is_active: boolean;
  create_at: string;
  sectionId?: number;
  sectionName?: string;
}

export interface InstructorProfile {
  instructor_uuid: string;
  instructor_code: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string | null;
  is_active: boolean;
  create_at: string;
}

// Interface สำหรับ API Response (Generic)
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface UpdateStudentProfileRequest {
  prefixName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface UpdateInstructorProfileRequest {
  firstName?: string;
  lastName?: string;
}