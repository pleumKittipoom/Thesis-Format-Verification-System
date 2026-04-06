import React, { useState } from 'react';
import { FiAward, FiUserPlus, FiTrash2 } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { Advisor, AdvisorRole } from '@/types/thesis';
import { thesisGroupService } from '@/services/thesis-group.service';
import { AdvisorAddModal } from '@/components/features/thesis/AdvisorAddModal';

interface AdvisorManagementListProps {
    advisors: Advisor[];
    groupId: string;
    isOwner: boolean;
    onUpdate: () => void;
}

export const AdvisorManagementList: React.FC<AdvisorManagementListProps> = ({
    advisors,
    groupId,
    isOwner,
    onUpdate,
}) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleRemoveAdvisor = async (advisor: Advisor) => {
        const result = await Swal.fire({
            title: 'ต้องการลบอาจารย์ที่ปรึกษา?',
            text: `ต้องการลบ ${advisor.instructor?.first_name} ออกจากการเป็นที่ปรึกษาหรือไม่?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก',
            customClass: {
                popup: 'dark:bg-gray-800 dark:text-white',
                title: 'dark:text-white',
                htmlContainer: 'dark:text-gray-300'
            }
        });

        if (result.isConfirmed) {
            try {
                await thesisGroupService.removeAdvisor(groupId, advisor.advisor_id);

                Swal.fire({
                    title: 'Deleted!',
                    text: 'ลบอาจารย์ที่ปรึกษาเรียบร้อยแล้ว',
                    icon: 'success',
                    customClass: {
                        popup: 'dark:bg-gray-800 dark:text-white',
                        title: 'dark:text-white',
                        htmlContainer: 'dark:text-gray-300'
                    }
                });
                onUpdate();
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'ไม่สามารถลบได้',
                    icon: 'error',
                    customClass: {
                        popup: 'dark:bg-gray-800 dark:text-white',
                        title: 'dark:text-white',
                        htmlContainer: 'dark:text-gray-300'
                    }
                });
            }
        }
    };

    const handleUpdateRole = async (advisor: Advisor, newRole: AdvisorRole) => {
        try {
            await thesisGroupService.updateAdvisor(groupId, advisor.advisor_id, newRole);

            Swal.fire({
                title: 'Success',
                text: 'แก้ไขบทบาทเรียบร้อยแล้ว',
                icon: 'success',
                customClass: {
                    popup: 'dark:bg-gray-800 dark:text-white',
                    title: 'dark:text-white',
                    htmlContainer: 'dark:text-gray-300'
                }
            });
            onUpdate();
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'ไม่สามารถแก้ไขบทบาทได้',
                icon: 'error',
                customClass: {
                    popup: 'dark:bg-gray-800 dark:text-white',
                    title: 'dark:text-white',
                    htmlContainer: 'dark:text-gray-300'
                }
            });
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                        <FiAward className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">อาจารย์ที่ปรึกษา ({advisors.length})</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">จัดการอาจารย์ที่ปรึกษา</p>
                    </div>
                </div>
                {isOwner && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 dark:bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 dark:hover:bg-purple-500 transition-colors w-full sm:w-auto"
                    >
                        <FiUserPlus /> เพิ่มอาจารย์
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {advisors.map((advisor) => (
                    <div key={advisor.advisor_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700 gap-4 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                                <FiAward className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                                    {advisor.instructor?.first_name} {advisor.instructor?.last_name}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{advisor.instructor?.instructor_code}</span>
                                    {!isOwner && (
                                        <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${advisor.role === AdvisorRole.MAIN
                                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                            : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                                            }`}>
                                            {advisor.role === AdvisorRole.MAIN ? 'ที่ปรึกษาหลัก' : 'ที่ปรึกษาร่วม'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {isOwner && (
                            <div className="flex items-center justify-between sm:justify-end gap-2 pt-3 sm:pt-0 border-t sm:border-none border-gray-200 dark:border-gray-600">
                                <div className="relative flex-1 sm:flex-initial">
                                    <select
                                        value={advisor.role}
                                        onChange={(e) => handleUpdateRole(advisor, e.target.value as AdvisorRole)}
                                        className="appearance-none w-full bg-white sm:bg-gray-50 dark:bg-gray-800 dark:sm:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-1.5 px-3 pr-8 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 cursor-pointer transition-colors"
                                    >
                                        <option value={AdvisorRole.MAIN}>ที่ปรึกษาหลัก</option>
                                        <option value={AdvisorRole.CO}>ที่ปรึกษาร่วม</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemoveAdvisor(advisor)}
                                    className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors shrink-0"
                                    title="ลบ"
                                >
                                    <FiTrash2 className="w-5 h-5 sm:w-4 sm:h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                {advisors.length === 0 && (
                    <div className="text-center py-6 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 rounded-xl border-dashed border border-gray-200 dark:border-gray-700 text-sm">
                        ยังไม่มีอาจารย์ที่ปรึกษา
                    </div>
                )}
            </div>

            {isAddModalOpen && (
                <AdvisorAddModal
                    groupId={groupId}
                    onClose={() => setIsAddModalOpen(false)}
                    onSuccess={() => {
                        setIsAddModalOpen(false);
                        onUpdate();
                    }}
                />
            )}
        </div>
    );
};