// src/components/features/instructor/report-detail/ReportTimeline.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiFileText, FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import { ReportData } from '@/types/report';

interface Props {
  reports: ReportData[];
  currentReportId: number;
}

export const ReportTimeline: React.FC<Props> = ({ reports, currentReportId }) => {
  const navigate = useNavigate();

  // เรียงลำดับจาก เก่า -> ใหม่ (ซ้ายไปขวา)
  const sortedReports = [...reports].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // สีสำหรับ Review Status (จุดกลมมุมขวาบน)
  const getReviewStatusColor = (status: string) => {
    switch (status) {
      case 'PASSED': return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]';
      case 'NOT_PASSED': return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]';
      case 'NEEDS_REVISION': return 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]';
      default: return 'bg-gray-300';
    }
  };

  // Helper สำหรับ System Verification Status (Badge ตรงกลาง)
  const getSystemStatusBadge = (status: string) => {
    switch (status) {
      case 'PASS':
        return (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800">
            <FiCheckCircle size={10} /> ระบบ: ผ่าน
          </div>
        );
      case 'FAIL':
        return (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800">
            <FiXCircle size={10} /> ระบบ: ไม่ผ่าน
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-600">
            <FiLoader size={10} /> รอระบบตรวจ
          </div>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <FiClock className="text-indigo-500" /> ประวัติการตรวจสอบ (Timeline)
      </h3>

      <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {sortedReports.map((report, index) => {
          const isActive = report.id === currentReportId;
          
          return (
            <div key={report.id} className="flex items-center">
              
              {/* Connector Line */}
              {index > 0 && (
                <div className="w-8 h-0.5 bg-gray-200 dark:bg-gray-700 mx-2 shrink-0" />
              )}

              {/* Card Item */}
              <button
                onClick={() => !isActive && navigate(`/instructor/report/${report.id}`)}
                className={`
                  relative group flex flex-col items-start p-3 rounded-xl border transition-all duration-200 min-w-[170px] shrink-0 text-left
                  ${isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 ring-1 ring-indigo-500 dark:ring-indigo-400' 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md'
                  }
                `}
              >
                {/* Status Dot */}
                <div 
                    className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${getReviewStatusColor(report.reviewStatus)}`} 
                    title="ผลการพิจารณาโดยอาจารย์"
                />

                <span className={`text-xs font-bold uppercase mb-1.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  ครั้งที่ {index + 1}
                </span>

                {/* System Status Badge */}
                <div className="mb-3">
                    {getSystemStatusBadge(report.verificationStatus)}
                </div>

                {/* Date & Time */}
                <div className="flex items-center gap-1.5 w-full">
                  <FiFileText size={14} className={`shrink-0 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <div className={`text-[11px] font-medium truncate flex items-center gap-1 ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                     {/* วันที่ */}
                     <span>
                        {new Date(report.createdAt).toLocaleDateString('th-TH', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: '2-digit' 
                        })}
                     </span>
                     
                     <span className="opacity-40 text-[10px]">•</span>

                     {/* เวลา */}
                     <span>
                        {new Date(report.createdAt).toLocaleTimeString('th-TH', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        })} น.
                     </span>
                  </div>
                </div>
                 
                 {/* Active Indicator Label */}
                 {isActive && (
                    <span className="mt-2 text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full w-full text-center shadow-sm">
                        กำลังดูอยู่
                    </span>
                 )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};