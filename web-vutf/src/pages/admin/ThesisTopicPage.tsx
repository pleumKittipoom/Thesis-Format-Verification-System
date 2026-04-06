// src/pages/admin/ThesisTopicPage.tsx
import { useEffect, useState } from 'react';
import { FiInbox, FiLayers, FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';

import { adminThesisService } from '../../services/admin-thesis.service';
import {
    AdminThesisGroup,
    ThesisGroupStatus,
    ThesisStatus
} from '../../types/admin-thesis';

// Components
import { ThesisRequestTable } from '../../components/features/admin/thesis-topic/ThesisRequestTable';
import { ActiveThesisTable } from '../../components/features/admin/thesis-topic/ActiveThesisTable';
import { ActionModal } from '../../components/features/admin/thesis-topic/ActionModal';
import { ThesisFilter } from '../../components/features/admin/thesis-topic/ThesisFilter';
import { ThesisDetailView } from '../../components/features/admin/thesis-topic/ThesisDetailView';
import { AdminCreateGroupForm } from '../../components/features/admin/thesis-topic/AdminCreateGroupForm';

export const ThesisTopicPage = () => {
    // --- State ---
    const [activeTab, setActiveTab] = useState<'requests' | 'active'>('requests');
    const [viewMode, setViewMode] = useState<'list' | 'detail' | 'create'>('list');

    const [groups, setGroups] = useState<AdminThesisGroup[]>([]);
    const [loading, setLoading] = useState(true);

    // Pagination & Filter
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const now = new Date();
    const curMonth = now.getMonth() + 1;
    let defaultYear = now.getFullYear() + 543;
    let defaultTerm = 1;

    // Logic คำนวณเทอม (โดยประมาณ)
    if (curMonth >= 6 && curMonth <= 10) {
        defaultTerm = 1; // มิ.ย. - ต.ค.
    } else if (curMonth >= 11 || curMonth <= 3) {
        defaultTerm = 2; // พ.ย. - มี.ค.
        if (curMonth <= 3) defaultYear -= 1; // ถ้าเป็น ม.ค.-มี.ค. ให้นับเป็นปีการศึกษาก่อนหน้า
    } else {
        defaultTerm = 3; // เม.ย. - พ.ค. (Summer)
        defaultYear -= 1;
    }

    // Filter States
    const [keyword, setKeyword] = useState('');
    const [academicYear, setAcademicYear] = useState<number | ''>(defaultYear);
    const [term, setTerm] = useState<number | ''>(defaultTerm);
    const [statusFilter, setStatusFilter] = useState<string>('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'approve' | 'reject'>('approve');
    const [selectedGroup, setSelectedGroup] = useState<AdminThesisGroup | null>(null);
    const [isModalLoading, setIsModalLoading] = useState(false);

    // --- Fetch Data ---
    const fetchGroups = async () => {
        setLoading(true);
        try {
            // เลือก Status ตาม Tab
            let groupStatusParam: ThesisGroupStatus | undefined;
            let thesisStatusParam: ThesisStatus | undefined;

            if (activeTab === 'requests') {
                // Tab 1: คำขอตั้งกลุ่มใหม่ -> Filter ที่ Group Status
                // ถ้าเลือก Filter ให้ใช้ค่านั้น, ถ้าไม่เลือก Default เป็น PENDING
                groupStatusParam = statusFilter ? (statusFilter as ThesisGroupStatus) : undefined;
                thesisStatusParam = undefined;
            } else {
                // Tab 2: โครงงานที่กำลังดำเนินการ -> Filter ที่ Thesis Status
                // Group Status ต้อง Approved เสมอสำหรับ Tab นี้
                groupStatusParam = ThesisGroupStatus.APPROVED;
                // ถ้าเลือก Filter ให้ใช้ค่านั้น, ถ้าไม่เลือก Default เป็น IN_PROGRESS
                thesisStatusParam = statusFilter ? (statusFilter as ThesisStatus) : ThesisStatus.IN_PROGRESS;
            }

            const res = await adminThesisService.getGroups({
                page,
                limit: 10,
                keyword,
                start_academic_year: academicYear !== '' ? academicYear : undefined,
                start_term: term !== '' ? term : undefined,
                group_status: groupStatusParam,
                thesis_status: thesisStatusParam
            });

            if (res && res.data) {
                setGroups(res.data);
                setTotalPages(res.meta.totalPages);
                setTotalItems(res.meta.total);

                // อัพเดท selectedGroup ด้วยข้อมูลใหม่ (เพื่อให้หน้า Detail View แสดงค่าล่าสุด)
                if (selectedGroup) {
                    const updated = res.data.find((g: AdminThesisGroup) => g.group_id === selectedGroup.group_id);
                    if (updated) setSelectedGroup(updated);
                }
            }
        } catch (error) {
            console.error("Failed to fetch groups:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch เมื่อมีการเปลี่ยน Filter ใดๆ
    useEffect(() => {
        fetchGroups();
    }, [activeTab, page, keyword, academicYear, term, statusFilter]);

    // Reset ค่าเมื่อเปลี่ยน Tab
    useEffect(() => {
        setStatusFilter('');
        setPage(1);
        setViewMode('list');
    }, [activeTab]);

    // Reset หน้าเมื่อเปลี่ยน Filter อื่นๆ
    useEffect(() => {
        setPage(1);
    }, [keyword, academicYear, term, statusFilter]);

    // --- Handlers ---
    const handleAction = (group: AdminThesisGroup, type: 'approve' | 'reject') => {
        setSelectedGroup(group);
        setModalType(type);
        setIsModalOpen(true);
    };

    const handleViewDetails = (group: AdminThesisGroup) => {
        setSelectedGroup(group);
        setViewMode('detail');
    };

    const handleBackToTable = () => {
        setViewMode('list');
        setSelectedGroup(null);
    };

    const handleRevertToPending = async (group: AdminThesisGroup) => {
        if (!confirm(`ต้องการเปลี่ยนสถานะกลุ่ม "${group.thesis.thesis_name_th}" เป็น "รออนุมัติ" ใช่หรือไม่?`)) return;

        setIsModalLoading(true);
        try {
            // ใช้ updateStatus เป็น PENDING (เหตุผลอาจจะระบุว่าเป็น Admin Reset)
            await adminThesisService.updateStatus(group.group_id, ThesisGroupStatus.PENDING, "Admin reverted to pending");

            // ถ้าอยู่ในหน้า Detail ก็ให้เด้งกลับ หรือจะอยู่หน้าเดิมก็ได้ (แต่ข้อมูลต้อง refresh)
            setViewMode('list');
            fetchGroups();
        } catch (error) {
            alert("เกิดข้อผิดพลาด");
        } finally {
            setIsModalLoading(false);
        }
    };

    const onConfirmAction = async (reason?: string) => {
        if (!selectedGroup) return;
        setIsModalLoading(true);
        try {
            const status = modalType === 'approve' ? ThesisGroupStatus.APPROVED : ThesisGroupStatus.REJECTED;
            await adminThesisService.updateStatus(selectedGroup.group_id, status, reason);
            setIsModalOpen(false);

            if (viewMode === 'detail') {
                setViewMode('list');
            }
            fetchGroups();
        } catch (error) {
            alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
        } finally {
            setIsModalLoading(false);
        }
    };

    const handleDelete = async (thesisId: string) => {
        try {
            await adminThesisService.deleteThesis(thesisId);
            if (viewMode === 'detail') setViewMode('list');
            fetchGroups();
        } catch (error) {
            console.error("Delete error:", error);
            alert("ลบข้อมูลไม่สำเร็จ");
        }
    };

    return (
        <div className="space-y-6">

            {/* --- Header --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">จัดการหัวข้อวิทยานิพนธ์</h1>
                    {viewMode === 'list' && (
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">ทั้งหมด {totalItems} รายการ</p>
                    )}
                </div>
                {viewMode === 'list' && (
                    <button
                        onClick={() => setViewMode('create')}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl shadow-md transition-all text-sm font-medium"
                    >
                        <FiPlus size={16} />
                        สร้างกลุ่มวิทยานิพนธ์
                    </button>
                )}
            </div>

            {/* --- Content --- */}
            {viewMode === 'create' ? (
                <AdminCreateGroupForm
                    onBack={() => setViewMode('list')}
                    onSuccess={() => {
                        setViewMode('list');
                        fetchGroups();
                    }}
                />
            ) : viewMode === 'detail' && selectedGroup ? (
                <ThesisDetailView
                    group={selectedGroup}
                    onBack={handleBackToTable}
                    onApprove={(g) => handleAction(g, 'approve')}
                    onReject={(g) => handleAction(g, 'reject')}
                    onRevertToPending={handleRevertToPending}
                    onRefresh={fetchGroups}
                />
            ) : (
                <>
                    <ThesisFilter
                        keyword={keyword}
                        setKeyword={setKeyword}
                        academicYear={academicYear}
                        setAcademicYear={setAcademicYear}
                        term={term}
                        setTerm={setTerm}
                        activeTab={activeTab}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        defaultYear={defaultYear}
                        defaultTerm={defaultTerm}
                    />

                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="flex space-x-8">
                            <button
                                onClick={() => setActiveTab('requests')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors cursor-pointer ${activeTab === 'requests' 
                                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                            >
                                <FiInbox size={18} />
                                คำขอตั้งกลุ่มใหม่
                            </button>
                            <button
                                onClick={() => setActiveTab('active')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors cursor-pointer ${activeTab === 'active' 
                                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                            >
                                <FiLayers size={18} />
                                โครงงานที่กำลังดำเนินการ
                            </button>
                        </nav>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm min-h-[400px] flex flex-col transition-colors">
                        <div className="flex-1">
                            {activeTab === 'requests' ? (
                                <ThesisRequestTable
                                    data={groups}
                                    isLoading={loading}
                                    onApprove={(g) => handleAction(g, 'approve')}
                                    onReject={(g) => handleAction(g, 'reject')}
                                    onDelete={handleDelete}
                                    onViewDetails={handleViewDetails}
                                    onRefresh={fetchGroups}
                                />
                            ) : (
                                <ActiveThesisTable
                                    data={groups}
                                    isLoading={loading}
                                    onViewDetails={handleViewDetails}
                                    onRefresh={fetchGroups}
                                />
                            )}
                        </div>

                        {!loading && groups.length > 0 && (
                            <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    หน้า {page} จาก {totalPages}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors text-gray-600 dark:text-gray-300"
                                    >
                                        <FiChevronLeft />
                                    </button>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors text-gray-600 dark:text-gray-300"
                                    >
                                        <FiChevronRight />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            <ActionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={onConfirmAction}
                type={modalType}
                title={selectedGroup?.thesis.thesis_name_th || ''}
                isSubmitting={isModalLoading}
            />
        </div>
    );
};