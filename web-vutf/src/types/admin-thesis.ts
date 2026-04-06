// src/types/admin-thesis.ts

export enum ThesisGroupStatus {
    INCOMPLETE = 'incomplete',
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export enum ThesisStatus {
    IN_PROGRESS = 'IN_PROGRESS',
    PASSED = 'PASSED',
    FAILED = 'FAILED',
}

// Interface ข้อมูลกลุ่ม
export interface AdminThesisGroup {
    group_id: string;
    status: ThesisGroupStatus;
    created_at: string;
    approved_at: string | null; 
    rejection_reason?: string | null;
    
    thesis: {
        thesis_id: string;
        thesis_code: string;
        thesis_name_th: string;
        thesis_name_en: string;
        status: ThesisStatus;
        
        course_type: string; 
        start_academic_year: number;
        start_term: number;
        graduation_year: number;
    };
    
    members: Array<{
        role: string; // (เช่น 'owner', 'member')
        student: {
            student_code: string;
            first_name: string;
            last_name: string;
            phone: string; 
        };
        invitation_status: string;
    }>;
    
    advisor?: Array<{
        advisor_id: string;
        role: 'main' | 'co' | string;
        instructor: {
            instructor_code: string;
            first_name: string;
            last_name: string;
        };
    }>;

    // Fields พิเศษจาก Backend (Virtual Fields)
    stage: string;
    isReadyForAdminAction: boolean;
    memberProgress: string;
}

// Interface สำหรับ Filter และ Pagination
export interface ThesisFilterParams {
    page: number;
    limit: number;
    keyword?: string;
    group_status?: ThesisGroupStatus;
    thesis_status?: ThesisStatus;
    start_academic_year?: number; 
    start_term?: number;
}

// Interface Response จาก API
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}