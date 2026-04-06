// src/components/features/instructor/advised-groups/AdvisedGroupCard.tsx
import React from 'react';
import { FiCalendar, FiUsers, FiTag } from 'react-icons/fi';
import { AdvisedGroupResponse } from '../../../../types/group.types';

interface AdvisedGroupCardProps {
  data: AdvisedGroupResponse;
  isSelected: boolean;
  onClick: () => void;
}

export const AdvisedGroupCard: React.FC<AdvisedGroupCardProps> = ({ data, isSelected, onClick }) => {
  const { thesisName, advisorRole, students, progress, courseType } = data;

  // หาวันที่ได้รับมอบหมาย (ถ้า Backend ไม่ได้ส่ง assignedAt มา ใช้ startDate ของรอบแรกแทน หรือเว้นว่าง)
  // ในเคสนี้เราโชว์จำนวนรอบที่ส่งแล้วแทนก็ได้ครับ
  const submittedCount = progress.filter(p => p.submissionId).length;

  return (
    <div 
      onClick={onClick}
      className={`
        cursor-pointer rounded-xl border transition-all duration-200 p-5 relative overflow-hidden group
        ${isSelected 
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-500 shadow-md ring-1 ring-blue-500' 
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md dark:hover:shadow-gray-900/30'
        }
      `}
    >
      <div className="absolute top-4 right-4">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
          advisorRole === 'main' 
            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
        }`}>
          {advisorRole === 'main' ? 'Main' : 'Co-Advisor'}
        </span>
      </div>

      <div className="pr-16 mb-3">
        <h3 className={`font-bold text-lg mb-1 line-clamp-2 ${
          isSelected 
            ? 'text-blue-800 dark:text-blue-300' 
            : 'text-gray-800 dark:text-white'
        }`}>
          {thesisName || 'ไม่ระบุชื่อโครงงาน'}
        </h3>
        
        {/* แสดงประเภทวิชา */}
        <div className="flex items-center gap-2 mt-2">
             <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600 flex items-center gap-1">
                 <FiTag size={10} /> {courseType}
             </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100/50 dark:border-gray-700/50">
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
             <FiUsers /> {students.length} คน
        </div>
        
        {/* แสดง Progress ย่อๆ */}
        <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
          <FiCalendar /> ส่งงานแล้ว {submittedCount}/{progress.length} รอบ
        </div>
      </div>
    </div>
  );
};