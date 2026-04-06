// src/components/shared/thesis-validator/ValidatorIssueList.tsx
import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotateLeft,
  faCheckDouble,
  faMagnifyingGlass,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

// Interface สำหรับ Issue
export interface Issue {
  id: number;
  page: number;
  code: string;
  severity: string;
  message: string;
  bbox: number[] | null;
  isIgnored: boolean;
}

interface Props {
  pageNumber: number;
  currentPageIssues: Issue[];
  handleTogglePageIgnore: () => void;
  toggleIssueStatus: (id: number) => void;
  isReadOnly?: boolean;
}

export const ValidatorIssueList: React.FC<Props> = ({
  pageNumber,
  currentPageIssues,
  handleTogglePageIgnore,
  toggleIssueStatus,
  isReadOnly = false
}) => {
  return (
    <>
      {/* Issue List Header */}
      {/* ลด Padding บนมือถือ */}
      <div className="px-4 py-3 md:px-6 md:py-4 bg-slate-50/50 dark:bg-gray-800/50 border-b border-slate-100 dark:border-gray-700 flex justify-between items-center sticky top-0 z-10 shrink-0">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-gray-200">Page {pageNumber}</h3>
          <span className="text-[10px] text-slate-400 dark:text-gray-500">
            {currentPageIssues.length} issues found
          </span>
        </div>

        {currentPageIssues.length > 0 && !isReadOnly && (
          <button
            onClick={handleTogglePageIgnore}
            className={`text-[9px] md:text-[10px] font-bold px-2.5 md:px-3 py-1 md:py-1.5 rounded-full border transition-all flex items-center gap-1 md:gap-1.5
                        ${
                          currentPageIssues.every((i) => i.isIgnored)
                            ? "bg-slate-200 dark:bg-gray-700 text-slate-500 dark:text-gray-400 border-slate-300 dark:border-gray-600 hover:bg-slate-300 dark:hover:bg-gray-600"
                            : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                        }`}
          >
            <FontAwesomeIcon
              icon={
                currentPageIssues.every((i) => i.isIgnored)
                  ? faRotateLeft
                  : faCheckDouble
              }
            />
            {currentPageIssues.every((i) => i.isIgnored)
              ? "Undo All"
              : "Resolve All"}
          </button>
        )}
      </div>

      {/* Issue List Content */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3 bg-slate-50/30 dark:bg-gray-900/30 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-gray-700">
        {currentPageIssues.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-gray-600 gap-3 md:gap-4 pb-4">
            {/* ย่อขนาดไอคอนบนมือถือ */}
            <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="text-xl md:text-2xl text-slate-200 dark:text-gray-600"
              />
            </div>
            <span className="text-[11px] md:text-xs font-medium">
              No issues found on this page
            </span>
          </div>
        ) : (
          currentPageIssues.map((issue) => (
            <div
              key={issue.id}
              onClick={() => !isReadOnly && toggleIssueStatus(issue.id)}
              // ลด Padding ภายในการ์ดบนมือถือ
              className={`group p-3 md:p-4 rounded-xl border transition-all duration-200 relative select-none
                            ${
                              issue.isIgnored
                                ? "bg-slate-50 dark:bg-gray-800 border-slate-200 dark:border-gray-700 opacity-60"
                                : "bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-500 hover:-translate-y-0.5"
                            }
                            ${isReadOnly ? "cursor-default" : "cursor-pointer hover:-translate-y-0.5"}
                        `}
            >
              <div className="flex justify-between items-start mb-1.5 md:mb-2">
                <span
                  className={`font-bold tracking-wider px-2 py-0.5 rounded text-[8px] md:text-[9px] uppercase border
                                ${
                                  issue.severity === "error"
                                    ? "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800"
                                    : "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800"
                                }
                            `}
                >
                  {issue.code}
                </span>
                {issue.isIgnored && (
                  <span className="text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50 p-1 rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                    <FontAwesomeIcon icon={faCheck} size="xs" />
                  </span>
                )}
              </div>

              <p
                className={`text-[11px] md:text-xs leading-relaxed ${
                  issue.isIgnored
                    ? "text-slate-400 dark:text-gray-500 line-through decoration-slate-300 dark:decoration-gray-600"
                    : "text-slate-600 dark:text-gray-300"
                }`}
              >
                {issue.message}
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
};