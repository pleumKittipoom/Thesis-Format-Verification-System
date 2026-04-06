// src/components/features/admin/dashboard/GroupRequests.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiUserPlus } from 'react-icons/fi';
import { IGroupRequest } from '../../../../types/dashboard.types';

interface Props {
    data: { pendingCount: number; items: IGroupRequest[] } | null;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

export const GroupRequests: React.FC<Props> = ({ data, onApprove, onReject }) => {
    const items = data?.items || [];

    return (
        <div className="xl:col-span-1 flex flex-col gap-4">
            <div className="flex justify-between items-center h-[28px]">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    Group Requests
                    {data?.pendingCount ? (
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                        </span>
                    ) : null}
                </h2>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 px-2 py-1 rounded-md">
                    {data?.pendingCount || 0} Pending
                </span>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full">
                <div className="divide-y divide-gray-50 dark:divide-gray-700">
                    {items.length === 0 && <p className="text-center text-gray-500 py-6 text-sm">No pending requests</p>}
                    {items.map((req) => (
                        <div key={req.groupId} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                                        <span className="text-xs font-bold">{req.requesterName.charAt(0)}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Request by | {req.requesterName}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-mono bg-gray-100 dark:bg-gray-700 text-gray-500 dark:bg-gray-800 dark:text-gray-300 px-1.5 py-0.5 rounded">
                                    {req.academicYear}/{req.term}
                                </span>
                            </div>

                            <div className="mb-4 pl-[52px]">
                                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-snug line-clamp-2 mb-2">
                                    {req.thesisName}
                                </h5>
                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                    <span className="flex items-center gap-1"><FiUsers size={12} /> {req.memberCount} Members</span>
                                    <span className="flex items-center gap-1"><FiUserPlus size={12} /> {req.advisorCount} Advisors</span>
                                </div>
                            </div>

                            <div className="flex gap-2 pl-[52px]">
                                <button
                                    onClick={() => onApprove(req.groupId)}
                                    className="flex-1 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 dark:bg-white dark:text-gray-900 dark:hover:bg-blue-700 dark:hover:text-white text-xs font-bold transition-all shadow-sm">
                                    Approve
                                </button>
                                <button
                                    onClick={() => onReject(req.groupId)}
                                    className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all text-xs font-bold">
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <Link
                    to="/admin/topics"
                    className="mt-auto py-3 text-center text-xs font-bold text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 bg-gray-50 dark:bg-gray-700/30 transition-colors border-t border-gray-100 dark:border-gray-700"
                >
                    View All Requests
                </Link>
            </div>
        </div>
    );
};