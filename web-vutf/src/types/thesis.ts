// src/types/thesis.ts
// Types และ Interfaces สำหรับ Thesis Domain

// ============================================
// ENUMS
// ============================================

/**
 * บทบาทของสมาชิกในกลุ่ม
 */
export enum GroupMemberRole {
    OWNER = 'owner',
    MEMBER = 'member'
}

/**
 * สถานะการตอบรับคำเชิญ
 */
export enum InvitationStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

/**
 * บทบาทของอาจารย์ที่ปรึกษา
 */
export enum AdvisorRole {
    MAIN = 'main',
    CO = 'co'
}

/**
 * ประเภทของรายวิชา
 */
export enum CourseType {
    PRE_PROJECT = 'PRE_PROJECT',
    PROJECT = 'PROJECT',
    ALL = 'ALL'
}

/**
 * สถานะของกลุ่มวิทยานิพนธ์
 */
export enum ThesisGroupStatus {
    INCOMPLETE = 'incomplete',
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

/**
 * สถานะของวิทยานิพนธ์
 */
export enum ThesisStatus {
    IN_PROGRESS = 'IN_PROGRESS',
    PASSED = 'PASSED',
    FAILED = 'FAILED'
}

// ============================================
// ENTITIES
// ============================================

/**
 * ข้อมูลวิทยานิพนธ์
 */
export interface Thesis {
    thesis_id: string;
    thesis_code: string;
    thesis_name_th: string;
    thesis_name_en: string;
    graduation_year: number | null;
    course_type: CourseType;       
    start_academic_year: number;    
    start_term: number;
    file_url: string | null;
    created_at: string;
    status?: ThesisStatus | string;
}

/**
 * ข้อมูลกลุ่มวิทยานิพนธ์
 */
export interface ThesisGroup {
    group_id: string;
    created_by?: string | { user_uuid: string }; // Optional, can be ID string or object
    status: ThesisGroupStatus | string;
    approved_at?: string | null;
    rejection_reason?: string | null;
    created_at: string;
    thesis: Thesis;
    members: GroupMember[];
    advisor: Advisor[];
    totalMemberCount?: number;
}

/**
 * ข้อมูลสมาชิกกลุ่ม
 */
export interface GroupMember {
    member_id: string;
    student_uuid: string;
    role: GroupMemberRole;
    invitation_status: InvitationStatus;
    invited_at: string;
    approved_at: string | null;
    group_id: string;
    // Relations (optional - อาจมาจาก API บางตัว)
    student?: StudentInfo;
    group?: ThesisGroup;
}

/**
 * ข้อมูลการมอบหมายอาจารย์ที่ปรึกษา
 */
export interface Advisor {
    advisor_id: string;
    role: AdvisorRole;
    instructor: InstructorInfo;
}

export interface AdvisorAssignment { // Keep for backward compatibility if needed, else remove or alias
    advisor_id: string;
    instructor_uuid?: string;
    role: AdvisorRole;
    group_id?: string;
    instructor?: InstructorInfo;
}

// ============================================
// RELATED ENTITIES (จาก API อื่น)
// ============================================

/**
 * ข้อมูลนักศึกษา (สำหรับ search/display)
 */
export interface StudentInfo {
    student_uuid: string;
    student_id?: string;
    student_code?: string;
    prefix_name?: string;
    first_name: string;
    last_name: string;
    email?: string;
}

/**
 * ข้อมูลอาจารย์ (สำหรับ search/display)
 */
export interface InstructorInfo {
    instructor_uuid: string;
    instructor_code: string;
    first_name: string;
    last_name: string;
    full_name: string;
    email?: string | null;
    is_active: boolean;
    create_at: string;
    department?: string;
}

// ============================================
// DTOs - CREATE THESIS GROUP
// ============================================

/**
 * ข้อมูลวิทยานิพนธ์สำหรับสร้างกลุ่ม
 */
export interface CreateThesisDto {
    thesis_code: string;
    thesis_name_th: string;
    thesis_name_en: string;
    graduation_year?: number;
    course_type: CourseType;       
    start_academic_year: number;    
    start_term: number;
}

/**
 * ข้อมูลสมาชิกสำหรับสร้างกลุ่ม
 */
export interface CreateGroupMemberDto {
    student_uuid: string;
    role: GroupMemberRole.MEMBER; // เฉพาะ member เท่านั้น, owner ถูกเพิ่มอัตโนมัติ
}

/**
 * ข้อมูลอาจารย์ที่ปรึกษาสำหรับสร้างกลุ่ม
 */
export interface CreateAdvisorDto {
    instructor_uuid: string;
    role: AdvisorRole;
}

/**
 * Payload สำหรับสร้างกลุ่มวิทยานิพนธ์
 */
export interface CreateThesisGroupPayload {
    thesis: CreateThesisDto;
    group_member: CreateGroupMemberDto[];
    advisor: CreateAdvisorDto[];
}

// ============================================
// DTOs - THESIS GROUP OPERATIONS
// ============================================

export interface CreateThesisGroupResponse {
    success: boolean;
    message: string;
}

export interface UpdateThesisDto {
    thesis_name_th?: string;
    thesis_name_en?: string;
    graduation_year?: number;
    course_type?: CourseType;
    start_academic_year?: number;
    start_term?: number;
}

export interface AddAdvisorDto {
    instructor_uuid: string;
    role: AdvisorRole;
}

export interface UpdateAdvisorDto {
    role: AdvisorRole;
}

// ============================================
// DTOs - UPDATE INVITATION STATUS
// ============================================

/**
 * Payload สำหรับอัปเดตสถานะคำเชิญ
 */
export interface UpdateInvitationStatusPayload {
    invitation_status: InvitationStatus.APPROVED | InvitationStatus.REJECTED;
}

/**
 * Response หลังอัปเดตสถานะคำเชิญ
 */
export interface UpdateInvitationStatusResponse {
    member_id: string;
    student_uuid: string;
    role: string;
    invitation_status: string;
    invited_at: string;
    approved_at: string | null;
    group_id: string;
}

// ============================================
// FORM DATA TYPES (สำหรับ react-hook-form)
// ============================================

/**
 * ข้อมูลสมาชิกใน Form (รวม StudentInfo สำหรับแสดงผล)
 */
export interface FormGroupMember {
    student_uuid: string;
    role: GroupMemberRole.MEMBER;
    studentInfo?: StudentInfo; // สำหรับแสดงผลใน UI
}

/**
 * ข้อมูลอาจารย์ใน Form (รวม InstructorInfo สำหรับแสดงผล)
 */
export interface FormAdvisor {
    instructor_uuid: string;
    role: AdvisorRole;
    instructorInfo?: InstructorInfo; // สำหรับแสดงผลใน UI
}

/**
 * Form data สำหรับ Create Thesis Group
 */
export interface CreateThesisGroupFormData {
    thesis_code: string;
    thesis_name_th: string;
    thesis_name_en: string;
    graduation_year?: number;
    group_members: FormGroupMember[];
    advisors: FormAdvisor[];
    course_type: CourseType;       
    start_academic_year: number;    
    start_term: number;
}

// ============================================
// UI HELPER TYPES
// ============================================

/**
 * Props สำหรับ Invitation Card
 */
export interface InvitationCardData {
    member_id: string;
    invitation_status: InvitationStatus;
    invited_at: string;
    thesis: Thesis;
    owner?: StudentInfo;
    members: GroupMember[];
    advisors: AdvisorAssignment[];
}
