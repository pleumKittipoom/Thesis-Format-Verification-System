// src/pages/admin/TrackThesisPage.tsx
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiTrendingUp, FiXCircle, FiCheckCircle, FiFileText } from 'react-icons/fi';
import { TrackFilter } from '@/components/features/admin/track/TrackFilter';
import { UnsubmittedList } from '@/components/features/admin/track/UnsubmittedList';
import { SubmittedList } from '@/components/features/admin/track/SubmittedList';
import { ReportTabList } from '@/components/features/admin/track/ReportTabList';
import { StatsCards } from '@/components/features/admin/track/StatsCards';
import { TrackThesisFilterParams, UnsubmittedGroup } from '@/types/track-thesis';
import { trackThesisService } from '@/services/track-thesis.service';

const TrackThesisPage = () => {
  const location = useLocation(); 
  const navState = location.state as any; 
  const [activeTab, setActiveTab] = useState<'unsubmitted' | 'submitted' | 'reports'>(
      navState?.activeTab || 'unsubmitted'
  );
  const [selectedReportMap, setSelectedReportMap] = useState<Record<number, number>>({});
  const [filters, setFilters] = useState<TrackThesisFilterParams>({
      search: navState?.search || '',
      courseType: 'ALL',
      inspectionId: navState?.inspectionId || undefined,
  });

  const [unsubmittedData, setUnsubmittedData] = useState<UnsubmittedGroup[]>([]);
  const [stats, setStats] = useState({ totalGroups: 0, submitted: 0, unsubmitted: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!filters.inspectionId && (!filters.academicYear || !filters.term)) return;

      try {
        setLoading(true);
        setError(null);

        const res = await trackThesisService.getUnsubmittedGroups(filters);

        if (res.success) {
          if (res.meta?.stats) {
            setStats(res.meta.stats);
          }

          if (activeTab === 'unsubmitted') {
            setUnsubmittedData(res.data as UnsubmittedGroup[]);
          }
        }
      } catch (err: any) {
        console.error(err);
        setError("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [filters, activeTab]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-300">
            <FiTrendingUp size={24} />
          </div>
          Track Thesis Submission
        </h1>
        <p className="text-gray-500 mt-2 ml-14">
          Monitor submission status for inspection rounds.
        </p>
      </div>

      {/* STATS DASHBOARD */}
      <StatsCards stats={stats} loading={loading} />

      {/* FILTER SECTION */}
      <TrackFilter
        filters={filters}
        setFilters={setFilters}
        activeTab={activeTab}
      />

      {/* TABS */}
      <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 mb-6 mt-6">
        <button
          onClick={() => setActiveTab('unsubmitted')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative cursor-pointer
            ${activeTab === 'unsubmitted'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
        >
          <FiXCircle />
          Not Submitted
          {/* {activeTab === 'unsubmitted' && stats.unsubmitted > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">{stats.unsubmitted}</span>
          )} */}
        </button>

        <button
          onClick={() => setActiveTab('submitted')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative cursor-pointer
            ${activeTab === 'submitted'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
        >
          <FiCheckCircle />
          Submitted
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative cursor-pointer
            ${activeTab === 'reports'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
        >
          <FiFileText />
          Reports
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="min-h-[400px]">
        {activeTab === 'unsubmitted' && (
          <UnsubmittedList
            data={unsubmittedData}
            loading={loading}
            error={error}
            filters={filters}
          />
        )}

        {activeTab === 'submitted' && (
          <SubmittedList filters={filters} activeTab={activeTab} />
        )}

        {activeTab === 'reports' && (
          <ReportTabList filters={filters} activeTab={activeTab} selectedReportMap={selectedReportMap} setSelectedReportMap={setSelectedReportMap} />
        )}
      </div>
    </div>
  );
};

export default TrackThesisPage;