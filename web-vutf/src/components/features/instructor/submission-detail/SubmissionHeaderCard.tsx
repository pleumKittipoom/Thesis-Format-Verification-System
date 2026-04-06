// src/components/features/instructor/submission-detail/SubmissionHeaderCard.tsx
import React from 'react';
import { FiClock, FiCheckCircle, FiCalendar, FiTag } from 'react-icons/fi';
import { SubmissionDetail } from '@/types/submission';

interface Props {
    data: SubmissionDetail;
}

export const SubmissionHeaderCard: React.FC<Props> = ({ data }) => {

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-bl-full opacity-50" />

            <div className="relative z-10">
                {/* Badges Row */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex gap-2">
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                            {data.thesisCode}
                        </span>
                        <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                            <FiTag size={12} />
                            {data.thesisCourseType === 'PRE_PROJECT' ? 'Pre-Project' :
                                data.thesisCourseType === 'PROJECT' ? 'Project' :
                                    data.thesisCourseType}
                        </span>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${data.status === 'PENDING' 
                        ? 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600' 
                        : data.status === 'COMPLETED' || data.status === 'IN_PROGRESS' 
                            ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' 
                            : 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
                        }`}>
                        {data.status}
                    </span>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">{data.thesisTitleEn}</h1>
                <h2 className="text-lg text-gray-500 dark:text-gray-400 font-medium mb-6">{data.thesisTitleTh}</h2>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

                    {/* 1. Submission Time Card */}
                    <div className="flex flex-col justify-center p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 hover:border-blue-200 dark:hover:border-blue-800 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white dark:bg-gray-700 rounded-xl text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-blue-100 dark:ring-blue-900/30 group-hover:scale-110 transition-transform duration-300">
                                <FiClock size={22} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">
                                    เวลาที่ส่งงาน
                                </p>
                                <p className="text-base font-bold text-gray-900 dark:text-white font-mono">
                                    {new Date(data.submittedAt).toLocaleString('th-TH', {
                                        dateStyle: 'medium',
                                        timeStyle: 'medium',
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 2. Inspection Round Info Card */}
                    <div className="flex flex-col justify-center p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 hover:border-purple-200 dark:hover:border-purple-800 transition-colors group">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white dark:bg-gray-700 rounded-xl text-purple-600 dark:text-purple-400 shadow-sm ring-1 ring-purple-100 dark:ring-purple-900/30 shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                                <FiCheckCircle size={22} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-1 flex items-center gap-2">
                                    รอบการตรวจ: <span className="text-gray-900 dark:text-white normal-case text-sm truncate">{data.inspectionTitle}</span>
                                </p>

                                {data.inspectionDescription && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2" title={data.inspectionDescription}>
                                        รายละเอียด: <span className="text-gray-900 dark:text-white normal-case text-sm truncate">{data.inspectionDescription}</span>
                                    </p>
                                )}

                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-700 rounded-lg border border-purple-100 dark:border-purple-900/30 shadow-sm text-xs font-medium text-gray-600 dark:text-gray-300">
                                    <FiCalendar className="text-purple-500 dark:text-purple-400" />
                                    <span>{formatDate(data.inspectionStartDate)}</span>
                                    <span className="text-purple-500 dark:text-purple-400"> - </span>
                                    <span>{formatDate(data.inspectionEndDate)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};