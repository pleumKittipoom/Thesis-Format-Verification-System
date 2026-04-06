import { z } from 'zod';

export const createInspectionSchema = z.object({
  academicYear: z.string().length(4, 'ระบุปีการศึกษา 4 หลัก (เช่น 2567)'),
  term: z.string().min(1, 'ระบุเทอม'),
  roundNumber: z.coerce.number().min(1, 'ลำดับรอบต้องเป็นตัวเลขตั้งแต่ 1 ขึ้นไป'),
  courseType: z.enum(['PRE_PROJECT', 'PROJECT', 'ALL']),
  title: z.string().min(1, 'กรุณาระบุหัวข้อ'),
  description: z.string().optional(),
  startDate: z.string().min(1, 'กรุณาระบุวันเริ่มต้น'),
  endDate: z.string().min(1, 'กรุณาระบุวันสิ้นสุด'),
  status: z.enum(['OPEN', 'CLOSED']).optional(),
  isActive: z.boolean().optional().default(true),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return start < end;
}, {
  message: 'วันที่เริ่มต้นต้องมาก่อนวันที่สิ้นสุด',
  path: ['startDate'],
});

export type CreateInspectionSchema = z.infer<typeof createInspectionSchema>;