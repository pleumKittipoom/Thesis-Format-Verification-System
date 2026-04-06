// src/components/features/instructor/submission-detail/SubmissionFileCard.tsx
import React, { useState } from 'react';
import { FiFileText, FiDownload, FiEye, FiX } from 'react-icons/fi';
import { FaFilePdf, FaFileCsv } from 'react-icons/fa6';
import { formatFileSize } from '@/types/submission';
import { ThesisValidator } from '@/components/shared/thesis-validator/ThesisValidator';
import { PdfPreviewModal } from '@/components/shared/pdf-preview/PdfPreviewModal';

interface Props {
  reportId: number;
  title?: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  downloadUrl: string;
  mimeType: string;
  csv?: { url: string; downloadUrl: string } | null;
  originalFile?: {
    name: string;
    url: string;
    downloadUrl: string;
  } | null;
  onReportUpdate?: () => void;
}

export const SubmissionFileCard: React.FC<Props> = ({
  reportId,
  title = "เอกสารปริญญานิพนธ์",
  fileName,
  fileSize,
  fileUrl,
  downloadUrl,
  mimeType,
  csv,
  originalFile,
  onReportUpdate
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isValidatorOpen, setIsValidatorOpen] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <FiFileText className="text-blue-500 dark:text-blue-400" /> {title}
        </h3>

        {/* === PDF Section (Report File) === */}
        <div className="flex flex-col lg:flex-row items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-700/30">
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl shadow-sm">
              <FaFilePdf size={28} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white truncate" title={fileName}>
                {fileName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatFileSize(fileSize)} • {mimeType.split('/')[1]?.toUpperCase() || 'PDF'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 lg:mt-0 w-full lg:w-auto">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="flex-1 lg:flex-none px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all text-sm font-medium flex items-center justify-center gap-2 border border-blue-100 dark:border-blue-800"
            >
              <FiEye size={18} /> ดูตัวอย่าง
            </button>

            <a
              href={downloadUrl}
              download={fileName}
              className="flex-1 lg:flex-none px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-sm font-medium flex items-center justify-center gap-2 shadow-sm"
            >
              <FiDownload size={18} /> ดาวน์โหลด
            </a>
          </div>
        </div>

        {/* === CSV Section (Validator Trigger) === */}
        {csv && (
          <div className="mt-3 flex flex-col lg:flex-row items-center justify-between p-4 border border-emerald-100 dark:border-emerald-900/30 rounded-xl bg-emerald-50/30 dark:bg-emerald-900/10">
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl shadow-sm">
                <FaFileCsv size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  Data Report (CSV)
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  ข้อมูลผลการตรวจสอบ
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 lg:mt-0 w-full lg:w-auto">
              {/* ปุ่มเปิด Validator */}
              <button
                onClick={() => setIsValidatorOpen(true)}
                className="flex-1 lg:flex-none px-4 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all text-sm font-medium flex items-center justify-center gap-2 border border-emerald-100 dark:border-emerald-800"
              >
                <FiEye size={18} /> เปิดดูผลตรวจ
              </button>

              <a
                href={csv.downloadUrl}
                download={`report-data.csv`}
                className="flex-1 lg:flex-none px-4 py-2.5 bg-white dark:bg-gray-700 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all text-sm font-medium flex items-center justify-center gap-2 shadow-sm"
              >
                <FiDownload size={18} /> ดาวน์โหลด CSV
              </a>
            </div>
          </div>
        )}
      </div>

      {/* === PDF Preview Modal (สำหรับไฟล์ Report ปกติ) === */}
      {isPreviewOpen && mimeType.includes('pdf') && (
        <PdfPreviewModal
          url={fileUrl}
          downloadUrl={downloadUrl}
          fileName={fileName}
          fileSize={fileSize}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}

      {/* Fallback กรณีที่ไม่ใช่ PDF */}
      {isPreviewOpen && !mimeType.includes('pdf') && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-gray-900/95 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="flex justify-end p-2">
            <button onClick={() => setIsPreviewOpen(false)} className="p-2 text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors">
              <FiX size={24} />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl flex flex-col items-center shadow-2xl text-center">
              <FiFileText size={48} className="mb-4 text-gray-400 opacity-50" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">ไฟล์นี้ไม่รองรับการแสดงตัวอย่างในเบราว์เซอร์</p>
              <a href={downloadUrl} download={fileName} className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                <FiDownload /> ดาวน์โหลดไฟล์
              </a>
            </div>
          </div>
        </div>
      )}

      {/* === Thesis Validator Modal */}
      {isValidatorOpen && csv && (
        <div className="fixed inset-0 z-[100] bg-gray-900/90 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
          <div className="w-full h-full md:w-[95vw] md:h-[95vh] bg-white dark:bg-gray-900 md:rounded-xl shadow-2xl overflow-hidden">
            <ThesisValidator
              reportFileId={reportId}
              pdfUrl={originalFile?.url || fileUrl}
              csvUrl={csv.url}
              fileName={originalFile?.name || fileName}
              onClose={() => setIsValidatorOpen(false)}
              onSaveSuccess={() => {
                if (onReportUpdate) {
                  onReportUpdate(); 
                }
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};