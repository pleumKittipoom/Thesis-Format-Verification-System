import React from 'react';
import { FiSearch, FiRefreshCw, FiCheckCircle, FiXCircle, FiFilter, FiCalendar, FiClock, FiLayers, FiChevronDown, FiBook } from 'react-icons/fi';
import { ReportFilterParams } from '@/types/report';

interface Props {
    filters: ReportFilterParams;
    onChange: (newFilters: Partial<ReportFilterParams>) => void;
}

export const ReportFilters: React.FC<Props> = ({ filters, onChange }) => {

    // --- Helper Component สำหรับ Dropdown ---
    const FilterSelect = ({
        value, onChange, options, icon: Icon, placeholder
    }: {
        value: string | number | undefined;
        onChange: (val: string) => void;
        options: { label: string; value: string | number }[];
        icon: React.ElementType;
        placeholder: string;
    }) => (
        <div className="relative group w-full sm:w-auto">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors pointer-events-none">
                <Icon size={16} />
            </div>
            <select
                className="w-full sm:w-auto pl-9 pr-8 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded-lg 
                   focus:ring-2 focus:ring-indigo-100 outline-none appearance-none transition-all cursor-pointer hover:border-indigo-300"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <FiChevronDown size={14} />
            </div>
        </div>
    );

    // --- Options ---
    const verificationTabs = [
        { label: 'ทั้งหมด', value: undefined },
        { label: 'ผ่านเกณฑ์', value: 'PASS', icon: FiCheckCircle },
        { label: 'ไม่ผ่านเกณฑ์', value: 'FAIL', icon: FiXCircle },
    ];

    const currentYear = new Date().getFullYear() + 543;
    const academicYearOptions = Array.from({ length: 5 }, (_, i) => ({
        label: String(currentYear - i), value: String(currentYear - i)
    }));

    return (
        <div className="flex flex-col gap-6 mb-8">
            {/* 1. System Verification Status Tabs */}
            <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">ผลการตรวจจากระบบ:</span>
                {verificationTabs.map((tab) => {
                    const isActive = filters.verificationStatus === tab.value;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.label}
                            onClick={() => onChange({ verificationStatus: tab.value as any, page: 1 })}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all border
                ${isActive
                                    ? 'bg-indigo-600 text-white border-transparent shadow-sm'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:text-indigo-600'
                                }`}
                        >
                            {Icon && <Icon size={14} className={isActive ? 'text-indigo-100' : 'text-gray-400'} />}
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* 2. Main Filters Bar */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">

                {/* Search Input */}
                <div className="relative w-full xl:w-96 shrink-0">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <FiSearch size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="ค้นหาชื่อโปรเจกต์, รหัสนักศึกษา..."
                        value={filters.search || ''}
                        onChange={(e) => onChange({ search: e.target.value, page: 1 })}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-gray-700 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all dark:text-white"
                    />
                </div>

                {/* Dropdowns Group */}
                <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">

                    {/* Course Type Filter */}
                    <FilterSelect
                        icon={FiBook}
                        placeholder="ทุกประเภทวิชา"
                        value={filters.courseType}
                        onChange={(val) => onChange({ courseType: val, page: 1 })}
                        options={[
                            { label: 'Project', value: 'PROJECT' },
                            { label: 'Pre-Project', value: 'PRE_PROJECT' },
                        ]}
                    />

                    {/* Academic Year */}
                    <FilterSelect
                        icon={FiCalendar} placeholder="ทุกปีการศึกษา"
                        value={filters.academicYear}
                        onChange={(val) => onChange({ academicYear: val, page: 1 })}
                        options={academicYearOptions}
                    />

                    {/* Term */}
                    <FilterSelect
                        icon={FiClock} placeholder="ทุกเทอม"
                        value={filters.term}
                        onChange={(val) => onChange({ term: val, page: 1 })}
                        options={[
                            { label: 'เทอม 1', value: '1' },
                            { label: 'เทอม 2', value: '2' },
                            { label: 'Summer', value: '3' },
                        ]}
                    />

                    {/* Round */}
                    <FilterSelect
                        icon={FiLayers} placeholder="ทุกรอบ"
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

                    {/* Review Status */}
                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-600 mx-1 hidden sm:block"></div>

                    <FilterSelect
                        icon={FiFilter} placeholder="สถานะการอนุมัติ (ทั้งหมด)"
                        value={filters.reviewStatus}
                        onChange={(val) => onChange({ reviewStatus: val as any, page: 1 })}
                        options={[
                            { label: 'รอดำเนินการ (Pending)', value: 'PENDING' },
                            { label: 'อนุมัติแล้ว (Passed)', value: 'PASSED' },
                            { label: 'ไม่อนุมัติ (Not Passed)', value: 'NOT_PASSED' },
                            { label: 'ต้องแก้ไข (Needs Revision)', value: 'NEEDS_REVISION' },
                        ]}
                    />

                    {/* Reset Button */}
                    <button
                        onClick={() => onChange({
                            search: '', verificationStatus: undefined, reviewStatus: undefined,
                            academicYear: '', term: '', round: undefined, page: 1
                        })}
                        className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition-all flex items-center justify-center gap-2 group shrink-0"
                        title="ล้างค่าตัวกรอง"
                    >
                        <FiRefreshCw className="group-hover:rotate-180 transition-transform duration-500" />
                        <span className="sm:hidden text-sm font-medium">ล้างค่า</span>
                    </button>
                </div>
            </div>
        </div>
    );
};