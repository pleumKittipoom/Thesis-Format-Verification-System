// src/components/features/instructor/InspectionRoundHeader.tsx
import React from 'react';
import { FiCalendar, FiClock, FiInfo, FiLayers, FiFilter } from 'react-icons/fi';

export interface HeaderInfo {
    title: string;
    description: string;
    courseType?: string;
    startDate?: string;
    endDate?: string;
    isGeneric?: boolean;
}

interface Props {
    info?: HeaderInfo | null;
}

export const InspectionRoundHeader: React.FC<Props> = ({ info }) => {
    if (!info) return null;

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('th-TH', {
            day: 'numeric', month: 'long', year: 'numeric'
        });

    // Helper Function
    const getBadgeStyle = (type?: string) => {
        // ใช้ toUpperCase() เผื่อค่าที่ส่งมาเป็นตัวเล็ก
        const normalizedType = type?.toUpperCase();

        switch (normalizedType) {
            case 'PROJECT':
                return {
                    style: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
                    label: 'Project',
                    bgDecoration: 'bg-indigo-500 dark:bg-indigo-600'
                };
            case 'PRE_PROJECT':
                return {
                    style: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
                    label: 'Pre-Project',
                    bgDecoration: 'bg-orange-500 dark:bg-orange-600'
                };
            default:
                return {
                    style: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
                    label: 'All Courses',
                    bgDecoration: 'bg-purple-400 dark:bg-purple-500'
                };
        }
    };

    const badge = getBadgeStyle(info.courseType);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-sm border border-indigo-50 dark:border-gray-700 relative overflow-hidden transition-all">
            {/* Decorative Background */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-10 dark:opacity-20 ${badge.bgDecoration}`} />

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">

                {/* Left: Title & Description */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        {/* Badge Course Type */}
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${badge.style}`}>
                            {badge.label}
                        </span>

                        {/* Label: เปลี่ยนไอคอนตามบริบท */}
                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm">
                            {info.isGeneric ? <FiFilter className="text-gray-400 dark:text-gray-500" /> : <FiLayers className="text-gray-400 dark:text-gray-500" />}
                            <span>{info.isGeneric ? 'เงื่อนไขการแสดงผล' : 'รอบการตรวจ'}</span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{info.title}</h2>

                    {/* Description Box */}
                    <div className={`flex items-start gap-2 p-3 rounded-lg text-sm max-w-2xl transition-colors
             ${info.isGeneric 
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' 
                : 'bg-gray-50 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300'}
          `}>
                        <FiInfo className={`mt-0.5 shrink-0 ${info.isGeneric ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                        <p>{info.description || 'ไม่มีรายละเอียดเพิ่มเติม'}</p>
                    </div>
                </div>

                {/* Right: Date Info */}
                {info.startDate && info.endDate && (
                    <div className="flex flex-col gap-3 min-w-[200px] bg-white/50 dark:bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl border border-gray-100 dark:border-gray-600 transition-colors">
                        {/* Date Info */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                                <FiCalendar />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">วันเริ่มการตรวจ</p>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{formatDate(info.startDate)}</p>
                            </div>
                        </div>
                        <div className="w-full h-px bg-gray-100 dark:bg-gray-600" />
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                                <FiClock />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">วันสิ้นสุด</p>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{formatDate(info.endDate)}</p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};