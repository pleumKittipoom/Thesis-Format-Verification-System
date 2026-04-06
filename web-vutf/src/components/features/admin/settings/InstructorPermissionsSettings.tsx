// src/components/features/admin/settings/InstructorPermissionsSettings.tsx
import { useState, useEffect, useMemo } from 'react';
import { FiLoader, FiUsers, FiRefreshCw, FiSearch, FiChevronLeft, FiChevronRight, FiCheckCircle, FiCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { userService } from '../../../../services/user.service';
import { User, Permission } from '../../../../types/user';
import { PermissionsTable } from './PermissionsTable';
import { SettingsCard } from './SettingsCard';

type FilterStatus = 'all' | 'granted' | 'ungranted';

export const InstructorPermissionsSettings = () => {
    const [instructors, setInstructors] = useState<User[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);

    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [savingId, setSavingId] = useState<string | null>(null);

    // --- State สำหรับ Search, Filter & Pagination ---
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchData(true);
    }, []);

    // รีเซ็ตหน้ากลับไปที่ 1 เสมอเมื่อมีการค้นหาหรือเปลี่ยนแท็บ
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterStatus]);

    const fetchData = async (isInitial = false) => {
        if (isInitial) setIsInitialLoading(true);
        else setIsRefreshing(true);

        try {
            const [instructorsRes, permsData] = await Promise.all([
                userService.getInstructors(1, 500), 
                userService.getAllPermissions()
            ]);
            const activeInstructors = instructorsRes.data.filter((user: User) => user.isActive === true);
            setInstructors(activeInstructors);
            setPermissions(permsData);

        } catch (error) {
            console.error("Failed to fetch data", error);
            toast.error('ไม่สามารถโหลดข้อมูลสิทธิ์ได้');
        } finally {
            setIsInitialLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleTogglePermission = async (user: User, permissionId: number) => {
        setSavingId(user.user_uuid);
        try {
            const currentPerms = user.permissions || [];
            const hasPerm = currentPerms.some(p => p.permissions_id === permissionId);

            const newPermissionIds = hasPerm
                ? currentPerms.filter(p => p.permissions_id !== permissionId).map(p => p.permissions_id)
                : [...currentPerms.map(p => p.permissions_id), permissionId];

            await userService.updatePermissions(user.user_uuid, newPermissionIds);

            setInstructors(prev => prev.map(inst => {
                if (inst.user_uuid === user.user_uuid) {
                    const updatedPerms = hasPerm
                        ? currentPerms.filter(p => p.permissions_id !== permissionId)
                        : [...currentPerms, permissions.find(p => p.permissions_id === permissionId)!];
                    return { ...inst, permissions: updatedPerms };
                }
                return inst;
            }));

            toast.success(`อัปเดตสิทธิ์ ${hasPerm ? 'ลบออก' : 'เพิ่ม'} สำเร็จ`);

        } catch (error) {
            console.error("Failed to update", error);
            toast.error('เกิดข้อผิดพลาดในการอัปเดตสิทธิ์');
        } finally {
            setSavingId(null);
        }
    };

    // --- Logic กรองข้อมูล (Filter + Search) ---
    const filteredInstructors = useMemo(() => {
        let result = instructors;

        // 1. กรองตามสถานะการให้สิทธิ์ (Tabs)
        if (filterStatus === 'granted') {
            result = result.filter(inst => inst.permissions && inst.permissions.length > 0);
        } else if (filterStatus === 'ungranted') {
            result = result.filter(inst => !inst.permissions || inst.permissions.length === 0);
        }

        // 2. กรองตามคำค้นหา (Search)
        if (searchTerm.trim()) {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter(inst => {
                const fullName = `${inst.instructor?.first_name || ''} ${inst.instructor?.last_name || ''}`.toLowerCase();
                const email = (inst.email || '').toLowerCase();
                return fullName.includes(lowerSearch) || email.includes(lowerSearch);
            });
        }

        return result;
    }, [instructors, searchTerm, filterStatus]);

    // --- Logic แบ่งหน้า ---
    const totalPages = Math.ceil(filteredInstructors.length / itemsPerPage) || 1;
    const paginatedInstructors = filteredInstructors.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (isInitialLoading) {
        return (
            <div className="flex justify-center p-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                <FiLoader className="animate-spin text-blue-600" size={28} />
            </div>
        );
    }

    // ตัวช่วยสร้างคลาสสำหรับแท็บที่ถูกเลือก/ไม่ถูกเลือก
    const getTabClass = (status: FilterStatus) => {
        const isActive = filterStatus === status;
        return `flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            isActive 
            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200/50 dark:border-gray-600' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
        }`;
    };

    return (
        <SettingsCard
            title="จัดการสิทธิ์อาจารย์"
            description="กำหนดสิทธิ์การเข้าถึงเมนูต่างๆ ให้กับอาจารย์แต่ละท่าน"
            icon={<FiUsers />}
            action={
                <button
                    onClick={() => fetchData(false)}
                    disabled={isRefreshing}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 dark:hover:text-blue-400 rounded-lg transition-all disabled:opacity-50"
                    title="รีเฟรชข้อมูล"
                >
                    <FiRefreshCw size={20} className={isRefreshing ? "animate-spin text-blue-600" : ""} />
                </button>
            }
        >
            {/* --- แถบเครื่องมือ: แท็บ Filter และ ช่องค้นหา --- */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6">
                
                {/* กลุ่มปุ่ม Tabs (Segmented Control) */}
                <div className="flex p-1 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto w-full xl:w-auto custom-scrollbar">
                    <button onClick={() => setFilterStatus('all')} className={getTabClass('all')}>
                        <FiUsers size={16} />
                        <span className="whitespace-nowrap">ทั้งหมด ({instructors.length})</span>
                    </button>
                    <button onClick={() => setFilterStatus('granted')} className={getTabClass('granted')}>
                        <FiCheckCircle size={16} />
                        <span className="whitespace-nowrap">ให้สิทธิ์แล้ว ({instructors.filter(i => i.permissions && i.permissions.length > 0).length})</span>
                    </button>
                    <button onClick={() => setFilterStatus('ungranted')} className={getTabClass('ungranted')}>
                        <FiCircle size={16} />
                        <span className="whitespace-nowrap">ยังไม่ให้สิทธิ์ ({instructors.filter(i => !i.permissions || i.permissions.length === 0).length})</span>
                    </button>
                </div>

                {/* กล่องค้นหา */}
                <div className="relative w-full xl:w-80">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="ค้นหาชื่อ หรือ อีเมลอาจารย์..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white dark:placeholder-gray-500 outline-none transition-all"
                    />
                </div>
            </div>

            {/* ส่งข้อมูลที่ผ่านการกรองและแบ่งหน้าแล้วไปให้ Table */}
            <PermissionsTable
                instructors={paginatedInstructors}
                permissions={permissions}
                savingId={savingId}
                onToggle={handleTogglePermission}
            />

            {/* ส่วนควบคุม Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 px-2 gap-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    แสดง {filteredInstructors.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} ถึง {Math.min(currentPage * itemsPerPage, filteredInstructors.length)} จากทั้งหมด {filteredInstructors.length} รายการ
                </div>
                
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <FiChevronLeft />
                    </button>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">
                        หน้า {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <FiChevronRight />
                    </button>
                </div>
            </div>
        </SettingsCard>
    );
};