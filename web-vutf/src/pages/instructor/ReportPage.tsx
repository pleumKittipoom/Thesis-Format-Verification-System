// src/pages/instructor/ReportPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/utils/swal';
import { ReportFilters } from '@/components/features/instructor/report/ReportFilters';
import { ReportTable } from '@/components/features/instructor/report/ReportTable';
import { InspectionRoundHeader, HeaderInfo } from '@/components/features/instructor/InspectionRoundHeader';
import { ReportData, ReportFilterParams, ReviewStatus, VerificationStatus } from '@/types/report';
import { reportService } from '@/services/report.service';

export const ReportPage = () => {
    const navigate = useNavigate();

    // State
    const [reports, setReports] = useState<ReportData[]>([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState({ page: 1, total: 0, lastPage: 1, limit: 10 });

    // Filters
    const [filters, setFilters] = useState<ReportFilterParams>({
        page: 1,
        limit: 10,
        search: '',
        verificationStatus: undefined,
        reviewStatus: undefined,
        academicYear: '',
        term: '',
        round: undefined,
        courseType: undefined
    });

    // Fetch Data Function
    const fetchReports = useCallback(async () => {
        setLoading(true);
        try {
            const response = await reportService.getAll(filters);
            setReports(response.data);
            setMeta(response.meta);
        } catch (error) {
            console.error('Failed to fetch reports:', error);
            toast.fire({
                icon: 'error',
                title: 'ไม่สามารถดึงข้อมูลรายงานได้'
            });
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const handleReview = (report: ReportData) => {
        navigate(`/instructor/report/${report.id}`);
    };

    // อัปเดต Review Status (สถานะการตรวจจากอาจารย์)
    const handleStatusChange = async (id: number, status: ReviewStatus) => {
        try {
            await reportService.submitReview(id, { reviewStatus: status });
            toast.fire({
                icon: 'success',
                title: 'อัปเดตสถานะเรียบร้อยแล้ว'
            });
            fetchReports(); // Refresh data
        } catch (error) {
            console.error(error);
            toast.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาดในการอัปเดต'
            });
        }
    };

    // อัปเดต Verification Status (สถานะจากระบบ)
    const handleVerificationStatusChange = async (id: number, status: VerificationStatus) => {
        try {
            await reportService.updateVerificationStatus(id, status);
            toast.fire({
                icon: 'success',
                title: 'แก้ไขสถานะจากระบบเรียบร้อยแล้ว'
            });
            fetchReports(); // Refresh data
        } catch (error) {
            console.error(error);
            toast.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาดในการแก้ไขสถานะระบบ'
            });
        }
    };

    // --- Dynamic Header Logic ---

    // 1. Helper to generate text description from filters
    const generateFilterDescription = () => {
        const parts = [];
        // Only show if a specific value is selected (not empty or undefined)
        if (filters.courseType) parts.push(`ประเภท: ${filters.courseType}`);
        parts.push(filters.academicYear ? `ปีการศึกษา ${filters.academicYear}` : 'ทุกปีการศึกษา');
        parts.push(filters.term ? `เทอม ${filters.term}` : 'ทุกเทอม');
        parts.push(filters.round ? `รอบที่ ${filters.round}` : 'ทุกรอบ');
        if (filters.search) parts.push(`ค้นหา: "${filters.search}"`);

        return parts.join(' • ');
    };

    // 2. Logic to determine what to show in the header
    const getHeaderInfo = (): HeaderInfo => {

        if (reports.length > 0) {
            const firstRound = reports[0].inspectionRound;
            const isSameRound = firstRound && reports.every(r => r.inspectionRound?.id === firstRound.id);

            if (isSameRound && firstRound) {
                return {
                    title: firstRound.title,
                    description: firstRound.description || generateFilterDescription(),
                    startDate: firstRound.startDate,
                    endDate: firstRound.endDate,
                    courseType: firstRound.courseType,
                    isGeneric: false
                };
            }
        }
        return {
            title: 'ภาพรวมรายการตรวจสอบ',
            description: generateFilterDescription(),
            courseType: filters.courseType || 'ALL', 
            isGeneric: true
        };
    };

    const headerInfo = getHeaderInfo();

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="mb-8 animate-enter-down">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Thesis Reports</h1>
                <p className="text-gray-500 dark:text-gray-400">รายงานผลการตรวจสอบและประวัติการอนุมัติ</p>
            </div>

            <ReportFilters
                filters={filters}
                onChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
            />

            <InspectionRoundHeader info={headerInfo} />

            <ReportTable
                data={reports}
                isLoading={loading}
                onReview={handleReview}
                onStatusChange={handleStatusChange}
                onVerificationStatusChange={handleVerificationStatusChange}
                meta={meta}
                onPageChange={(p) => setFilters(prev => ({ ...prev, page: p }))}
                onRefresh={fetchReports}
            />
        </div>
    );
};