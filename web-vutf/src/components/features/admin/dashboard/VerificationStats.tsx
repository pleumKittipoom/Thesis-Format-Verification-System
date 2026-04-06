// src/components/features/admin/dashboard/VerificationStats.tsx
import React, { useState } from 'react';
import {
    FiPieChart, FiServer, FiTrendingUp, FiFile, FiZap, FiFilter,
    FiTrendingDown, FiMinus, FiAlertCircle, FiCheckCircle
} from 'react-icons/fi';
import { IVerificationStats } from '../../../../types/dashboard.types';

interface Props {
    data: IVerificationStats | null;
    onFilterChange?: (filter: { academicYear?: number; term?: number }) => void;
}

// สร้าง Component กราฟวงแหวน (Donut Chart) ด้วย SVG แบบไม่ต้องลงไลบรารีเพิ่ม
const CircularProgress = ({ percentage, color, label }: { percentage: number, color: string, label: string }) => {
    return (
        <div className="relative flex items-center justify-center w-28 h-28">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Background Circle */}
                <circle
                    cx="18" cy="18" r="15.91549430918954"
                    fill="transparent"
                    className="stroke-gray-100 dark:stroke-gray-700"
                    strokeWidth="3.5"
                />
                {/* Progress Circle */}
                <circle
                    cx="18" cy="18" r="15.91549430918954"
                    fill="transparent"
                    className={`${color} transition-all duration-1000 ease-out`}
                    strokeWidth="3.5"
                    strokeDasharray="100"
                    strokeDashoffset={100 - percentage}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-gray-800 dark:text-white leading-none">{percentage}%</span>
                <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{label}</span>
            </div>
        </div>
    );
};

export const VerificationStats: React.FC<Props> = ({ data, onFilterChange }) => {
    const [academicYear, setAcademicYear] = useState<string>('');
    const [term, setTerm] = useState<string>('');

    const handleFilterChange = (type: 'year' | 'term', value: string) => {
        let newYear = academicYear;
        let newTerm = term;

        if (type === 'year') {
            setAcademicYear(value);
            newYear = value;
        } else {
            setTerm(value);
            newTerm = value;
        }

        if (onFilterChange) {
            onFilterChange({
                academicYear: newYear ? Number(newYear) : undefined,
                term: newTerm ? Number(newTerm) : undefined,
            });
        }
    };

    const getPerformanceBadge = (percentage: number) => {
        if (percentage >= 85) {
            return {
                text: 'Excellent',
                icon: <FiTrendingUp size={14} />,
                colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800'
            };
        } else if (percentage >= 60) {
            return {
                text: 'Fair',
                icon: <FiCheckCircle size={14} />,
                colorClass: 'text-blue-600 bg-blue-50 border-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800'
            };
        } else if (percentage >= 40) {
            return {
                text: 'Needs Improvement',
                icon: <FiAlertCircle size={14} />,
                colorClass: 'text-amber-600 bg-amber-50 border-amber-100 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-800'
            };
        } else {
            return {
                text: 'High Difficulty',
                icon: <FiTrendingDown size={14} />,
                colorClass: 'text-red-600 bg-red-50 border-red-100 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800'
            };
        }
    };

    const r1Stats = data?.firstPassRate;
    const r2Stats = data?.secondPassRate;

    const r1Badge = getPerformanceBadge(r1Stats?.percentage || 0);
    const r2Badge = getPerformanceBadge(r2Stats?.percentage || 0);

    return (
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm transition-colors flex flex-col border border-gray-100 dark:border-gray-700">

            {/* --- Header & Filter Section --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-50 dark:border-gray-700/50 pb-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <FiPieChart className="text-indigo-500" /> Verification Success Rate
                    </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                        <FiFilter className="text-gray-400 dark:text-gray-400 ml-2" size={14} />
                        <select
                            value={academicYear}
                            onChange={(e) => handleFilterChange('year', e.target.value)}
                            className="text-xs bg-transparent border-none text-gray-700 dark:text-gray-200 outline-none cursor-pointer focus:ring-0"
                        >
                            <option value="" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">All Years</option>
                            <option value="2569" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">2569</option>
                            <option value="2568" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">2568</option>
                            <option value="2567" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">2567</option>
                        </select>

                        <span className="text-gray-300 dark:text-gray-600">|</span>

                        <select
                            value={term}
                            onChange={(e) => handleFilterChange('term', e.target.value)}
                            className="text-xs bg-transparent border-none text-gray-700 dark:text-gray-200 outline-none cursor-pointer focus:ring-0 pr-2"
                        >
                            <option value="" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">All Terms</option>
                            <option value="1" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">Term 1</option>
                            <option value="2" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">Term 2</option>
                            <option value="3" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">Term 3</option>
                        </select>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/30 dark:border-blue-800 transition-colors">
                        <FiServer />
                        <span className="font-medium">{data?.storageUsed?.text || 'Storage: 0% Used'}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">

                {/* --- 1. R1 Rate Card --- */}
                <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 flex flex-col justify-center hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-1">Round 1 (First Pass)</h3>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Initial document submission</p>

                            {/* สัดส่วน (ผ่าน/ทั้งหมด) และ Badge */}
                            <div className="space-y-3">
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-bold text-gray-800 dark:text-white leading-none">
                                        {r1Stats?.passed || 0}
                                    </span>
                                    <span className="text-sm font-medium text-gray-400 mb-0.5">
                                        / {r1Stats?.total || 0} files
                                    </span>
                                </div>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.25 rounded-md text-[11px] font-bold border ${r1Badge.colorClass}`}>
                                    {r1Badge.icon} {r1Badge.text}
                                </span>
                            </div>
                        </div>

                        {/* กราฟวงแหวน R1 */}
                        <div className="flex-shrink-0 ml-4">
                            <CircularProgress percentage={r1Stats?.percentage || 0} color="stroke-indigo-500" label="Pass Rate" />
                        </div>
                    </div>
                </div>

                {/* --- 2. R2 Rate Card --- */}
                <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/50 flex flex-col justify-center hover:border-purple-300 dark:hover:border-purple-700 transition-colors group">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-1">Round 2 (Revision)</h3>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">After instructor feedback</p>

                            {/* สัดส่วน (ผ่าน/ทั้งหมด) และ Badge */}
                            <div className="space-y-3">
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-bold text-gray-800 dark:text-white leading-none">
                                        {r2Stats?.passed || 0}
                                    </span>
                                    <span className="text-sm font-medium text-gray-400 mb-0.5">
                                        / {r2Stats?.total || 0} files
                                    </span>
                                </div>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.25 rounded-md text-[11px] font-bold border ${r2Badge.colorClass}`}>
                                    {r2Badge.icon} {r2Badge.text}
                                </span>
                            </div>
                        </div>

                        {/* กราฟวงแหวน R2 */}
                        <div className="flex-shrink-0 ml-4">
                            <CircularProgress percentage={r2Stats?.percentage || 0} color="stroke-purple-500" label="Pass Rate" />
                        </div>
                    </div>
                </div>

                {/* --- Total Files & Speed --- */}
                <div className="md:col-span-2 bg-gray-50 dark:bg-gray-900/30 rounded-2xl p-4 flex items-center justify-between border border-gray-100 dark:border-gray-700 shadow-sm mt-auto">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-xl text-blue-600 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-gray-700">
                            <FiFile size={22} />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5 uppercase tracking-wider">Total Evaluated</p>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">
                                {data?.totalFilesProcessed?.toLocaleString() || 0}
                                <span className="text-xs font-normal text-gray-400 ml-1.5 lowercase">files</span>
                            </h3>
                        </div>
                    </div>
                    <div className="text-right pl-6 border-l border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            <FiZap className="text-amber-500" size={12} /> Avg. Speed
                        </div>
                        <p className="text-lg font-bold text-gray-800 dark:text-white font-mono">{data?.avgSpeed || '0s'}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};