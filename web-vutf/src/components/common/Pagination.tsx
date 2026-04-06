// src/components/common/Pagination.tsx
import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface MetaData {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
}

interface PaginationProps {
    meta: MetaData;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange }) => {
    if (!meta || meta.total === 0) return null;

    const startEntry = (meta.page - 1) * meta.limit + 1;
    const endEntry = Math.min(meta.page * meta.limit, meta.total);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-xl gap-4">

            {/* ส่วนแสดงข้อมูลด้านซ้าย */}
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                แสดง {startEntry} ถึง {endEntry} จากทั้งหมด {meta.total} รายการ
            </div>

            {/* ส่วนควบคุมด้านขวา */}
            <div className="flex items-center gap-4">

                {/* ปุ่มย้อนกลับ (<) */}
                <button
                    onClick={() => onPageChange(meta.page - 1)}
                    disabled={meta.page === 1}
                    className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 
    hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 
    dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 dark:hover:border-indigo-700 
    disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:hover:border-gray-200
    transition-all duration-200"
                    title="หน้าก่อนหน้า"
                >
                    <FiChevronLeft size={20} />
                </button>

                {/* ตัวเลขบอกหน้า (หน้า 1 / 1) */}
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 min-w-[80px] text-center">
                    หน้า {meta.page} / {meta.lastPage}
                </span>

                {/* ปุ่มถัดไป (>) */}
                <button
                    onClick={() => onPageChange(meta.page + 1)}
                    disabled={meta.page === meta.lastPage}
                    className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 
    hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 
    dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 dark:hover:border-indigo-700
    disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:hover:border-gray-200
    transition-all duration-200"
                    title="หน้าถัดไป"
                >
                    <FiChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};