// src/types/report-detail.ts
import { VerificationStatus, ReviewStatus } from './report';

export interface ReportDetail {
  id: number;
  createdAt: string;
  verificationStatus: VerificationStatus;
  reviewStatus: ReviewStatus;
  comment: string | null;
  courseType?: string;
  
  file: {
    name: string;
    url: string;
    downloadUrl: string;
    size: number;
    type: string;
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

  project: {
    nameTh: string;
    nameEn: string;
    code: string;
  };

  inspectionRound: {
    id: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    year: string;
    term: string;
  } | null;

  groupMembers: any[]; // ใช้ Type เดียวกับ Submission
  advisors: any[];     // ใช้ Type เดียวกับ Submission
}