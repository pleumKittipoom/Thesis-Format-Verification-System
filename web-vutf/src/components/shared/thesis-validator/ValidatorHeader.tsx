// src/components/shared/thesis-validator/ValidatorHeader.tsx
import React from 'react';
import { FiChevronLeft, FiChevronRight, FiDownload, FiX, FiSkipForward, FiCheckCircle, FiZoomIn, FiZoomOut, FiEdit3 } from 'react-icons/fi';
import { FaKeyboard, FaFilePdf } from 'react-icons/fa6';
import { Issue } from './ValidatorIssueList';
import { ExportPDFButton } from './ExportPDFButton';
import { ValidatorMarginDropdown } from './ValidatorMarginDropdown';

interface Props {
  fileName: string;
  pageNumber: number;
  numPages: number | null;
  setPageNumber: (page: number) => void;
  onClose: () => void;
  onNextIssue: () => void;
  onDownloadReport?: () => void;
  pdfUrl: string;
  issues: Issue[];
  onSaveToServer?: () => void;
  isSaving?: boolean;
  activeMargins: string[];
  setActiveMargins: React.Dispatch<React.SetStateAction<string[]>>;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  isDrawingMode: boolean;
  setIsDrawingMode: React.Dispatch<React.SetStateAction<boolean>>;
  isReadOnly?: boolean;
}

export const ValidatorHeader: React.FC<Props> = ({
  fileName,
  pageNumber,
  numPages,
  setPageNumber,
  onClose,
  onNextIssue,
  onDownloadReport,
  pdfUrl,
  issues,
  onSaveToServer,
  isSaving,
  activeMargins,
  setActiveMargins,
  zoomLevel,
  setZoomLevel,
  isDrawingMode,
  setIsDrawingMode,
  isReadOnly = false,
}) => {

  const resolvedCount = issues.filter(issue => issue.isIgnored).length;
  const handleZoomOut = () => setZoomLevel(prev => Math.max(0.5, prev - 0.25)); // ต่ำสุด 50%
  const handleZoomIn = () => setZoomLevel(prev => Math.min(3, prev + 0.25)); // สูงสุด 300%

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-6 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-slate-200 dark:border-gray-700 sticky top-0 z-[60] shadow-sm transition-colors duration-200 gap-3 md:gap-0">

      {/* Left: Title & Hint */}
      <div className="flex items-center justify-between w-full md:w-auto gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 bg-slate-900 dark:bg-slate-700 text-white rounded-xl flex items-center justify-center shadow-lg shadow-slate-200 dark:shadow-none">
            <FaFilePdf className="w-4 h-4 md:w-5 md:h-5" />
          </div>

          <div>
            <h1 className="text-sm md:text-base font-bold text-slate-800 dark:text-white leading-tight line-clamp-1">{fileName}</h1>
            <div className="hidden md:flex items-center gap-2 text-[10px] text-slate-400 dark:text-gray-400 font-medium tracking-wide">
              <span>THESIS REVIEW SYSTEM</span>
              <span className="text-slate-300 dark:text-gray-600">|</span>
              <span className="flex items-center gap-1 text-slate-500 dark:text-gray-300 bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                <FaKeyboard />
                {onSaveToServer ? (
                  <>Press <b className="text-slate-800 dark:text-white">Enter</b> to Approve & Next</>
                ) : (
                  <>Press <b className="text-slate-800 dark:text-white">Enter</b> to Next Page</>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* ปุ่ม Close แสดงเฉพาะบนมือถือ */}
        <button
          onClick={onClose}
          className="md:hidden p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors shrink-0"
          title="Close Validator"
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Right: Controls (จัดกลุ่มใหม่เพื่อให้ flex-wrap ทำงานได้อย่างสวยงาม) */}
      <div className="flex flex-wrap items-center gap-y-3 gap-x-4 w-full md:w-auto">

        {/* กลุ่มที่ 1: เครื่องมือ (ไม้บรรทัด + Next Issue) */}
        <div className="flex items-center gap-2">

          {/* 🌟 ปุ่มเปิด/ปิดโหมดการวาด (Add Issue) */}
          {!isReadOnly && (
            <button
              onClick={() => setIsDrawingMode(!isDrawingMode)}
              className={`p-2 rounded-lg transition-colors flex items-center gap-2 border text-sm
                ${isDrawingMode
                  ? 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800 shadow-inner'
                  : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100 border-transparent dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-gray-700'
                }`}
              title="เพิ่ม Issue ด้วยตัวเอง (ลากกรอบบน PDF)"
            >
              <FiEdit3 size={18} />
              {isDrawingMode && <span className="text-[10px] font-bold">โหมดวาดกรอบ</span>}
            </button>
          )}

          <ValidatorMarginDropdown
            activeMargins={activeMargins}
            setActiveMargins={setActiveMargins}
          />

          <button
            onClick={onNextIssue}
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-800 transition-all flex items-center gap-2 shrink-0"
            title="Skip to next error/warning page"
          >
            <span className="hidden sm:inline">Next Issue</span>
            <FiSkipForward />
          </button>
        </div>

        <div className="hidden md:block h-6 w-px bg-slate-200 dark:bg-gray-700 shrink-0"></div>

        {/* Zoom Controls */}
        <div className="flex items-center bg-slate-100 dark:bg-gray-700 rounded-lg p-1 border border-slate-200 dark:border-gray-600 shrink-0">
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 0.5}
            className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm rounded-md transition-all text-slate-500 dark:text-gray-400 disabled:opacity-30"
          >
            <FiZoomOut size={16} />
          </button>
          <span className="text-xs font-mono px-1 w-12 text-center select-none text-slate-600 dark:text-gray-300">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 3}
            className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm rounded-md transition-all text-slate-500 dark:text-gray-400 disabled:opacity-30"
          >
            <FiZoomIn size={16} />
          </button>
        </div>

        {/* กลุ่มที่ 2: เปลี่ยนหน้า (Pagination) */}
        <div className="flex items-center bg-slate-100 dark:bg-gray-700 rounded-lg p-1 border border-slate-200 dark:border-gray-600 shrink-0">
          <button
            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
            disabled={pageNumber <= 1}
            className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm rounded-md transition-all text-slate-500 dark:text-gray-400 disabled:opacity-30"
          >
            <FiChevronLeft size={16} />
          </button>
          <span className="text-xs font-mono px-2 md:px-4 w-auto md:w-24 text-center select-none text-slate-600 dark:text-gray-300">
            <span className="hidden sm:inline">Page </span>
            <span className="font-bold text-slate-800 dark:text-white">{pageNumber}</span>
            <span className="text-slate-400 dark:text-gray-500"> / {numPages || "-"}</span>
          </span>
          <button
            onClick={() => setPageNumber(Math.min(numPages || 1, pageNumber + 1))}
            disabled={!numPages || pageNumber >= numPages}
            className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm rounded-md transition-all text-slate-500 dark:text-gray-400 disabled:opacity-30"
          >
            <FiChevronRight size={16} />
          </button>
        </div>

        {/* กลุ่มที่ 3: ปุ่ม Action ต่างๆ (บันทึก, ดาวน์โหลด, ปิดหน้าต่าง) */}
        <div className="flex items-center gap-2 shrink-0">
          {onSaveToServer && resolvedCount > 0 && (
            <button
              onClick={onSaveToServer}
              disabled={isSaving}
              className="px-3 md:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-md flex items-center gap-2 animate-in fade-in zoom-in duration-300"
            >
              {isSaving ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FiCheckCircle size={14} className="flex-shrink-0" />
              )}
              <span className="hidden sm:inline">Submit Review</span>
              <span className="bg-indigo-500 text-[10px] px-1.5 py-0.5 rounded-full">
                {resolvedCount}
              </span>
            </button>
          )}

          <ExportPDFButton
            pdfUrl={pdfUrl}
            fileName={fileName}
            issues={issues}
          />

          {onDownloadReport && (
            <button
              onClick={onDownloadReport}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Export CSV"
            >
              <FiDownload size={20} />
            </button>
          )}

          {/* ปุ่ม Close แสดงเฉพาะบน Desktop */}
          <button
            onClick={onClose}
            className="hidden md:block ml-1 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
            title="Close Validator"
          >
            <FiX size={22} />
          </button>
        </div>

      </div>
    </div>
  );
};