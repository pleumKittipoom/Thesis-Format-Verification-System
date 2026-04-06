// src/components/features/instructor/advised-groups/StatusBadge.tsx
import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Logic เลือกสีตามสถานะของ Thesis
  const getStatusStyle = (s: string) => {
    switch (s.toUpperCase()) {
      case 'PASSED':
      case 'APPROVED':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'FAILED':
      case 'REJECTED':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      default: 
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(status)}`}>
      {status}
    </span>
  );
};