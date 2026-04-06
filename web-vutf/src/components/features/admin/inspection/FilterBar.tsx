import { FiFilter, FiRefreshCw } from 'react-icons/fi';

interface FilterState {
    academicYear: string;
    term: string;
    roundNumber: string;
    courseType: string;
}

interface FilterBarProps {
    filters: FilterState;
    onChange: (key: keyof FilterState, value: string) => void;
    onClear: () => void;
    availableYears: string[];
}

export const FilterBar = ({ filters, onChange, onClear, availableYears }: FilterBarProps) => {
    // Shared class for selects to ensure consistency in dark mode
    const selectClass = "border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm text-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 bg-white dark:bg-gray-700 cursor-pointer hover:border-blue-300 dark:hover:border-blue-500 transition-colors";
    const labelClass = "text-sm text-gray-600 dark:text-gray-300 font-medium";

    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm mb-6 flex flex-wrap gap-5 items-end animate-in slide-in-from-top-2 duration-200 transition-colors">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-bold mb-1 w-full sm:w-auto">
                <FiFilter className="text-blue-600 dark:text-blue-400" /> ตัวกรอง:
            </div>

            {/* ปีการศึกษา */}
            <div className="flex flex-col gap-2">
                <label className={labelClass}>ปีการศึกษา</label>
                <select
                    value={filters.academicYear}
                    onChange={(e) => onChange('academicYear', e.target.value)}
                    className={`${selectClass} w-32`}
                >
                    <option value="">ทั้งหมด</option>
                    {availableYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            {/* เทอม */}
            <div className="flex flex-col gap-2">
                <label className={labelClass}>เทอม</label>
                <select
                    value={filters.term}
                    onChange={(e) => onChange('term', e.target.value)}
                    className={`${selectClass} w-28`}
                >
                    <option value="">ทั้งหมด</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3 (Summer)</option>
                </select>
            </div>

            {/* รอบที่ */}
            <div className="flex flex-col gap-2">
                <label className={labelClass}>รอบที่</label>
                <select
                    value={filters.roundNumber}
                    onChange={(e) => onChange('roundNumber', e.target.value)}
                    className={`${selectClass} w-28`}
                >
                    <option value="">ทั้งหมด</option>
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
            </div>

            {/* ประเภทโครงงาน */}
            <div className="flex flex-col gap-2">
                <label className={labelClass}>ประเภทโครงงาน</label>
                <select
                    value={filters.courseType}
                    onChange={(e) => onChange('courseType', e.target.value)}
                    className={`${selectClass} w-48`}
                >
                    <option value="">ทั้งหมด</option>
                    <option value="ALL">All Types</option>
                    <option value="PRE_PROJECT">Pre-Project</option>
                    <option value="PROJECT">Project</option>
                </select>
            </div>

            {/* ปุ่มล้างค่า */}
            <button
                onClick={onClear}
                className="ml-auto px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
                <FiRefreshCw size={14} /> ล้างค่า
            </button>
        </div>
    );
};