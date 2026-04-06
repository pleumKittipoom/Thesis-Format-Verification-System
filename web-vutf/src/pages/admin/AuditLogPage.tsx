import { useState, useEffect } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { auditLogService } from '../../services/audit-log.service';
import { useDebounce } from '@/hooks/useDebounce';

import { AuditLogPagination } from '@/components/features/admin/audit-log/AuditLogPagination';
import { AuditLogFilters } from '@/components/features/admin/audit-log/AuditLogFilters';
import { AuditLogCharts } from '@/components/features/admin/audit-log/AuditLogCharts';
import { AuditLogTable } from '@/components/features/admin/audit-log/AuditLogTable';

export const AuditLogPage = () => {
    // --- State & Data Fetching ---
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionFilter, setActionFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [meta, setMeta] = useState<any>({
        currentPage: 1, itemsPerPage: 20, totalItems: 0, totalPages: 1
    });
    const [stats, setStats] = useState<any>(null);
    const [allAvailableActions, setAllAvailableActions] = useState<string[]>([]);

    const debouncedSearch = useDebounce(searchTerm, 500);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const [resLogs, resStats] = await Promise.all([
                auditLogService.getAll({ page, limit, search: debouncedSearch, action: actionFilter, startDate, endDate }),
                auditLogService.getStats({ search: debouncedSearch, action: actionFilter, startDate, endDate })
            ]);

            setLogs(Array.isArray(resLogs?.data) ? resLogs.data : []);
            setMeta(resLogs?.meta || { currentPage: 1, itemsPerPage: 20, totalItems: 0, totalPages: 1 });
            setStats(resStats);

            if (resStats?.actionStats && actionFilter === '') {
                const actions = resStats.actionStats.map((s: any) => s.action);
                setAllAvailableActions(actions);
            }

        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLogs(); }, [page, debouncedSearch, actionFilter, startDate, endDate]);
    useEffect(() => { setPage(1); }, [debouncedSearch, actionFilter, startDate, endDate]);

    return (
        <div className="max-w-7xl mx-auto pb-10 px-4">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6 pt-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Audit Logs & Analytics</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">วิเคราะห์ประวัติการใช้งานและความเคลื่อนไหวในระบบ</p>
                </div>
                <button onClick={fetchLogs} className="p-2 text-gray-500 hover:text-blue-600 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <FiRefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            {/* Components */}
            <AuditLogFilters
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                actionFilter={actionFilter} setActionFilter={setActionFilter}
                startDate={startDate} setStartDate={setStartDate}
                endDate={endDate} setEndDate={setEndDate}
                availableActions={allAvailableActions}
            />

            {!loading && stats && <AuditLogCharts stats={stats} />}

            <AuditLogTable logs={logs} loading={loading} />

            <AuditLogPagination
                meta={meta}
                onPageChange={setPage}
            />

        </div>
    );
};