// src/pages/admin/AdminDashboard.tsx
import React, { useState, useEffect, useRef } from 'react';
import { OverviewCards } from '../../components/features/admin/dashboard/OverviewCards';
import { VerificationStats } from '../../components/features/admin/dashboard/VerificationStats';
import { SystemAndUsers } from '../../components/features/admin/dashboard/SystemAndUsers';
import { RecentUploads } from '../../components/features/admin/dashboard/RecentUploads';
import { GroupRequests } from '../../components/features/admin/dashboard/GroupRequests';

// services
import { dashboardService } from '../../services/dashboard.service';

// types
import {
    IDashboardOverview,
    IVerificationStats,
    IRecentUpload,
    IGroupRequest
} from '../../types/dashboard.types';

const AdminDashboard = () => {
    const [overview, setOverview] = useState<IDashboardOverview | null>(null);
    const [verificationStats, setVerificationStats] = useState<IVerificationStats | null>(null);
    const [recentUploads, setRecentUploads] = useState<{ waitingForVerify: number; items: IRecentUpload[] } | null>(null);
    const [groupRequests, setGroupRequests] = useState<{ pendingCount: number; items: IGroupRequest[] } | null>(null);
    
    const [loading, setLoading] = useState(true);

    // 1. ใช้ useRef เพื่อช่วย "จำ" ค่า Filter ปี/เทอม ล่าสุดที่แอดมินเลือกไว้
    const currentVerFilter = useRef<{ academicYear?: number; term?: number }>({});

    // 2. เพิ่ม isBackgroundLoad เพื่อแยกแยะว่านี่คือการเปิดหน้าครั้งแรก หรือการรีเฟรชอัตโนมัติ
    const fetchDashboardData = async (isBackgroundLoad = false) => {
        try {
            // ถ้าไม่ได้โหลดเบื้องหลัง (คือเปิดหน้าครั้งแรก) ให้โชว์ Spinner
            if (!isBackgroundLoad) setLoading(true); 

            const [resOverview, resVerStats, resUploads, resGroups] = await Promise.all([
                dashboardService.getOverviewStats(),
                dashboardService.getVerificationStats(currentVerFilter.current), // ใช้ค่า Filter ที่จำไว้
                dashboardService.getRecentUploads(),
                dashboardService.getPendingGroupRequests()
            ]);

            if (resOverview.success) setOverview(resOverview.data);
            if (resVerStats.success) setVerificationStats(resVerStats.data);
            if (resUploads.success) setRecentUploads(resUploads.data);
            if (resGroups.success) setGroupRequests(resGroups.data);

        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            // ปิด Spinner เฉพาะตอนที่โชว์มันขึ้นมาแต่แรก
            if (!isBackgroundLoad) setLoading(false);
        }
    };

    // 3. ตั้งค่า Auto-Refresh (Polling)
    useEffect(() => {
        // 3.1 ดึงข้อมูลครั้งแรกตอนเปิดหน้าเว็บ (โชว์ Loading)
        fetchDashboardData(false);

        // 3.2 ตั้งเวลาให้ดึงข้อมูลซ้ำทุกๆ 30 วินาที (โหลดแบบเงียบๆ ไม่โชว์ Loading)
        const interval = setInterval(() => {
            fetchDashboardData(true);
        }, 30000); // 30000 ms = 30 วินาที

        // 3.3 เคลียร์เวลาทิ้งเมื่อแอดมินปิดหน้านี้ไปหน้าอื่น
        return () => clearInterval(interval);
    }, []);

    const handleApproveGroup = async (groupId: string) => {
        try {
            await dashboardService.approveGroupRequest(groupId);
            
            // โหลดข้อมูล Group Requests ใหม่เฉพาะส่วนนี้ (หรือจะเรียก fetchDashboardData(true) ก็ได้)
            const resGroups = await dashboardService.getPendingGroupRequests();
            if (resGroups.success) setGroupRequests(resGroups.data);

            alert('อนุมัติกลุ่มโครงงานสำเร็จ');
        } catch (error) {
            console.error('Approve failed:', error);
        }
    };

    const handleRejectGroup = async (groupId: string) => {
        try {
            const reason = window.prompt("กรุณาระบุเหตุผลที่ไม่อนุมัติกลุ่มนี้:");
            if (reason === null) return;

            await dashboardService.rejectGroupRequest(groupId, reason);
            
            const resGroups = await dashboardService.getPendingGroupRequests();
            if (resGroups.success) setGroupRequests(resGroups.data);

        } catch (error) {
            console.error('Reject failed:', error);
        }
    };

    const handleVerificationFilterChange = async (filter: { academicYear?: number; term?: number }) => {
        try {
            currentVerFilter.current = filter;

            const resVerStats = await dashboardService.getVerificationStats(filter);
            if (resVerStats.success) {
                setVerificationStats(resVerStats.data);
            }
        } catch (error) {
            console.error('Failed to filter verification stats:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-slate-50 dark:bg-gray-900 min-h-screen transition-colors duration-200 font-sans">
            <OverviewCards data={overview} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <VerificationStats
                    data={verificationStats}
                    onFilterChange={handleVerificationFilterChange}
                />
                <SystemAndUsers users={verificationStats?.users} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                <RecentUploads data={recentUploads} />
                <GroupRequests
                    data={groupRequests}
                    onApprove={handleApproveGroup}
                    onReject={handleRejectGroup}
                />
            </div>
        </div>
    );
};

export default AdminDashboard;