// src/components/features/admin/track/Pagination.tsx
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  limit,
  onPageChange
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-6 bg-white dark:bg-slate-800 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
      
      {/* ฝั่งข้อความบอกจำนวน */}
      <div className="text-sm text-slate-500 dark:text-slate-400">
        แสดง <span className="font-medium text-slate-700 dark:text-slate-200">{startItem}</span> ถึง{' '}
        <span className="font-medium text-slate-700 dark:text-slate-200">{endItem}</span> จากทั้งหมด{' '}
        <span className="font-medium text-slate-700 dark:text-slate-200">{totalItems}</span> รายการ
      </div>
      
      {/* ฝั่งปุ่มกด */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg border flex items-center justify-center transition-all duration-200 ${
            currentPage === 1 
              ? 'border-slate-100 text-slate-300 bg-slate-50 cursor-not-allowed dark:border-slate-700 dark:text-slate-600 dark:bg-slate-800/50' 
              : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
          }`}
          aria-label="หน้าก่อนหน้า"
        >
          <FiChevronLeft size={20} />
        </button>
        
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 px-4 py-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700 transition-colors duration-200">
          หน้า {currentPage} / {totalPages}
        </span>
        
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg border flex items-center justify-center transition-all duration-200 ${
            currentPage === totalPages 
              ? 'border-slate-100 text-slate-300 bg-slate-50 cursor-not-allowed dark:border-slate-700 dark:text-slate-600 dark:bg-slate-800/50' 
              : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
          }`}
          aria-label="หน้าถัดไป"
        >
          <FiChevronRight size={20} />
        </button>
      </div>
      
    </div>
  );
};