// src/types/user.ts
import { ClassSection } from './class-section';
export interface Permission {
  permissions_id: number;
  action: string;
  resource: string;
}
export interface User {
  user_uuid: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  student?: StudentProfile;
  instructor?: InstructorProfile;
  isLocked?: boolean;
  permissions?: Permission[];
}

export interface StudentProfile {
  student_uuid?: string;
  student_code: string;
  prefix_name: string;
  first_name: string;
  last_name: string;
  phone: string;
  sectionId: number;
  section?: ClassSection;
}

export interface InstructorProfile {
  instructor_uuid?: string;
  instructor_code: string;
  first_name: string; 
  last_name: string;
}

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface UserResponse<T> {
  data: T[];
  meta: PaginationMeta;
}