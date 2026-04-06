// src/types/report.ts

export type VerificationStatus = 'PASS' | 'FAIL' | 'ERROR'; 
export type ReviewStatus = 'PENDING' | 'PASSED' | 'NOT_PASSED' | 'NEEDS_REVISION';


export interface ReportData {
  id: number;
  attemptNumber: number;
  createdAt: string;     
  verificationStatus: VerificationStatus;
  reviewStatus: ReviewStatus;
  comment: string | null;

  // File Info (เป็น Object ซ้อน)
  file: {
    name: string;
    url: string;
    downloadUrl: string;
    type: string;
    size: number;
  };

  originalFile?: {
    name: string;
    url: string;
    downloadUrl: string;
    type: string;
    size: number;
  } | null;

  csv?: {
    url: string;
    downloadUrl: string;
  } | null;

  // Reviewer Info
  reviewer: {
    name: string;
    id: string | null;
  };
  
  commenter: {
    name: string;
    id: string | null;
  };

  // Project Info
  project: {
    nameTh: string;
    nameEn: string;
    code: string;
    courseType: string;
  };

  // Student Info
  groupMembers: {
    studentId: string;
    studentCode: string;
    firstName: string;
    lastName: string;
    role: string;
    avatarUrl?: string | null;
  }[];

  // Inspection Round
  inspectionRound: {
    id: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    courseType: string;
    year: string;       
    term: string;    
    roundNumber: number;
  } | null;

  context: {
    submissionId: number;
    round: string;
  };
}

export interface ReportFilterParams {
  page: number;
  limit: number;
  inspectionId?: number;
  search?: string;
  academicYear?: string;
  term?: string;
  round?: number;
  courseType?: string;
  verificationStatus?: VerificationStatus;
  reviewStatus?: ReviewStatus;
  sortOrder?: 'DESC' | 'ASC' | string;
}

export interface StudentReportData {
  id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  verification_status: VerificationStatus;
  review_status: ReviewStatus;
  reported_at: string;
  comment: string | null;
  comment_by_id: string | null;
  comment_by_name: string; // ชื่ออาจารย์ที่ได้มาจากการ Join
  urls: {
    pdf: {
      url: string;
      downloadUrl: string;
    };
    csv?: {
      url: string;
      downloadUrl: string;
    } | null;
  };
}