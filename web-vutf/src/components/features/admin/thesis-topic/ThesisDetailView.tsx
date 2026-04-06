// src/components/features/admin/thesis-topic/ThesisDetailView.tsx
import { useState } from 'react';
import {
    FiUser, FiBook, FiTarget, FiArrowLeft,
    FiClock, FiPhone, FiHash, FiCheck, FiX, FiRefreshCcw,
    FiEdit3, FiSave, FiLoader
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import { AdminThesisGroup, ThesisGroupStatus } from '../../../../types/admin-thesis';
import { adminThesisService } from '../../../../services/admin-thesis.service';

// Helper Functions
const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatCourseType = (type?: string) => {
    if (type === 'PRE_PROJECT') return 'เตรียมโครงงาน (Pre-Project)';
    if (type === 'PROJECT') return 'โครงงาน (Project)';
    return type || '-';
};

interface Props {
    group: AdminThesisGroup;
    onBack: () => void;
    onApprove: (group: AdminThesisGroup) => void;
    onReject: (group: AdminThesisGroup) => void;
    onRevertToPending?: (group: AdminThesisGroup) => void;
    onRefresh?: () => void;
}

export const ThesisDetailView = ({
    group,
    onBack,
    onApprove,
    onReject,
    onRevertToPending,
    onRefresh
}: Props) => {

    // --- Edit Mode State ---
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editForm, setEditForm] = useState({
        thesis_code: group.thesis?.thesis_code || '',
        thesis_name_th: group.thesis?.thesis_name_th || '',
        thesis_name_en: group.thesis?.thesis_name_en || '',
        course_type: group.thesis?.course_type || 'PRE_PROJECT',
        start_academic_year: group.thesis?.start_academic_year || 2568,
        start_term: group.thesis?.start_term || 1,
        graduation_year: group.thesis?.graduation_year || 0,
    });

    const handleStartEdit = () => {
        setEditForm({
            thesis_code: group.thesis?.thesis_code || '',
            thesis_name_th: group.thesis?.thesis_name_th || '',
            thesis_name_en: group.thesis?.thesis_name_en || '',
            course_type: group.thesis?.course_type || 'PRE_PROJECT',
            start_academic_year: group.thesis?.start_academic_year || 2568,
            start_term: group.thesis?.start_term || 1,
            graduation_year: group.thesis?.graduation_year || 0,
        });
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleSaveEdit = async () => {
        if (!editForm.thesis_name_th.trim() || !editForm.thesis_name_en.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'ข้อมูลไม่ครบ',
                text: 'กรุณากรอกชื่อวิทยานิพนธ์ทั้งภาษาไทยและภาษาอังกฤษ',
                customClass: {
                    popup: 'dark:bg-gray-800 dark:text-white',
                    title: 'dark:text-white',
                    htmlContainer: 'dark:text-gray-300'
                }
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await adminThesisService.updateThesisInfo(group.group_id, {
                thesis_code: editForm.thesis_code,
                thesis_name_th: editForm.thesis_name_th,
                thesis_name_en: editForm.thesis_name_en,
                course_type: editForm.course_type,
                start_academic_year: Number(editForm.start_academic_year),
                start_term: Number(editForm.start_term),
                graduation_year: Number(editForm.graduation_year) || undefined,
            });

            Swal.fire({
                icon: 'success',
                title: 'บันทึกสำเร็จ',
                text: 'แก้ไขข้อมูลวิทยานิพนธ์เรียบร้อยแล้ว',
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                    popup: 'dark:bg-gray-800 dark:text-white',
                    title: 'dark:text-white',
                    htmlContainer: 'dark:text-gray-300'
                }
            });

            setIsEditing(false);
            onRefresh?.();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'บันทึกไม่สำเร็จ',
                text: error instanceof Error ? error.message : 'เกิดข้อผิดพลาด',
                customClass: {
                    popup: 'dark:bg-gray-800 dark:text-white',
                    title: 'dark:text-white',
                    htmlContainer: 'dark:text-gray-300'
                }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // รวม Advisor ทั้งหมดและเรียง Main ขึ้นก่อน
    const allAdvisors = [...(group.advisor || [])].sort((a) =>
        a.role === 'main' ? -1 : 1
    );

    const isPending = group.status === ThesisGroupStatus.PENDING;
    const isApproved = group.status === ThesisGroupStatus.APPROVED;

    // Calculate year options
    const currentYear = new Date().getFullYear() + 543;
    const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">

            {/* --- Header --- */}
            <div className="border-b border-gray-100 dark:border-gray-700 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-700/30">

                {/* Left Side: Back Button & Title */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
                    >
                        <FiArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">รายละเอียดโครงงาน</h3>
                            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize
    ${group.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' :
                                    group.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' :
                                        group.status === 'incomplete' ? 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600' :
                                            'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'}`}
                            >
                                {group.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                            <FiClock size={14} /> สร้างเมื่อ: {formatDate(group.created_at)}
                            {group.approved_at && <span className="text-green-600 dark:text-green-400 ml-2">| อนุมัติเมื่อ: {formatDate(group.approved_at)}</span>}
                        </p>
                    </div>
                </div>

                {/* Right Side: Action Buttons */}
                <div className="flex items-center gap-3">
                    {/* Case 1: ถ้าเป็น Pending แสดงปุ่ม อนุมัติ/ปฏิเสธ */}
                    {isPending && (
                        <>
                            <button
                                onClick={() => onReject(group)}
                                disabled={!group.isReadyForAdminAction}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 font-medium bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                <FiX size={18} />
                                ปฏิเสธคำขอ
                            </button>
                            <button
                                onClick={() => onApprove(group)}
                                disabled={!group.isReadyForAdminAction}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 dark:bg-blue-600 text-white font-medium hover:bg-blue-700 dark:hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-blue-200 dark:shadow-none"
                            >
                                <FiCheck size={18} />
                                อนุมัติคำขอ
                            </button>
                        </>
                    )}

                    {/* Case 2: ถ้าเป็น Approved แสดงปุ่มแก้ไขสถานะกลับ (เพื่อให้ นศ. แก้ไขได้) */}
                    {isApproved && onRevertToPending && (
                        <button
                            onClick={() => onRevertToPending(group)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 font-medium bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all shadow-sm"
                        >
                            <FiRefreshCcw size={18} />
                            เปลี่ยนสถานะให้นักศึกษาแก้ไข
                        </button>
                    )}

                    {/* Case 3: สถานะอื่นๆ ซ่อนปุ่ม */}
                </div>

            </div>

            {/* --- Body Content --- */}
            <div className="p-6 lg:p-8 space-y-8">

                {/* ส่วนแสดงเหตุผลการปฏิเสธ*/}
                {group.status === 'rejected' && group.rejection_reason && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900 rounded-xl p-4 flex items-start gap-3">
                        <div className="p-2 bg-white dark:bg-gray-800 rounded-full text-red-500 dark:text-red-400 shadow-sm border border-red-100 dark:border-red-900 shrink-0">
                            <FiX size={16} />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-red-800 dark:text-red-300 mb-1">เหตุผลที่ปฏิเสธคำขอ</h4>
                            <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed whitespace-pre-line">
                                {group.rejection_reason}
                            </p>

                            {/* หมายเหตุ */}
                            <div className="mt-3 pt-2 border-t border-red-200/60 dark:border-red-800/60 flex items-center gap-2">
                                <span className="text-[11px] font-bold bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-2 py-0.5 rounded">
                                    หมายเหตุ
                                </span>
                                <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                                    รอนักศึกษาดำเนินการแก้ไขข้อมูล
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* 1. ข้อมูลวิทยานิพนธ์ */}
                <section>
                    <div className="flex items-center justify-between mb-4 border-b dark:border-gray-700 pb-2">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                            <FiBook className="text-blue-600 dark:text-blue-400" /> ข้อมูลวิทยานิพนธ์
                        </h4>
                        {!isEditing ? (
                            <button
                                onClick={handleStartEdit}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 transition-all"
                            >
                                <FiEdit3 size={14} />
                                แก้ไขข้อมูล
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleCancelEdit}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-all disabled:opacity-50"
                                >
                                    <FiX size={14} />
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? <FiLoader size={14} className="animate-spin" /> : <FiSave size={14} />}
                                    บันทึก
                                </button>
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        /* ========== Edit Mode ========== */
                        <div className="bg-blue-50/30 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-900/30 space-y-4">
                            {/* Thesis Code - Editable */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">รหัสวิทยานิพนธ์ <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={editForm.thesis_code}
                                    onChange={e => setEditForm(prev => ({ ...prev, thesis_code: e.target.value }))}
                                    className="text-black dark:text-white w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-mono outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                />
                            </div>

                            {/* Course Type, Start Year, Term */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/60 dark:bg-gray-800/40 rounded-xl border border-blue-100/50 dark:border-blue-900/20">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ประเภทวิชา <span className="text-red-500">*</span></label>
                                    <select
                                        value={editForm.course_type}
                                        onChange={e => setEditForm(prev => ({ ...prev, course_type: e.target.value }))}
                                        className="text-black dark:text-white w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                    >
                                        <option value="PRE_PROJECT">Pre-Project</option>
                                        <option value="PROJECT">Project</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ปีที่เริ่ม <span className="text-red-500">*</span></label>
                                    <select
                                        value={editForm.start_academic_year}
                                        onChange={e => setEditForm(prev => ({ ...prev, start_academic_year: Number(e.target.value) }))}
                                        className="text-black dark:text-white w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                    >
                                        {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">เทอมที่เริ่ม <span className="text-red-500">*</span></label>
                                    <select
                                        value={editForm.start_term}
                                        onChange={e => setEditForm(prev => ({ ...prev, start_term: Number(e.target.value) }))}
                                        className="text-black dark:text-white w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                    >
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3 (ฤดูร้อน)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Thai Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    ชื่อวิทยานิพนธ์ (ภาษาไทย) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={editForm.thesis_name_th}
                                    onChange={e => setEditForm(prev => ({ ...prev, thesis_name_th: e.target.value }))}
                                    className="text-black dark:text-white w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                />
                            </div>

                            {/* English Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    ชื่อวิทยานิพนธ์ (ภาษาอังกฤษ) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={editForm.thesis_name_en}
                                    onChange={e => setEditForm(prev => ({ ...prev, thesis_name_en: e.target.value }))}
                                    className="text-black dark:text-white w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                />
                            </div>

                            {/* Graduation Year */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ปีการศึกษาที่จบ</label>
                                <select
                                    value={editForm.graduation_year || ''}
                                    onChange={e => setEditForm(prev => ({ ...prev, graduation_year: Number(e.target.value) || 0 }))}
                                    className="text-black dark:text-white w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                >
                                    <option value="">-- เลือกปี --</option>
                                    {yearOptions.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ) : (
                        /* ========== Read-Only Mode (เดิม) ========== */
                        <div className="bg-blue-50/30 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-900/30">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-blue-600 dark:bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                                            {group.thesis?.thesis_code || 'NO CODE'}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                            ({formatCourseType(group.thesis?.course_type)})
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
                                        {group.thesis?.thesis_name_th}
                                    </h2>
                                    <h3 className="text-lg text-gray-600 dark:text-gray-400 italic mt-1 font-medium">
                                        {group.thesis?.thesis_name_en}
                                    </h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">ปีการศึกษาที่เริ่ม</p>
                                    <p className="font-semibold text-gray-900 dark:text-white text-lg">
                                        {group.thesis?.start_academic_year || '-'}/{group.thesis?.start_term || '-'}
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">ปีที่คาดว่าจะจบ</p>
                                    <p className="font-semibold text-gray-900 dark:text-white text-lg">
                                        {group.thesis?.graduation_year || '-'}
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">สถานะวิทยานิพนธ์</p>
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold
                                    ${group.thesis?.status === 'PASSED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                        group.thesis?.status === 'FAILED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}
                                    >
                                        {group.thesis?.status}
                                    </span>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">ความคืบหน้ากลุ่ม</p>
                                    <p className="font-semibold text-gray-900 dark:text-white text-lg">
                                        {group.memberProgress} <span className="text-xs font-normal text-gray-500 dark:text-gray-400">คน</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 2. สมาชิกในกลุ่ม */}
                    <section>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b dark:border-gray-700 pb-2">
                            <FiUser className="text-indigo-600 dark:text-indigo-400" /> สมาชิกในกลุ่ม ({group.members.length})
                        </h4>
                        <div className="space-y-3">
                            {group.members.map((member, idx) => (
                                <div key={idx} className="relative flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-shadow">
                                    {member.role === 'owner' && (
                                        <div className="absolute top-0 right-0 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-lg">
                                            OWNER
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg font-bold border border-indigo-100 dark:border-indigo-900 shrink-0">
                                            {member.student.first_name[0]}
                                        </div>
                                        <div>
                                            <p className="text-base font-bold text-gray-900 dark:text-white">
                                                {member.student.first_name} {member.student.last_name}
                                            </p>
                                            <div className="flex flex-wrap gap-x-3 text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                                <span className="flex items-center gap-1"><FiHash size={12} /> {member.student.student_code}</span>
                                                <span className="flex items-center gap-1"><FiPhone size={12} /> {member.student.phone || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 sm:mt-0 flex items-center justify-end">
                                        {member.invitation_status === 'approved' ? (
                                            <span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full border border-green-100 dark:border-green-900 font-medium">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> ตอบรับแล้ว
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-600 font-medium">
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500"></span> รอการตอบรับ
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 3. อาจารย์ที่ปรึกษา */}
                    <section>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2 border-b dark:border-gray-700 pb-2">
                            <FiTarget className="text-rose-600 dark:text-rose-400" /> อาจารย์ที่ปรึกษา
                        </h4>
                        <div className="space-y-3">
                            {allAdvisors.length > 0 ? allAdvisors.map((adv, idx) => {
                                const isMain = adv.role === 'main';
                                return (
                                    <div
                                        key={idx}
                                        className={`relative flex justify-between items-center p-4 rounded-xl border transition-shadow hover:shadow-sm
                               ${isMain
                                                ? 'bg-indigo-50/40 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-900/30'
                                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
                                    >
                                        {/* Decorative bar for main advisor */}
                                        {isMain && <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 dark:bg-indigo-400 rounded-l-xl"></div>}

                                        <div>
                                            <p className={`text-base font-bold ${isMain ? 'text-indigo-900 dark:text-indigo-300' : 'text-gray-900 dark:text-white'}`}>
                                                {adv.instructor.first_name} {adv.instructor.last_name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                                                <span className="bg-white/80 dark:bg-gray-700 px-1.5 rounded border border-gray-200 dark:border-gray-600">
                                                    CODE: {adv.instructor.instructor_code}
                                                </span>
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-end gap-1">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider
                                    ${isMain
                                                    ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
                                            >
                                                {isMain ? 'ที่ปรึกษาหลัก' : 'ที่ปรึกษาร่วม'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="p-8 text-center border border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-sm">
                                    ยังไม่ระบุอาจารย์ที่ปรึกษา
                                </div>
                            )}
                        </div>
                    </section>
                </div>

            </div>
        </div>
    );
};