// src/components/features/instructor/SubmissionFilters.tsx
import React from 'react';
import {
    FiSearch, FiFilter, FiRefreshCw, FiChevronDown,
    FiCalendar, FiClock, FiLayers, FiBook, FiActivity, FiCheckCircle, FiGrid
} from 'react-icons/fi';
import { SubmissionFilterParams } from '../../../types/submission';


interface Props {
    filters: SubmissionFilterParams;
    onChange: (newFilters: Partial<SubmissionFilterParams>) => void;
}

export const SubmissionFilters: React.FC<Props> = ({ filters, onChange }) => {

    // --- Configuration ---

    // ตัวเลือกสำหรับ Tabs สถานะ
    const statusTabs = [
        { label: 'ทั้งหมด', value: undefined },
        { label: 'รอตรวจสอบ', value: 'PENDING' },
        { label: 'กำลังดำเนินการ', value: 'IN_PROGRESS' },
        { label: 'ตรวจเสร็จแล้ว', value: 'COMPLETED' },
    ];

    // ตัวเลือกสำหรับ Course Type
    const courseTypeOptions = [
        { label: 'Project', value: 'PROJECT' },
        { label: 'Pre-Project', value: 'PRE_PROJECT' },
    ];

    // --- Helper Component ---
    const FilterSelect = ({
        value,
        onChange,
        options,
        icon: Icon,
        placeholder
    }: {
        value: string | number | undefined;
        onChange: (val: string) => void;
        options: { label: string; value: string | number }[];
        icon: React.ElementType;
        placeholder: string;
    }) => (
        <div className="relative group w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors pointer-events-none">
                <Icon />
            </div>
            <select
                className="w-full pl-10 pr-8 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded-lg 
                   focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 outline-none 
                   appearance-none transition-all cursor-pointer hover:border-blue-300 dark:hover:border-blue-500 truncate"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="" className="dark:bg-gray-800">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="dark:bg-gray-800">
                        {opt.label}
                    </option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                <FiChevronDown />
            </div>
        </div>
    );

    const currentYear = new Date().getFullYear() + 543; // แปลงเป็น พ.ศ. ปัจจุบัน
    const startYear = 2567;      // ปีเริ่มต้นที่ต้องการ
    const endYear = currentYear + 1; // ปีปัจจุบัน + 1

    const academicYearOptions = [];
    // วนลูปจากปีใหม่สุด (endYear) ลงมาหาปีเก่าสุด (startYear)
    for (let y = endYear; y >= startYear; y--) {
        academicYearOptions.push({ label: String(y), value: String(y) });
    }

    return (
        <div className="flex flex-col gap-6 mb-8">

            {/* Status Tabs (Modern Pills Style) */}
            <div className="flex flex-wrap items-center gap-3 animate-enter-up">
                {statusTabs.map((tab) => {
                    const isActive = filters.status === tab.value;

                    // Map icons ให้แต่ละ Tab
                    let Icon = FiGrid;
                    if (tab.value === 'PENDING') Icon = FiClock;
                    if (tab.value === 'IN_PROGRESS') Icon = FiActivity;
                    if (tab.value === 'COMPLETED') Icon = FiCheckCircle;

                    return (
                        <button
                            key={tab.label}
                            onClick={() => onChange({ status: tab.value as any, page: 1 })}
                            className={`
                    flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-200 border
                    ${isActive
                                    ? 'bg-blue-600 dark:bg-blue-600 text-white border-transparent shadow-md shadow-blue-200 dark:shadow-none translate-y-[-1px]'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                }
                `}
                        >
                            <Icon size={16} className={isActive ? 'text-blue-100' : 'text-gray-400 dark:text-gray-500'} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Filter Card */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col lg:flex-row gap-5 items-start lg:items-center justify-between transition-all hover:shadow-md animate-enter-down">

                {/* Search Section */}
                <div className="w-full lg:w-[300px] xl:w-[400px]">
                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors">
                            <FiSearch size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อ, รหัส, หรือชื่อ นศ..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700
                         focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 dark:focus:ring-blue-900/30
                         transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                            value={filters.search || ''}
                            onChange={(e) => onChange({ search: e.target.value, page: 1 })}
                        />
                    </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px h-10 bg-gray-100 dark:bg-gray-700 mx-2"></div>

                {/* Filters Group */}
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-stretch flex-1 justify-end flex-wrap xl:flex-nowrap">

                    <div className="lg:hidden flex items-center gap-2 mb-1 w-full">
                        <FiFilter className="text-blue-500 dark:text-blue-400" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">ตัวกรองข้อมูล</span>
                    </div>

                    {/* Course Type Filter */}
                    <div className="w-full sm:w-auto sm:min-w-[150px]">
                        <FilterSelect
                            icon={FiBook}
                            placeholder="ทุกประเภทวิชา"
                            value={filters.courseType}
                            onChange={(val) => onChange({ courseType: val as any, page: 1 })}
                            options={courseTypeOptions}
                        />
                    </div>

                    {/* Year Filter */}
                    <div className="w-full sm:w-auto sm:min-w-[140px]">
                        <FilterSelect
                            icon={FiCalendar}
                            placeholder="ทุกปี"
                            value={filters.academicYear}
                            onChange={(val) => onChange({ academicYear: val, page: 1 })}
                            options={academicYearOptions}
                        />
                    </div>

                    {/* Term Filter */}
                    <div className="w-full sm:w-auto sm:min-w-[120px]">
                        <FilterSelect
                            icon={FiClock}
                            placeholder="ทุกเทอม"
                            value={filters.term}
                            onChange={(val) => onChange({ term: val, page: 1 })}
                            options={[
                                { label: 'เทอม 1', value: '1' },
                                { label: 'เทอม 2', value: '2' },
                                { label: 'เทอม 3 (Summer)', value: '3' },
                            ]}
                        />
                    </div>

                    {/* Round Filter */}
                    <div className="w-full sm:w-auto sm:min-w-[150px]">
                        <FilterSelect
                            icon={FiLayers}
                            placeholder="ทุกรอบ"
                            value={filters.round}
                            onChange={(val) => onChange({ round: Number(val) || undefined, page: 1 })}
                            options={[
                                { label: 'รอบที่ 1', value: 1 },
                                { label: 'รอบที่ 2', value: 2 },
                                { label: 'รอบที่ 3', value: 3 },
                                { label: 'รอบที่ 4', value: 4 },
                                { label: 'รอบที่ 5', value: 5 },
                            ]}
                        />
                    </div>

                    {/* Reset Button */}
                    <button
                        onClick={() => onChange({
                            search: '', academicYear: '', term: '',
                            round: undefined, courseType: undefined, status: undefined,
                            page: 1
                        })}
                        className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition-all flex items-center justify-center gap-2 group shrink-0"
                        title="ล้างค่าการค้นหา"
                    >
                        <FiRefreshCw className="group-hover:rotate-180 transition-transform duration-500" />
                        <span className="sm:hidden text-sm font-medium">ล้างค่า</span>
                    </button>
                </div>
            </div>
        </div>
    );
};