import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiAward, FiFileText, FiArrowLeft, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { useTitle } from '@/hooks/useTitle';
import { useAuth } from '@/contexts/AuthContext';
import { thesisGroupService } from '@/services/thesis-group.service';
import { ThesisGroup, GroupMemberRole } from '@/types/thesis';

// Components
import { ThesisInfoEditForm } from '@/components/features/thesis/ThesisInfoEditForm';
import { MemberManagementList } from '@/components/features/thesis/MemberManagementList';
import { AdvisorManagementList } from '@/components/features/thesis/AdvisorManagementList';

type TabType = 'thesis' | 'members' | 'advisors';

const GroupDetailPage: React.FC = () => {
    useTitle('รายละเอียดกลุ่มวิทยานิพนธ์');
    const { groupId } = useParams<{ groupId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [group, setGroup] = useState<ThesisGroup | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('thesis');

    const fetchGroup = useCallback(async () => {
        if (!groupId) return;
        setIsLoading(true);
        try {
            const data = await thesisGroupService.getThesisGroupById(groupId);
            setGroup(data);
        } catch (error) {
            console.error('Error fetching group:', error);
            navigate('/student/group-management'); // Redirect on error
        } finally {
            setIsLoading(false);
        }
    }, [groupId, navigate]);

    useEffect(() => {
        fetchGroup();
    }, [fetchGroup]);

    // Check if current user is owner of selected group
    const creatorId = typeof group?.created_by === 'object' ? group.created_by?.user_uuid : group?.created_by;
    const isOwner = group?.members.some(
        m => m.student_uuid === user?.id && m.role?.toLowerCase() === GroupMemberRole.OWNER.toLowerCase()
    ) || (creatorId === user?.id) || false;



    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
                <FiLoader className="w-10 h-10 text-blue-500 dark:text-blue-400 animate-spin" />
            </div>
        );
    }

    if (!group) return null;

    const tabs = [
        { key: 'thesis', label: 'ข้อมูลวิทยานิพนธ์', icon: FiFileText },
        { key: 'members', label: 'สมาชิกกลุ่ม', icon: FiUsers },
        { key: 'advisors', label: 'อาจารย์ที่ปรึกษา', icon: FiAward },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/30 transition-colors">
            <div className="max-w-5xl mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors"
                >
                    <FiArrowLeft /> ย้อนกลับ
                </button>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {group.thesis.thesis_name_th || 'ไม่มีชื่อโครงงาน'}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">{group.thesis.thesis_name_en || '-'}</p>
                    </div>
                </div>

                {/* แสดง Alert เมื่อกลุ่มถูกปฏิเสธ*/}
                {group.status === 'rejected' && group.rejection_reason && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-start gap-3 shadow-sm transition-colors"
                    >
                        <div className="mt-0.5">
                            <FiAlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-red-800 dark:text-red-200">กลุ่มของคุณถูกปฏิเสธการอนุมัติ</h3>
                            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                <span className="font-semibold">เหตุผล:</span> {group.rejection_reason}
                            </p>
                            <p className="text-sm text-red-600 dark:text-red-400 mt-2 italic">
                                * กรุณาแก้ไขข้อมูลตามเหตุผลที่แจ้ง และกดบันทึกการเปลี่ยนแปลงเพื่อส่งให้แอดมินตรวจสอบอีกครั้ง
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Tabs */}
                <div className="flex bg-white dark:bg-gray-800 p-1.5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 w-fit max-w-full overflow-x-auto transition-colors">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as TabType)}
                                className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-sm font-medium transition-all shrink-0 ${isActive
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                title={tab.label}
                            >
                                <Icon className="w-5 h-5 sm:w-4 sm:h-4" />

                                {/* ซ่อนข้อความในจอเล็ก (hidden) และแสดงในจอขนาด sm ขึ้นไป (sm:block) */}
                                <span className="hidden sm:block">
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'thesis' && (
                            isOwner ? (
                                <ThesisInfoEditForm
                                    thesis={group.thesis}
                                    groupId={group.group_id}
                                    onUpdate={fetchGroup} // In real app use fetchGroup. For now mock: () => handleUpdateMock(...)
                                />
                            ) : (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">ข้อมูลวิทยานิพนธ์</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">ชื่อภาษาไทย</label>
                                            <p className="text-gray-900 dark:text-white">{group.thesis.thesis_name_th}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">ชื่อภาษาอังกฤษ</label>
                                            <p className="text-gray-900 dark:text-white">{group.thesis.thesis_name_en}</p>
                                        </div>
                                        <div className="flex gap-8">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">รหัสวิทยานิพนธ์</label>
                                                <p className="text-gray-900 dark:text-white">{group.thesis.thesis_code}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">ปีการศึกษา</label>
                                                <p className="text-gray-900 dark:text-white">{group.thesis.graduation_year || '-'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}

                        {activeTab === 'members' && (
                            <MemberManagementList
                                members={group.members}
                                groupId={group.group_id}
                                isOwner={isOwner}
                                currentUserId={user?.id || ''}
                                onUpdate={fetchGroup}
                            // groupStatus={group.status}
                            />
                        )}

                        {activeTab === 'advisors' && (
                            <AdvisorManagementList
                                advisors={group.advisor}
                                groupId={group.group_id}
                                isOwner={isOwner}
                                onUpdate={fetchGroup}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default GroupDetailPage;