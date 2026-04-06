import { useState, useEffect } from 'react';
import { FiX, FiActivity, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { ActivityTimeline } from './ActivityTimeline';
import { auditLogService } from '../../../../services/audit-log.service';

interface RecentActivityDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const RecentActivityDrawer = ({ isOpen, onClose }: RecentActivityDrawerProps) => {
    const [activities, setActivities] = useState<any[]>([]); 
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const loadActivities = async () => {
        setLoading(true);
        try {
            const response = await auditLogService.getRecent();

            if (response && Array.isArray(response.data)) {
                setActivities(response.data);
            } else if (Array.isArray(response)) {
                setActivities(response);
            } else {
                setActivities([]);
            }
        } catch (err) {
            console.error("Failed to load activities", err);
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadActivities();
        }
    }, [isOpen]);

    // ฟังก์ชันสำหรับเปลี่ยนหน้า
    const handleViewAllLogs = () => {
        onClose();
        navigate('/admin/audit-logs');
    };

    return (
        <div className={`fixed inset-0 z-[150] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />

            <div className={`absolute inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>

                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                            <FiActivity size={20} className={loading ? 'animate-spin' : ''} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                            <p className="text-xs text-gray-500">ประวัติการทำงานล่าสุดในระบบ</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={loadActivities} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 rounded-full">
                            <FiRefreshCw size={16} />
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 rounded-full transition-colors">
                            <FiX size={20} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                            <p className="text-sm">กำลังโหลดข้อมูล...</p>
                        </div>
                    ) : (
                        <ActivityTimeline activities={activities} />
                    )}
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800 text-center">
                    <button 
                        onClick={handleViewAllLogs}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                    >
                        ดูประวัติทั้งหมดแบบละเอียด
                    </button>
                </div>
            </div>
        </div>
    );
};