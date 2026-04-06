// src/components/features/admin/thesis-topic/ActionModal.tsx
import { useState, useEffect } from 'react';
import { FiAlertCircle, FiCheckCircle, FiX, FiLoader } from 'react-icons/fi';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  type: 'approve' | 'reject';
  title: string;
  isSubmitting?: boolean;
}

export const ActionModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  type, 
  title,
  isSubmitting = false
}: ActionModalProps) => {
  const [reason, setReason] = useState('');

  // Reset reason เมื่อเปิด Modal ใหม่
  useEffect(() => {
    if (isOpen) setReason('');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={!isSubmitting ? onClose : undefined}
      />
      
      {/* Modal Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md z-10 shadow-2xl transform transition-all scale-100 p-6 relative">
        <div className="absolute top-4 right-4">
            <button 
              onClick={onClose} 
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 transition-colors"
            >
                <FiX size={20} />
            </button>
        </div>

        <div className="flex flex-col items-center text-center mb-6">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
            type === 'approve' 
              ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
              : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {type === 'approve' ? <FiCheckCircle size={28} /> : <FiAlertCircle size={28} />}
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {type === 'approve' ? 'ยืนยันการอนุมัติ?' : 'ปฏิเสธคำขอ?'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            คุณกำลังดำเนินการกับโครงงาน: <br/>
            <span className="font-semibold text-gray-700 dark:text-gray-200">"{title}"</span>
          </p>
        </div>

        {type === 'reject' && (
          <div className="mb-6 text-left">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ระบุเหตุผล <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500/20 dark:focus:ring-red-500/40 focus:border-red-500 outline-none transition-all resize-none text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 text-sm placeholder-gray-400 dark:placeholder-gray-500 disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:text-gray-400 dark:disabled:text-gray-600"
              rows={3}
              placeholder="กรุณาระบุเหตุผล ที่ต้องการให้นักศึกษาแก้ไขข้อมูลโครงงาน"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ยกเลิก
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={(type === 'reject' && !reason.trim()) || isSubmitting}
            className={`flex-1 px-4 py-2.5 text-white rounded-xl font-medium shadow-sm transition-all flex items-center justify-center gap-2 ${
              type === 'approve' 
                ? 'bg-green-600 hover:bg-green-700 shadow-green-200 dark:shadow-none dark:bg-green-600 dark:hover:bg-green-500' 
                : 'bg-red-600 hover:bg-red-700 shadow-red-200 dark:shadow-none dark:bg-red-600 dark:hover:bg-red-500'
            } disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none`}
          >
            {isSubmitting && <FiLoader className="animate-spin" />}
            {isSubmitting ? 'กำลังบันทึก...' : 'ยืนยัน'}
          </button>
        </div>
      </div>
    </div>
  );
};