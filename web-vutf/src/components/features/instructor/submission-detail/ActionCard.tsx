// src/components/features/instructor/submission-detail/ActionCard.tsx
import React, { useState, useEffect } from 'react';
import { SubmissionStatus } from '@/types/submission';
import { FiCheckCircle, FiLoader, FiShield, FiRefreshCw } from 'react-icons/fi';
import { reportService } from '@/services/report.service';
import { ReportData } from '@/types/report';
import { SubmissionReportTimeline } from './SubmissionReportTimeline';
import { swal } from '@/utils/swal';

interface Props {
  status: SubmissionStatus;
  submissionId: number;
  onVerify: (id: number) => Promise<void>;
}

export const ActionCard: React.FC<Props> = ({ status, submissionId, onVerify }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // ดึงประวัติการตรวจสอบ
  const fetchHistory = async () => {
    try {
      const res = await reportService.getBySubmissionId(submissionId);
      const data = (res as any).data || res;
      setReports(data || []);
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (submissionId) {
      fetchHistory();
    }
  }, [submissionId, status]);

  const verificationCount = reports.length;

  // ฟังก์ชันกดปุ่ม Verify (ใช้ Swal)
  const handleVerifyClick = async () => {
    if (isVerifying) return;

    // ข้อความ Confirm
    const title = verificationCount > 0 ? 'ตรวจสอบอีกครั้ง?' : 'ยืนยันการส่งตรวจสอบ';
    const text = verificationCount > 0
      ? `ไฟล์นี้ถูกตรวจสอบไปแล้ว ${verificationCount} ครั้ง คุณต้องการส่งตรวจสอบซ้ำใช่หรือไม่?`
      : 'ระบบจะทำการตรวจสอบไฟล์นี้อัตโนมัติ';

    // 1. แสดง Confirm Dialog
    const result = await swal.fire({
      title: title,
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ส่งตรวจสอบ',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    // 2. เริ่ม Process
    setIsVerifying(true);
    try {
      await onVerify(submissionId);
      await fetchHistory();
    } catch (error) {
      console.error("Verification failed", error);
      swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถส่งตรวจสอบได้', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <FiShield className="text-indigo-500" /> การดำเนินการ
      </h3>

      <div className="space-y-4">

        {/* แสดงสถานะจำนวนครั้งที่ตรวจ */}
        {verificationCount > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-xl text-sm flex items-center justify-between border border-blue-100 dark:border-blue-800">
            <span className="font-medium">ตรวจสอบแล้ว</span>
            <span className="font-bold bg-white dark:bg-blue-900 px-2 py-0.5 rounded-md shadow-sm text-xs">
              {verificationCount} ครั้ง
            </span>
          </div>
        )}

        {/* ปุ่ม Verify / Loading */}
        {/* เงื่อนไข: ถ้า status เป็น IN_PROGRESS หรือ isVerifying เป็น true ให้แสดง Loading */}
        {status === 'IN_PROGRESS' || isVerifying ? (
          <div className="w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400 cursor-wait">
            <FiLoader className="animate-spin" size={18} />
            <span>{isVerifying ? 'กำลังส่งข้อมูล...' : 'ระบบกำลังตรวจสอบ...'}</span>
          </div>
        ) : (
          <button
            onClick={handleVerifyClick}
            disabled={isVerifying}
            className={`
                    w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-sm
                    ${verificationCount > 0
                ? 'bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:bg-transparent dark:border-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-900/30'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-200 dark:hover:shadow-none hover:-translate-y-0.5'
              }
                `}
          >
            {verificationCount > 0 ? (
              <>
                <FiRefreshCw size={16} />
                <span>ตรวจสอบอีกครั้ง (Verify Again)</span>
              </>
            ) : (
              <>
                <FiCheckCircle size={18} />
                <span>เริ่มตรวจสอบ (Verify)</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Timeline อยู่ด้านล่างปุ่ม */}
      {!loadingHistory && reports.length > 0 && (
        <div className="animate-in slide-in-from-top-2 pt-2">
          <SubmissionReportTimeline reports={reports} />
        </div>
      )}
    </div>
  );
};