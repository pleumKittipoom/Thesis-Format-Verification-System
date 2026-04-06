// src/types/dashboard.types.ts

export interface IDashboardOverview {
  totalActiveGroups: number;
  passed: number;
  inProgress: number;
  needsAttention: number;
  newFromLastWeek: number;
}

export interface IVerificationStats {
  firstPassRate: { total: number; passed: number; percentage: number };
  secondPassRate: { total: number; passed: number; percentage: number };
  totalFilesProcessed: number;
  avgSpeed: string;
  storageUsed: { percentage: number; text: string };
  users: { activeStudents: number; instructors: number; admins: number };
}

export interface IRecentUpload {
  submissionId: number;
  thesisCode: string;
  thesisName: string;
  status: string;
  uploadedAt: string;
  inspectionId?: number;
}

export interface IGroupRequest {
  groupId: string;
  requesterName: string;
  thesisName: string;
  memberCount: number;
  advisorCount: number;
  term: number;
  academicYear: number;
  createdAt: string;
}