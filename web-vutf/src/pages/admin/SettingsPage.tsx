import { useState } from 'react';
import { FiFileText, FiUsers } from 'react-icons/fi';
import { ThesisFormatSettings } from '../../components/features/admin/settings/ThesisFormatSettings';
import { InstructorPermissionsSettings } from '@/components/features/admin/settings/InstructorPermissionsSettings';
import { useAuth } from '../../contexts/AuthContext'; 

type TabType = 'format' | 'permissions';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('format');
    
    // ดึงข้อมูล user มาเพื่อเช็ค Role
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">System Configuration</h1>

            {/* --- Tabs Header --- */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <button
                    onClick={() => setActiveTab('format')}
                    className={`flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 border-b-2 ${
                        activeTab === 'format'
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                >
                    <FiFileText size={18} />
                    Thesis Format
                </button>

                {/* ซ่อนแท็บนี้ ถ้าไม่ใช่ Admin */}
                {isAdmin && (
                    <button
                        onClick={() => setActiveTab('permissions')}
                        className={`flex items-center gap-2 px-6 py-3 font-medium transition-all duration-200 border-b-2 ${
                            activeTab === 'permissions'
                                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                    >
                        <FiUsers size={18} />
                        Instructor Permissions
                    </button>
                )}
            </div>

            {/* --- Tabs Content --- */}
            <div className="min-h-[400px]">
                {/* ทุกคนที่มีสิทธิ์เข้าหน้านี้ จะเห็นการตั้งค่า Format */}
                {activeTab === 'format' && (
                    <ThesisFormatSettings />
                )}

                {/* ป้องกันการแอบเปลี่ยน state ผ่าน React DevTools (เรนเดอร์เฉพาะ Admin) */}
                {isAdmin && activeTab === 'permissions' && (
                    <InstructorPermissionsSettings />
                )}
            </div>
        </div>
    );
}