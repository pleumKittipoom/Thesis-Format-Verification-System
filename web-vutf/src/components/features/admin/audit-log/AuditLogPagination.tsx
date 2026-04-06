import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export const AuditLogPagination = ({ meta, onPageChange }: { meta: any, onPageChange: (page: number) => void }) => {
    if (!meta) return null;

    // ดึงค่าจาก meta ที่ Backend ส่งมา
    const { currentPage = 1, itemsPerPage = 20, totalItems = 0, totalPages = 1 } = meta;

    // คำนวณตัวเลขสำหรับแสดงผล
    const startEntry = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endEntry = Math.min(currentPage * itemsPerPage, totalItems);
    const safeTotalPages = Math.max(totalPages, 1);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between w-full mt-4 px-6 py-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            
            {/* ข้อความด้านซ้าย */}
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
                แสดง {startEntry} ถึง {endEntry} จากทั้งหมด {totalItems} รายการ
            </div>

            {/* ปุ่มควบคุมด้านขวา */}
            <div className="flex items-center gap-2">
                {/* ปุ่ม < */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="p-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <FiChevronLeft size={18} />
                </button>

                {/* ข้อความ หน้า X/Y */}
                <span className="text-sm font-bold text-gray-800 dark:text-white min-w-[70px] text-center">
                    หน้า {currentPage}/{safeTotalPages}
                </span>

                {/* ปุ่ม > */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= safeTotalPages}
                    className="p-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <FiChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};