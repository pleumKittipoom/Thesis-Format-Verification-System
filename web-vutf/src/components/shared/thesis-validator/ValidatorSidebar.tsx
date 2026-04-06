// src/components/shared/thesis-validator/ValidatorSidebar.tsx
import React, { useState } from 'react';
import { ValidatorDocumentMap } from './ValidatorDocumentMap';
import { ValidatorIssueList, Issue } from './ValidatorIssueList';
import { FiChevronRight, FiChevronLeft, FiChevronUp } from 'react-icons/fi';

interface Props {
  numPages: number | null;
  pageNumber: number;
  setPageNumber: (page: number) => void;
  issues: Issue[];  
  currentPageIssues: Issue[];
  onToggleIgnore: (id: number) => void;
  isReadOnly?: boolean;
}

export const ValidatorSidebar: React.FC<Props> = ({
  numPages,
  pageNumber,
  setPageNumber,
  issues,
  currentPageIssues,
  onToggleIgnore,
  isReadOnly = false
}) => {

  const [isOpen, setIsOpen] = useState(true);

  const getPageColorClass = (p: number) => {
    const pageIssues = issues.filter((i) => i.page === p);
    if (pageIssues.length === 0) 
        return "bg-white dark:bg-gray-800 text-slate-400 dark:text-gray-500 border-slate-200 dark:border-gray-700 hover:border-slate-400 dark:hover:border-gray-500";

    const active = pageIssues.filter((i) => !i.isIgnored);
    if (active.some((i) => i.severity === "error")) 
        return "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/50";
    if (active.some((i) => i.severity === "warning")) 
        return "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50";

    return "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50";
  };

  const handleTogglePageIgnore = () => {
    const hasActive = currentPageIssues.some((i) => !i.isIgnored);
    currentPageIssues.forEach(issue => {
        if (issue.isIgnored !== hasActive) {
            onToggleIgnore(issue.id);
        }
    });
  };

  return (
    <div 
      className={`relative z-20 shrink-0 flex flex-col bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out
        ${isOpen 
            ? 'w-full md:w-96 h-[45vh] md:h-full border-t md:border-t-0 md:border-l border-slate-200 dark:border-gray-700 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] md:shadow-[0_0_20px_rgba(0,0,0,0.03)]' 
            : 'w-full md:w-0 h-0 md:h-full border-transparent'
        }
      `}
    >
      {/* 1. ปุ่ม Toggle สำหรับ Desktop (แสดงแนวตั้งด้านซ้าย) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:flex absolute top-1/2 -left-6 -translate-y-1/2 w-6 h-16 bg-white dark:bg-gray-800 border-y border-l border-slate-200 dark:border-gray-700 rounded-l-md items-center justify-center text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-[-2px_0_5px_rgba(0,0,0,0.05)] z-30 outline-none"
        title={isOpen ? "ซ่อนแถบด้านข้าง (Focus Mode)" : "แสดงแถบด้านข้าง"}
      >
        {isOpen ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
      </button>

      {/* 2. ปุ่ม Toggle สำหรับ Mobile (แสดงแนวนอนด้านบน) */}
      {!isOpen && (
        <button
            onClick={() => setIsOpen(true)}
            className="flex md:hidden absolute -top-12 left-1/2 -translate-x-1/2 h-9 px-5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-slate-200 dark:border-gray-600 rounded-full items-center justify-center text-slate-600 dark:text-gray-300 shadow-[0_4px_12px_rgba(0,0,0,0.1)] text-xs font-bold gap-2 z-50 outline-none transition-transform active:scale-95"
        >
            <FiChevronUp size={16} /> แสดงรายการ
        </button>
      )}

      {/* 3. กล่องห่อหุ้มเนื้อหา (เพื่อซ่อนเนื้อหาไม่ให้ล้นตอนกำลังพับ) */}
      <div className={`w-full h-full flex flex-col overflow-hidden transition-opacity duration-200 
        ${isOpen ? 'opacity-100 delay-100' : 'opacity-0'}
      `}>
        {/* กล่องเนื้อหาขนาดคงที่ (ป้องกันตัวหนังสือเบียดกันตอนกำลังหดตัว) */}
        <div className="w-full md:w-96 h-[45vh] md:h-full flex flex-col shrink-0">
          <ValidatorDocumentMap
            numPages={numPages}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            getPageColorClass={getPageColorClass}
            issues={issues}
            onCloseSidebar={() => setIsOpen(false)}
          />
          <ValidatorIssueList
            pageNumber={pageNumber}
            currentPageIssues={currentPageIssues}
            handleTogglePageIgnore={handleTogglePageIgnore}
            toggleIssueStatus={onToggleIgnore}
            isReadOnly={isReadOnly}
          />
        </div>
      </div>
    </div>
  );
};