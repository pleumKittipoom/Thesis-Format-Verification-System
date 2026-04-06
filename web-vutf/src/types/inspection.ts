// src/types/inspection.ts

// ใช้ Type แทน Enum เพื่อความยืดหยุ่นใน Frontend
export type InspectionStatus = 'OPEN' | 'CLOSED';
export type CourseType = 'PRE_PROJECT' | 'PROJECT' | 'ALL';

// Interface สำหรับข้อมูลที่ดึงมาจาก Backend
export interface InspectionRound {
  inspectionId: number;
  academicYear: string;   
  term: string;           
  roundNumber: number;    
  courseType: CourseType; 
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: InspectionStatus;
  isActive: boolean;      
  isManualClosed: boolean;
}

// Interface สำหรับส่งข้อมูลไปสร้าง (Create)
export interface CreateInspectionDto {
  academicYear: string;   
  term: string;           
  roundNumber: number;    
  courseType: CourseType; 
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status?: InspectionStatus;
}