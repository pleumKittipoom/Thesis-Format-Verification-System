// src/components/features/admin/thesis-topic/ActiveThesisTable.tsx
import { useState, useRef, useEffect } from 'react';
import { FiEye, FiMoreVertical, FiRefreshCw, FiBook, FiUser, FiUsers } from 'react-icons/fi';
import { AdminThesisGroup, ThesisStatus } from '../../../../types/admin-thesis';

interface Props {
    data: AdminThesisGroup[];
    isLoading: boolean;
    onViewDetails: (group: AdminThesisGroup) => void;
    onRefresh?: () => void;
}

export const ActiveThesisTable = ({
    data,
    isLoading,
    onViewDetails,
    onRefresh
}: Props) => {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getStatusBadge = (status: ThesisStatus) => {
        switch (status) {
            case ThesisStatus.IN_PROGRESS:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-50 text-yellow-700 border border-yellow-100 uppercase tracking-wide dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                        IN PROGRESS
                    </span>
                );
            case ThesisStatus.PASSED:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-100 uppercase tracking-wide dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        PASSED
                    </span>
                );
            case ThesisStatus.FAILED:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-100 uppercase tracking-wide dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        FAILED
                    </span>
                );
            default:
                return <span className="text-gray-400 dark:text-gray-500 text-xs">-</span>;
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* --- Header Bar --- */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-2xl transition-colors">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg">
                        <FiBook size={18} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-800 dark:text-white">โครงงานที่กำลังดำเนินการ</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">ติดตามความคืบหน้าของโครงงานที่ได้รับอนุมัติ</p>
                    </div>
                </div>

                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-500 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 rounded-full transition-all"
                        title="รีเฟรชข้อมูล"
                    >
                        <FiRefreshCw size={18} />
                    </button>
                )}
            </div>

            {/* --- Table --- */}
            <div className="overflow-visible flex-1 bg-white dark:bg-gray-800 transition-colors rounded-b-2xl">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-2"></div>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">กำลังโหลดข้อมูล...</span>
                    </div>
                ) : data.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                        <p>ไม่พบโครงงานในรายการ</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 transition-colors">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[10%]">รหัส</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[25%]">ชื่อโครงงาน</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[20%]">สมาชิก</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[25%]">อาจารย์ที่ปรึกษาหลัก</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[10%]">สถานะ</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[10%]">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800 transition-colors">
                            {data.map((group) => {
                                // หาเฉพาะ Main Advisor
                                const mainAdvisor = group.advisor?.find((a) => a.role === 'main');

                                return (
                                    <tr key={group.group_id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors group">

                                        {/* รหัสโครงงาน */}
                                        <td className="px-6 py-4 align-top">
                                            <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded border border-indigo-200 dark:border-indigo-900/50">
                                                {group.thesis?.thesis_code || 'NO-CODE'}
                                            </span>
                                        </td>

                                        {/* ชื่อโครงงาน */}
                                        <td className="px-6 py-4 align-top">
                                            <div className="flex flex-col gap-0.5">
                                                <button
                                                    onClick={() => onViewDetails(group)}
                                                    className="text-left group/title focus:outline-none cursor-pointer"
                                                >
                                                    <span className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 leading-snug group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors" title={group.thesis?.thesis_name_th}>
                                                        {group.thesis?.thesis_name_th || 'ไม่ระบุชื่อโครงงาน'}
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 italic group-hover/title:text-blue-500 dark:group-hover/title:text-blue-300 transition-colors" title={group.thesis?.thesis_name_en}>
                                                        {group.thesis?.thesis_name_en || '-'}
                                                    </span>
                                                </button>
                                            </div>
                                        </td>

                                        {/* สมาชิก */}
                                        <td className="px-6 py-4 align-top">
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 p-1.5 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg">
                                                    <FiUsers size={16} />
                                                </div>

                                                {/* ข้อความด้านขวา */}
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        {group.members.length} คน
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        Members
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* อาจารย์ที่ปรึกษาหลัก */}
                                        <td className="px-6 py-4 align-top">
                                            {mainAdvisor ? (
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 p-1.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 rounded-lg">
                                                        <FiUser size={16} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                            {mainAdvisor.instructor.first_name} {mainAdvisor.instructor.last_name}
                                                        </span>
                                                        <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                            Main Advisor
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 dark:text-gray-500 text-sm italic">- ไม่ระบุ -</span>
                                            )}
                                        </td>

                                        {/* สถานะ */}
                                        <td className="px-6 py-4 align-top text-center">
                                            {group.thesis ? getStatusBadge(group.thesis.status) : null}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-4 align-top text-right relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuId(openMenuId === group.group_id ? null : group.group_id);
                                                }}
                                                className={`p-1.5 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${openMenuId === group.group_id ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300' : ''}`}
                                            >
                                                <FiMoreVertical size={18} />
                                            </button>

                                            {openMenuId === group.group_id && (
                                                <div
                                                    ref={menuRef}
                                                    className="absolute right-8 top-10 z-20 w-44 rounded-xl bg-white dark:bg-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 focus:outline-none py-1.5 text-left animate-fade-in-down origin-top-right"
                                                >
                                                    <div className="px-1">
                                                        <button
                                                            onClick={() => {
                                                                onViewDetails(group);
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg flex items-center gap-3 transition-colors"
                                                        >
                                                            <FiEye size={16} className="text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                                                            <span className="font-medium">ดูรายละเอียด</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};