import { useEffect } from 'react';
import { FiX, FiCalendar, FiClock } from 'react-icons/fi';
import { Announcement } from '../../../types/announcement';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: Announcement | null;
}

export const AnnouncementDetailModal = ({ isOpen, onClose, data }: Props) => {
  // เมื่อเปิด Modal ให้ล็อค Scroll ของ Body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // ถ้าไม่เปิด หรือไม่มีข้อมูล ไม่ต้อง Render อะไรเลย
  if (!isOpen || !data) return null;

  const dateObj = new Date(data.createdAt);
  const date = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Bangkok' });
  const time = dateObj.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok' });

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      
      {/* 1. Backdrop: พื้นหลังสีดำ */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
      />

      {/* 2. Modal Content */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up transition-colors">
        
        {/* --- Image Section --- */}
        {data.imgBase64 && (
          <div className="relative w-full bg-gray-100 dark:bg-gray-900 flex justify-center border-b border-gray-100 dark:border-gray-700">
            <img 
              src={data.imgBase64} 
              alt={data.title} 
              className="w-full h-auto max-h-[50vh] object-contain"
            />
          </div>
        )}

        {/* --- Floating Close Button --- */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 dark:bg-black/40 dark:hover:bg-black/60 text-white backdrop-blur-md transition-all z-10"
        >
          <FiX size={20} />
        </button>

        {/* --- Content Section --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 bg-white dark:bg-gray-800">
          
          {/* Header Data */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
               <span className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2.5 py-0.5 rounded-md font-semibold text-xs border border-blue-100 dark:border-blue-800">
                 ANNOUNCEMENT
               </span>
               <span className="flex items-center gap-1.5">
                 <FiCalendar className="text-gray-400 dark:text-gray-500" /> {date}
               </span>
               <span className="flex items-center gap-1.5">
                 <FiClock className="text-gray-400 dark:text-gray-500" /> {time}
               </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
              {data.title}
            </h2>
          </div>

          <div className="h-px w-full bg-gray-100 dark:bg-gray-700 mb-6" />

          {/* Description */}
          <div className="prose prose-blue dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {data.description}
          </div>
        </div>

        {/* --- Footer --- */}
        <div className="px-6 py-4 border-t border-gray-50 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-all shadow-sm active:scale-95"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};