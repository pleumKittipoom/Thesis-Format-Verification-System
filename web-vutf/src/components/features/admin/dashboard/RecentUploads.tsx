// src/components/features/admin/dashboard/RecentUploads.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiFile, FiClock, FiPlay, FiLoader, FiArrowRight } from 'react-icons/fi';
import { IRecentUpload } from '../../../../types/dashboard.types';
import { formatTimeAgo, formatStatusText } from '../../../../utils/date.utils';

interface Props {
    data: { waitingForVerify: number; items: IRecentUpload[] } | null;
}

export const RecentUploads: React.FC<Props> = ({ data }) => {
    const navigate = useNavigate();
    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PENDING': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'COMPLETED': case 'PASSED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'FAILED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const items = data?.items || [];

    return (
        <div className="xl:col-span-2 flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">Recent Uploads</h2>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 text-xs font-bold">
                        {data?.waitingForVerify || 0} Waiting for Verify
                    </span>
                </div>
                <Link
                    to="/admin/Track"
                    state={{ activeTab: 'submitted' }}
                    className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                >
                    View All History
                </Link>
            </div>

            <div className="flex flex-col gap-3">
                {items.length === 0 && <p className="text-gray-500 text-sm py-4">No recent uploads found.</p>}
                {items.map((project) => {
                    const formattedStatus = formatStatusText(project.status);

                    return (
                        <div key={project.submissionId} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-transparent hover:border-blue-100 dark:hover:border-blue-900 transition-all group relative overflow-hidden">
                            {project.status === 'IN_PROGRESS' && (
                                <div className="absolute bottom-0 left-0 h-1 bg-blue-500 animate-[loading_2s_ease-in-out_infinite] w-full opacity-50"></div>
                            )}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl flex-shrink-0 ${project.status === 'PENDING' ? 'bg-amber-50 text-amber-500 dark:bg-amber-900/20' :
                                        project.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-500 dark:bg-blue-900/20' :
                                            project.status === 'COMPLETED' ? 'bg-green-50 text-green-500 dark:bg-green-900/20' :
                                                'bg-red-50 text-red-500 dark:bg-red-900/20'
                                        }`}>
                                        <FiFile size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono text-xs font-bold text-gray-400 dark:text-gray-500">{project.thesisCode}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getStatusColor(project.status)}`}>
                                                {formattedStatus}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm md:text-base line-clamp-1">{project.thesisName}</h4>
                                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                            <FiClock size={10} /> Uploaded {formatTimeAgo(project.uploadedAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex-shrink-0 flex items-center justify-end sm:border-l sm:border-gray-100 dark:sm:border-gray-700 sm:pl-6">
                                    {/* {project.status === 'PENDING' && (
                                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all">
                                            <FiPlay size={16} className="fill-current" /> Verify
                                        </button>
                                    )} */}
                                    {project.status === 'IN_PROGRESS' && (
                                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium px-2">
                                            <FiLoader size={18} className="animate-spin" /> Processing...
                                        </div>
                                    )}
                                    {(project.status === 'PENDING' || project.status === 'COMPLETED' || project.status === 'PASSED' || project.status === 'FAILED') && (
                                        <button
                                            onClick={() => navigate('/admin/Track', {
                                                state: {
                                                    activeTab: 'submitted',
                                                    inspectionId: project.inspectionId,
                                                    search: project.thesisCode
                                                }
                                            })}
                                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            title="ดูรายละเอียดการส่งงาน"
                                        >
                                            <FiArrowRight size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};