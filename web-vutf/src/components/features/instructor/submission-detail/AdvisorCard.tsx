// src/components/features/instructor/submission-detail/AdvisorCard.tsx
import React from 'react';
import { FiUserCheck } from 'react-icons/fi';
import { Advisor } from '@/types/submission';

interface AdvisorCardProps {
  advisors: Advisor[];
}

export const AdvisorCard: React.FC<AdvisorCardProps> = ({ advisors }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <FiUserCheck className="text-emerald-500 dark:text-emerald-400" /> อาจารย์ที่ปรึกษา
      </h3>
      
      <div className="space-y-4">
        {advisors && advisors.length > 0 ? (
          advisors.map((advisor) => {
            const isMain = advisor.role === 'main';

            return (
              <div key={advisor.instructorId} className="flex items-center gap-3 pb-3 border-b border-gray-50 dark:border-gray-700 last:border-0 last:pb-0 transition-colors">
                {/* Avatar */}
                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${
                  isMain 
                    ? 'bg-emerald-500 dark:bg-emerald-600' 
                    : 'bg-blue-400 dark:bg-blue-500'
                }`}>
                  {advisor.firstName.charAt(0)}
                </div>
                
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    อ. {advisor.firstName} {advisor.lastName}
                  </p>
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mb-1">
                     {advisor.instructorCode || '-'}
                  </p>

                  <div className="flex items-center gap-2">
                    {/* Badge */}
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${
                      isMain 
                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800' 
                        : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800'
                    }`}>
                      {isMain ? 'ที่ปรึกษาหลัก' : 'ที่ปรึกษาร่วม'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center italic py-2">
            ยังไม่ได้ระบุอาจารย์ที่ปรึกษา
          </p>
        )}
      </div>
    </div>
  );
};