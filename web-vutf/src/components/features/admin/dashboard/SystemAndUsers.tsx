// src/components/features/admin/dashboard/SystemAndUsers.tsx
import React, { useEffect, useState } from 'react';
import { FiServer, FiUsers, FiAlertCircle } from 'react-icons/fi';
import { dashboardService } from '../../../../services/dashboard.service';
import { IVerificationStats } from '../../../../types/dashboard.types';

interface Props {
    users: IVerificationStats['users'] | undefined;
}

export const SystemAndUsers: React.FC<Props> = ({ users }) => {
    const [pythonStatus, setPythonStatus] = useState({
        status: 'offline',
        latency: '0ms',
        activeWorkers: 0
    });

    // ดึงสถานะระบบครั้งแรก และตั้งเวลารันซ้ำทุกๆ 10 วินาที
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await dashboardService.getSystemStatus();
                if (res.success && res.data) {
                    setPythonStatus(res.data.pythonEngine);
                }
            } catch (error) {
                setPythonStatus(prev => ({ ...prev, status: 'offline' }));
            }
        };

        fetchStatus(); // เรียกครั้งแรกตอนเข้าหน้าเว็บ
        const interval = setInterval(fetchStatus, 10000); // 10000 ms = 10 วินาที
        return () => clearInterval(interval); // เคลียร์ทิ้งตอนเปลี่ยนหน้า
    }, []);

    const isOnline = pythonStatus.status === 'online';

    return (
        <div className="space-y-6">
            {/* การ์ดแสดงสถานะ Python Engine */}
            <div className={`bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm flex items-center justify-between border-b-4 transition-colors duration-300
        ${isOnline ? 'border-green-500' : 'border-red-500'}
      `}>
                <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Python Engine</p>
                    <h3 className={`text-xl font-bold flex items-center gap-2 ${isOnline ? 'text-gray-800 dark:text-white' : 'text-red-500 dark:text-red-400'}`}>
                        {isOnline ? 'Online' : 'Offline'}

                        {/* วงกลมไฟกะพริบ */}
                        <span className="relative flex h-3 w-3">
                            {isOnline && (
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            )}
                            <span className={`relative inline-flex rounded-full h-3 w-3 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        </span>
                    </h3>

                    {/* ข้อมูล Latency และจำนวน Worker */}
                    <div className="flex items-center gap-2 mt-1">
                        <p className={`text-xs ${isOnline ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                            Latency: {pythonStatus.latency}
                        </p>
                        {/* {isOnline && (
                            <span className="text-[10px] bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-500 font-mono">
                                Workers: {pythonStatus.activeWorkers}
                            </span>
                        )} */}
                    </div>
                </div>

                {/* เปลี่ยนไอคอนตามสถานะ */}
                {isOnline ? (
                    <FiServer className="text-green-500 text-3xl opacity-80" />
                ) : (
                    <FiAlertCircle className="text-red-500 text-3xl opacity-80 animate-pulse" />
                )}
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm flex flex-col justify-center items-center text-center h-[calc(100%-130px)]">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                    <FiUsers size={32} />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{users?.activeStudents || 0}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Students</p>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 w-full flex justify-between px-4 text-xs">
                    <span className="text-gray-400">Instructors: <b className="text-gray-700 dark:text-gray-300">{users?.instructors || 0}</b></span>
                    <span className="text-gray-400">Admins: <b className="text-gray-700 dark:text-gray-300">{users?.admins || 0}</b></span>
                </div>
            </div>
        </div>
    );
};