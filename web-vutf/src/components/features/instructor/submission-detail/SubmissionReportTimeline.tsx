// src/components/features/instructor/submission-detail/SubmissionReportTimeline.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiCheckCircle, FiXCircle, FiLoader, FiChevronRight, FiFileText } from 'react-icons/fi';
import { ReportData } from '@/types/report';

interface Props {
  reports: ReportData[];
}

export const SubmissionReportTimeline: React.FC<Props> = ({ reports }) => {
  const navigate = useNavigate();

  if (!reports || reports.length === 0) return null;

  // เรียงจาก ใหม่ -> เก่า (ล่าสุดอยู่บน)
  const sortedReports = [...reports].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getSystemStatusDisplay = (status: string) => {
    switch (status) {
      case 'PASS':
        return (
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <FiCheckCircle size={12} />
            </div>
            <span className="text-xs font-semibold">ระบบ: ผ่าน</span>
          </div>
        );
      case 'FAIL':
        return (
          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
            <div className="p-1 rounded-full bg-rose-100 dark:bg-rose-900/30">
                <FiXCircle size={12} />
            </div>
            <span className="text-xs font-semibold">ระบบ: ไม่ผ่าน</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
             <div className="p-1 rounded-full bg-amber-100 dark:bg-amber-900/30">
                <FiLoader size={12} className="animate-spin" />
             </div>
            <span className="text-xs font-semibold">กำลังตรวจสอบ...</span>
          </div>
        );
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
      <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <FiClock className="text-indigo-500" /> 
        ประวัติการตรวจสอบ <span className="text-gray-400 font-normal text-xs">({reports.length} ครั้ง)</span>
      </h4>
      
      <div className="flex flex-col gap-3">
        {sortedReports.map((report, index) => {
          const reportNumber = reports.length - index;

          return (
            <button
              key={report.id}
              onClick={() => navigate(`/instructor/report/${report.id}`)}
              className={`
                group relative w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all duration-200
                bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700
                hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20
              `}
            >
              <div className="flex items-start gap-3">
                 {/* Number Box */}
                 <div className={`
                    flex flex-col items-center justify-center w-10 h-10 rounded-lg shrink-0 border transition-colors
                    bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600
                    group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 group-hover:border-indigo-200 dark:group-hover:border-indigo-800
                 `}>
                    <span className="text-[10px] uppercase font-bold tracking-wide leading-none mb-0.5">ครั้งที่</span>
                    <span className="text-sm font-black leading-none">{reportNumber}</span>
                 </div>

                 {/* Content */}
                 <div className="flex flex-col gap-1">
                    {/* System Result */}
                    {getSystemStatusDisplay(report.verificationStatus)}

                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 font-medium transition-colors group-hover:text-gray-700 dark:group-hover:text-gray-300">
                        <FiFileText size={10} />
                        <span>
                            {new Date(report.createdAt).toLocaleDateString('th-TH', { 
                                day: 'numeric', month: 'short', year: '2-digit', 
                                hour: '2-digit', minute: '2-digit' 
                            })} น.
                        </span>
                    </div>
                 </div>
              </div>

              {/* Arrow Icon */}
              <div className={`
                p-1.5 rounded-full transition-all duration-200
                text-gray-300 dark:text-gray-600
                group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50
              `}>
                <FiChevronRight size={16} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};