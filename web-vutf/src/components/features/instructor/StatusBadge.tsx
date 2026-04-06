// src/components/features/instructor/StatusBadge.tsx
import React from 'react';

const STATUS_CONFIG = {
  PENDING: { 
    color: 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300', 
    label: 'รอตรวจสอบ' 
  },
  IN_PROGRESS: { 
    color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300', 
    label: 'กำลังดำเนินการ' 
  },
  COMPLETED: { 
    color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300', 
    label: 'ตรวจแล้ว' 
  },
};

export const StatusBadge: React.FC<{ status: keyof typeof STATUS_CONFIG }> = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};