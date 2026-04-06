// src/services/export-file.service.ts
import { api } from './api';
import { TrackThesisFilterParams } from '../types/track-thesis';

export const exportFileService = {
    /**
     * ดาวน์โหลด Master Report รวม 3 Sheets
     */
    exportMasterExcel: async (params: TrackThesisFilterParams): Promise<Blob> => {
        // เรียกใช้ api.getBlob ที่เราเพิ่งสร้าง
        // ระบบจะจัดการเรื่อง Cookie, Refresh Token และ Base URL ให้เองอัตโนมัติ
        return api.getBlob('/export-file/master-report', {
            ...params,
            isExport: true // ส่งเพื่อให้ Backend รู้ว่าไม่ต้องทำ Pagination
        });
    },

    /**
     * ดาวน์โหลด Master Report รวม 3 Sheets (PDF)
     */
    async exportMasterPdf(params: TrackThesisFilterParams): Promise<Blob> {
        return api.getBlob('/export-file/master-report', {
            ...params,
            isExport: true,
            type: 'pdf'    
        });
    },
};