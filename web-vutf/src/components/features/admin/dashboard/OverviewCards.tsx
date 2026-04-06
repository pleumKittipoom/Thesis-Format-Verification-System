// src/components/features/admin/dashboard/OverviewCards.tsx
import React from 'react';
import { FiLayers, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import { IDashboardOverview } from '../../../../types/dashboard.types';

interface Props {
  data: IDashboardOverview | null;
}

export const OverviewCards: React.FC<Props> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* 1. Active Groups */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border-l-4 border-blue-500 flex items-center justify-between group hover:shadow-md transition-all">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Active Groups</p>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{data?.totalActiveGroups || 0}</h3>
          <p className="text-xs text-blue-500 font-medium mt-1">+{data?.newFromLastWeek || 0} from last week</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
          <FiLayers size={24} />
        </div>
      </div>

      {/* 2. Passed Groups */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border-l-4 border-green-500 flex items-center justify-between group hover:shadow-md transition-all">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Passed (Complete)</p>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{data?.passed || 0}</h3>
          <p className="text-xs text-green-500 font-medium mt-1">Ready for Defense</p>
        </div>
        <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
          <FiCheckCircle size={24} />
        </div>
      </div>

      {/* 3. In Progress */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border-l-4 border-yellow-500 flex items-center justify-between group hover:shadow-md transition-all">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">In Progress</p>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{data?.inProgress || 0}</h3>
          <p className="text-xs text-yellow-500 font-medium mt-1">Editing / Revising</p>
        </div>
        <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition-transform">
          <FiClock size={24} />
        </div>
      </div>

      {/* 4. Failed / Issues */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border-l-4 border-red-500 flex items-center justify-between group hover:shadow-md transition-all">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">FAILED</p>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{data?.needsAttention || 0}</h3>
          <p className="text-xs text-red-500 font-medium mt-1">Requires follow-up</p>
        </div>
        <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
          <FiAlertCircle size={24} />
        </div>
      </div>
    </div>
  );
};