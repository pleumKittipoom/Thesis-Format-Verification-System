// src/components/shared/thesis-validator/ValidatorDocumentMap.tsx
import React, { useMemo } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleXmark,
    faTriangleExclamation,
    faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FiChevronDown } from 'react-icons/fi';

import { Issue } from './ValidatorIssueList';

interface Props {
    numPages: number | null;
    pageNumber: number;
    setPageNumber: (page: number) => void;
    getPageColorClass: (page: number) => string;
    issues: Issue[];
    onCloseSidebar?: () => void;
}

export const ValidatorDocumentMap: React.FC<Props> = ({
    numPages,
    pageNumber,
    setPageNumber,
    getPageColorClass,
    issues,
    onCloseSidebar,
}) => {

    // คำนวณจำนวนหน้าที่มีปัญหา (ที่ไม่ใช่ ignored)
    const { affectedPagesCount, totalIssuesCount } = useMemo(() => {
        const activeIssues = issues.filter(i => !i.isIgnored);
        const uniquePages = new Set(activeIssues.map(i => i.page));
        return {
            affectedPagesCount: uniquePages.size,
            totalIssuesCount: activeIssues.length // นับจำนวน issues ทั้งหมด
        };
    }, [issues]);

    return (
        <div className="p-3 md:p-6 border-b border-slate-100 dark:border-gray-700 shrink-0">
            <div className="flex justify-between items-center mb-2 md:mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-xs font-bold text-slate-400 dark:text-white uppercase tracking-wider">
                        Document Map
                    </h2>
                    {totalIssuesCount > 0 && (
                        <span className="bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                            {totalIssuesCount} Issues <span className="hidden sm:inline">in {affectedPagesCount} Pages</span>
                        </span>
                    )}
                </div>

                {/* ปุ่มซ่อนรายการ (แสดงเฉพาะบนมือถือ) */}
                {onCloseSidebar && (
                    <button
                        onClick={onCloseSidebar}
                        className="md:hidden flex items-center gap-1 text-[10px] font-medium px-2.5 py-1.5 bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 rounded-lg hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors shrink-0"
                    >
                        <FiChevronDown size={14} /> ซ่อนรายการ
                    </button>
                )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-8 p-1 md:p-2 gap-1 md:gap-1.5 max-h-[15vh] md:max-h-[25vh] overflow-y-auto pr-1 md:pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-gray-700">
                {numPages &&
                    Array.from(new Array(numPages), (_, i) => {
                        const p = i + 1;
                        return (
                            <button
                                key={p}
                                onClick={() => setPageNumber(p)}
                                className={`aspect-square rounded-[4px] text-[9px] md:text-[10px] font-medium transition-all border ${getPageColorClass(
                                    p
                                )} ${pageNumber === p
                                    ? "ring-2 ring-slate-800 dark:ring-gray-200 ring-offset-1 dark:ring-offset-gray-900 z-10"
                                    : "opacity-90 hover:opacity-100"
                                    }`}
                            >
                                {p}
                            </button>
                        );
                    })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-2.5 md:gap-4 mt-2 md:mt-4 justify-start text-[9px] md:text-[10px] font-medium text-slate-500 dark:text-gray-400 pt-2 md:pt-3">
                <span className="flex items-center gap-1 md:gap-1.5">
                    <FontAwesomeIcon icon={faCircleXmark} className="text-rose-500 dark:text-rose-400" />{" "}
                    Error
                </span>
                <span className="flex items-center gap-1 md:gap-1.5">
                    <FontAwesomeIcon
                        icon={faTriangleExclamation}
                        className="text-amber-400 dark:text-amber-300"
                    />{" "}
                    Warn
                </span>
                <span className="flex items-center gap-1 md:gap-1.5">
                    <FontAwesomeIcon icon={faCircleCheck} className="text-blue-500 dark:text-blue-400" />{" "}
                    Resolved
                </span>
            </div>
        </div>
    );
};