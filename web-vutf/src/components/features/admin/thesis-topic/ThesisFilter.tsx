import { useEffect } from 'react';
import { FiSearch, FiCalendar, FiFilter, FiX, FiCheckCircle, FiClock, FiChevronDown } from 'react-icons/fi';

interface ThesisFilterProps {
    keyword: string;
    setKeyword: (value: string) => void;

    academicYear: number | '';
    setAcademicYear: (value: number | '') => void;

    term: number | '';
    setTerm: (value: number | '') => void;

    activeTab: 'requests' | 'active';
    statusFilter: string;
    setStatusFilter: (value: string) => void;

    defaultYear?: number;
    defaultTerm?: number;
}

export const ThesisFilter = ({
    keyword,
    setKeyword,
    academicYear,
    setAcademicYear,
    term,
    setTerm,
    activeTab,
    statusFilter,
    setStatusFilter,
    defaultYear,
    defaultTerm
}: ThesisFilterProps) => {

    const currentYear = new Date().getFullYear() + 543;
    const years = Array.from({ length: 6 }, (_, i) => currentYear - i + 1);

    // Logic เช็คว่ามีการเปลี่ยนค่าไปจาก Default หรือไม่
    const isAcademicYearChanged = defaultYear ? academicYear !== defaultYear : academicYear !== '';
    const isTermChanged = defaultTerm ? term !== defaultTerm : term !== '';
    const isFilterActive = isAcademicYearChanged || isTermChanged || statusFilter !== '' || keyword !== '';

    // Logic เช็คว่าเป็นโหมด "ดูทั้งหมด" (ไม่กรองปี/เทอม) หรือยัง
    // ถ้าทั้งปีและเทอมเป็นค่าว่าง แสดงว่ากำลังดูทั้งหมดอยู่
    const isShowingAllYears = academicYear === '' && term === '';

    const handleClearFilter = () => {
        setAcademicYear(defaultYear || '');
        setTerm(defaultTerm || '');
        setKeyword('');
        setStatusFilter('');
    };

    const handleShowLatestAll = () => {
        setAcademicYear(''); // เคลียร์ปี
        setTerm('');         // เคลียร์เทอม
        // ไม่ต้องเคลียร์ status หรือ keyword เผื่อ admin อยากค้นหาชื่อในทุกปี
    };

    return (
        <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">

            {/* 1. Search Bar */}
            <div className="relative w-full xl:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400 dark:text-gray-500" />
                </div>
                <input
                    type="text"
                    placeholder="ค้นหาชื่อหรือรหัสวิทยานิพนธ์"
                    className="block w-full pl-10 pr-3 py-2.5 text-gray-600 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-xl leading-5 bg-gray-50 dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/40 focus:border-blue-500 dark:focus:border-blue-500 transition-all sm:text-sm"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>

            {/* 2. Filters Group */}
            <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">

                {/* Dropdown: สถานะ */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
                        <FiCheckCircle size={16} />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="pl-9 pr-8 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer min-w-[140px]"
                    >
                        <option value="">ทุกสถานะ</option>
                        {activeTab === 'requests' ? (
                            <>
                                <option value="incomplete">สมาชิกไม่ครบ (Incomplete)</option>
                                <option value="pending">รออนุมัติ (Pending)</option>
                                <option value="approved">อนุมัติแล้ว (Approved)</option>
                                <option value="rejected">ปฏิเสธ (Rejected)</option>
                            </>
                        ) : (
                            <>
                                <option value="IN_PROGRESS">กำลังทำ (In Progress)</option>
                                <option value="PASSED">สอบผ่าน (Passed)</option>
                                <option value="FAILED">ไม่ผ่าน (Failed)</option>
                            </>
                        )}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                        <FiFilter size={12} />
                    </div>
                </div>

                {/* Dropdown: ปีการศึกษา */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
                        <FiCalendar size={16} />
                    </div>
                    <select
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value ? Number(e.target.value) : '')}
                        className="pl-9 pr-8 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer min-w-[130px]"
                    >
                        <option value="">ทุกปี</option>
                        {years.map((y) => (
                            <option key={y} value={y}>ปี {y}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                        <FiChevronDown size={12} />
                    </div>
                </div>

                {/* Dropdown: ภาคเรียน */}
                <div className="relative">
                    <select
                        value={term}
                        onChange={(e) => setTerm(e.target.value ? Number(e.target.value) : '')}
                        className="pl-4 pr-8 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                    >
                        <option value="">ทุกเทอม</option>
                        <option value="1">เทอม 1</option>
                        <option value="2">เทอม 2</option>
                        <option value="3">ฤดูร้อน</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                        <FiChevronDown size={12} />
                    </div>
                </div>

                {/* ปุ่ม แสดงรายการล่าสุดทั้งหมด */}
                {!isShowingAllYears && (
                    <button
                        onClick={handleShowLatestAll}
                        className="flex items-center gap-1 px-3 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-900/30 rounded-xl transition-colors cursor-pointer"
                        title="แสดงรายการล่าสุดทั้งหมด โดยไม่กรองปีและเทอม (เผื่อนักศึกษากรอกปีผิด)"
                    >
                        <FiClock size={16} />
                        <span className="hidden sm:inline">ล่าสุด</span>
                    </button>
                )}

                {/* ปุ่ม Clear Filter (จะแสดงเมื่อมีการ Filter ใดๆ) */}
                {isFilterActive && (
                    <button
                        onClick={handleClearFilter}
                        className="flex items-center gap-1 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-100 dark:border-red-900/30 rounded-xl transition-colors ml-auto xl:ml-0 cursor-pointer"
                        title="รีเซ็ตตัวกรองเป็นค่าเริ่มต้น"
                    >
                        <FiX size={16} />
                        <span className="hidden sm:inline">รีเซ็ต</span>
                    </button>
                )}
            </div>
        </div>
    );
};