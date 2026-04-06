// src/pages/instructor/DashboardPage.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/utils/swal';
import { SubmissionFilters } from '../../components/features/instructor/SubmissionFilters';
import { SubmissionTable } from '../../components/features/instructor/SubmissionTable';
import { submissionService } from '../../services/submission.service';
import { SubmissionData, SubmissionFilterParams } from '../../types/submission';
import { InspectionRoundHeader, HeaderInfo } from '../../components/features/instructor/InspectionRoundHeader';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export const DashboardPage = () => {
  const navigate = useNavigate();

  // State
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, total: 0, lastPage: 1, limit: 10 });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'single' | 'batch';
    submissionId?: number;
  }>({ isOpen: false, type: 'single' });
  const [isVerifying, setIsVerifying] = useState(false);

  // Polling State
  const [isPolling, setIsPolling] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const hasSeenInProgressRef = useRef(false);
  const pollingAttemptsRef = useRef(0);
  const MAX_POLLING_ATTEMPTS = 60;

  // Filter State
  const [filters, setFilters] = useState<SubmissionFilterParams>({
    page: 1,
    limit: 10,
    search: '',
    academicYear: '',
    term: '',
    round: undefined,
    courseType: undefined,
    status: undefined
  });

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setIsPolling(false);
    hasSeenInProgressRef.current = false;
    pollingAttemptsRef.current = 0;
  }, []);

  // Fetch Data  
  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await submissionService.getAll(filters);
      setSubmissions(response.data);
      setMeta(response.meta);
      setSelectedIds([]);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Poll once
  const pollOnce = useCallback(async () => {
    try {
      const { inProgressCount } = await submissionService.getStatusSummary();

      // Track if we've seen IN_PROGRESS > 0
      if (inProgressCount > 0) {
        hasSeenInProgressRef.current = true;
      }

      // Only complete if we saw IN_PROGRESS before and now it's 0
      if (hasSeenInProgressRef.current && inProgressCount === 0) {
        stopPolling();
        toast.fire({ icon: 'success', title: 'ตรวจสอบเสร็จสิ้นทั้งหมดแล้ว!' });
        fetchSubmissions();
        return;
      }

      // Check max attempts
      pollingAttemptsRef.current += 1;
      if (pollingAttemptsRef.current >= MAX_POLLING_ATTEMPTS) {
        stopPolling();
        toast.fire({ icon: 'warning', title: 'หมดเวลาตรวจสอบ กรุณา refresh หน้า' });
        fetchSubmissions();
      }
    } catch (err) {
      console.error('Polling error:', err);
    }
  }, [stopPolling, fetchSubmissions]);

  // Start polling
  const startPolling = useCallback(() => {
    stopPolling();
    setIsPolling(true);
    hasSeenInProgressRef.current = false;
    pollingAttemptsRef.current = 0;

    // Start interval
    pollingRef.current = setInterval(pollOnce, 3000);

    // First poll after short delay (let backend update status)
    setTimeout(pollOnce, 1000);
  }, [stopPolling, pollOnce]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  // Fetch on filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSubmissions();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchSubmissions]);

  // Handlers
  const handleFilterChange = (newFilters: Partial<SubmissionFilterParams>) => {
    setFilters((prev: SubmissionFilterParams) => ({ ...prev, ...newFilters }));
  };

  const handlePageChange = (newPage: number) => {
    handleFilterChange({ page: newPage });
  };

  // Open confirm modal for single verify
  const handleVerify = (id: number) => {
    setConfirmModal({ isOpen: true, type: 'single', submissionId: id });
  };

  // Open confirm modal for batch verify
  const handleBatchVerify = () => {
    if (selectedIds.length === 0) return;
    setConfirmModal({ isOpen: true, type: 'batch' });
  };

  // Execute verification
  const executeVerify = async () => {
    setIsVerifying(true);
    try {
      const ids = confirmModal.type === 'single'
        ? [confirmModal.submissionId!]
        : selectedIds;

      await submissionService.verifyBatch(ids);

      // Close modal and refresh to show IN_PROGRESS status
      setConfirmModal({ isOpen: false, type: 'single' });
      await fetchSubmissions();

      // Start polling after fetch completes
      startPolling();
    } catch (error) {
      console.error('Verification failed:', error);
      toast.fire({ icon: 'error', title: 'ส่งตรวจสอบไม่สำเร็จ' });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSelectionChange = (ids: number[]) => {
    setSelectedIds(ids);
  };

  const handleViewDetails = (id: number) => {
    navigate(`/instructor/submission/${id}`);
  };

  // Helper: สร้างคำอธิบายสรุปเงื่อนไข Filter
  const generateFilterDescription = () => {
    const parts = [];
    parts.push(filters.academicYear ? `ปีการศึกษา ${filters.academicYear}` : 'ทุกปีการศึกษา');
    parts.push(filters.term ? `เทอม ${filters.term}` : 'ทุกเทอม');
    parts.push(filters.round ? `รอบที่ ${filters.round}` : 'ทุกรอบการตรวจ');
    if (filters.search) parts.push(`คำค้นหา: "${filters.search}"`);
    return parts.join(' • ');
  };

  // Main Logic: Smart Context Header
  const getDisplayHeaderInfo = (): HeaderInfo | null => {
    if (submissions.length === 0) return null;
    const firstRound = submissions[0].inspectionRound;
    if (!firstRound) return null;

    const isSameRound = submissions.every(s => s.inspectionRound && s.inspectionRound.id === firstRound.id);

    if (isSameRound) {
      return {
        title: firstRound.title,
        description: firstRound.description,
        startDate: firstRound.startDate,
        endDate: firstRound.endDate,
        courseType: firstRound.courseType,
        isGeneric: false
      };
    } else {
      return {
        title: 'ภาพรวมรายการส่งงาน',
        description: generateFilterDescription(),
        courseType: (filters.courseType && filters.courseType !== 'ALL') ? filters.courseType : 'ALL',
        startDate: undefined,
        endDate: undefined,
        isGeneric: true
      };
    }
  };

  const headerInfo = getDisplayHeaderInfo();
  const verifyCount = confirmModal.type === 'single' ? 1 : selectedIds.length;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <div className="mb-8 animate-enter-down">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Submission Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          จัดการและตรวจสอบไฟล์งานของนักศึกษา
          {isPolling && <span className="ml-2 text-amber-600 animate-pulse">• กำลังติดตามสถานะ...</span>}
        </p>
      </div>

      {/* 1. Filters Section */}
      <SubmissionFilters filters={filters} onChange={handleFilterChange} />

      {/* 2. Header Section */}
      <InspectionRoundHeader info={headerInfo} />

      {/* 3. Table Section */}
      <SubmissionTable
        data={submissions}
        isLoading={loading}
        onVerify={handleVerify}
        onViewDetails={handleViewDetails}
        meta={meta}
        onPageChange={handlePageChange}
        selectedIds={selectedIds}
        onSelectionChange={handleSelectionChange}
        onBatchVerify={handleBatchVerify}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => !isVerifying && setConfirmModal({ isOpen: false, type: 'single' })}
        onConfirm={executeVerify}
        title="ยืนยันการส่งตรวจสอบ"
        message={`คุณต้องการส่งไฟล์ ${verifyCount} รายการ ไปตรวจสอบหรือไม่?`}
        confirmText="ส่งตรวจสอบ"
        cancelText="ยกเลิก"
        type="info"
        isLoading={isVerifying}
        loadingText="กำลังส่งตรวจสอบ..."
      />
    </div>
  );
};