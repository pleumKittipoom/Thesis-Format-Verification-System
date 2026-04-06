// src/components/features/admin/track/StatsCards.tsx
import { FiPieChart, FiCheckCircle, FiXCircle } from 'react-icons/fi';

interface StatsProps {
  stats: {
    totalGroups: number;
    submitted: number;
    unsubmitted: number;
  };
  loading?: boolean;
}

export const StatsCards = ({ stats, loading }: StatsProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700"
          ></div>
        ))}
      </div>
    );
  }

  // ถ้าไม่มีข้อมูลเลย (เช่น ยังไม่ได้เลือกรอบ) ไม่ต้องแสดง
  if (stats.totalGroups === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Card 1: ทั้งหมด */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
          <FiPieChart size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">กลุ่มทั้งหมด (Total)</p>
          <h4 className="text-2xl font-bold text-slate-800 dark:text-white">{stats.totalGroups}</h4>
        </div>
      </div>

      {/* Card 2: ส่งแล้ว */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-green-200 dark:border-green-900/30 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
        <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
          <FiCheckCircle size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">ส่งแล้ว (Submitted)</p>
          <h4 className="text-2xl font-bold text-green-600">{stats.submitted}</h4>
        </div>
      </div>

      {/* Card 3: ค้างส่ง */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-red-200 dark:border-red-900/30 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
          <FiXCircle size={24} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">ค้างส่ง (Missing)</p>
          <h4 className="text-2xl font-bold text-red-600">{stats.unsubmitted}</h4>
        </div>
      </div>
    </div>
  );
};