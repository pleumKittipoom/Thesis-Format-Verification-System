// src/utils/error-handler.ts
import Swal from 'sweetalert2';

/**
 * ดึงข้อความ Error จาก Axios Response Object
 * รองรับทั้งแบบ String และ Array (NestJS Validation)
 */
export const getErrorMessage = (error: any, defaultMessage: string = 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ'): string => {
  if (error?.response?.data?.message) {
    const msg = error.response.data.message;
    // ถ้าเป็น Array (เช่น error จาก class-validator หลายตัว) ให้รวมด้วยการขึ้นบรรทัดใหม่
    if (Array.isArray(msg)) {
      return msg.join('\n');
    }
    // ถ้าเป็น String ปกติ
    return msg;
  }
  
  // กรณีไม่มี response data (เช่น Network Error)
  return error.message || defaultMessage;
};

/**
 * ฟังก์ชันสำเร็จรูปสำหรับเรียก SweetAlert แสดง Error ทันที
 */
export const showApiErrorAlert = (error: any, title: string = 'ดำเนินการไม่สำเร็จ') => {
  const message = getErrorMessage(error);
  
  return Swal.fire({
    title: title,
    text: message,
    icon: 'error',
    confirmButtonText: 'ตกลง',
    customClass: {
      confirmButton: 'bg-red-500 text-white px-4 py-2 rounded-lg'
    }
  });
};