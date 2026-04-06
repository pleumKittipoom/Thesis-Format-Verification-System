// src/pages/student/UploadFile.tsx
import React, { useEffect, useState } from 'react';
import InspectionActiveCard from '../../components/features/student/InspectionActiveCard';
import ThesisFormatSection from '../../components/features/student/ThesisFormatSection';
import { inspectionService } from '../../services/inspection.service';
import { InspectionRound } from '../../types/inspection';

const UploadFile: React.FC = () => {
  const [activeRound, setActiveRound] = useState<InspectionRound | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchActiveRound = async () => {
      try {
        setLoading(true);
        const data = await inspectionService.getActiveRound();
        setActiveRound(data);
      } catch (error) {
        console.error("Failed to load active round", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveRound();
  }, []);

  return (
    // 1. พื้นหลังหลักเป็นสีเทาอ่อน (เหมือนหน้า Dashboard ปกติ)
    <div className="min-h-screen bg-[#F8F9FD] dark:bg-gray-900 p-6 transition-colors">
      
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* --- ส่วนที่ 1: Header Project Info (กรอบบนสุด) --- */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
           <div className="flex items-center gap-4">
             <span className="font-bold text-gray-900 dark:text-white text-lg">รหัสโครงงาน: 010000</span>
             <span className="h-6 w-px bg-gray-300 dark:bg-gray-600 hidden md:block"></span>
             <span className="font-medium text-gray-700 dark:text-gray-300 text-base md:text-lg">Venue and building reservation system</span>
           </div>
           {/* (Optional) Add Status or other info here */}
        </div>

        {/* --- ส่วนที่ 2: Main Upload Area (กรอบกลาง) --- */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-700 min-h-[400px] flex flex-col justify-center transition-colors">
            {/* Component นี้จะอยู่กลางกรอบสีขาว */}
            <InspectionActiveCard round={activeRound} loading={loading} />
        </div>

        {/* --- ส่วนที่ 3: Download Files (กรอบล่างสุด) --- */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            <ThesisFormatSection />
        </div>
        
      </div>
    </div>
  );
};

export default UploadFile;