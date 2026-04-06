import React, { useState } from 'react';
import { FiUsers, FiUser, FiTrash2, FiUserPlus, FiClock, FiCheck, FiXCircle } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { GroupMember, GroupMemberRole, InvitationStatus } from '@/types/thesis';
import { groupMemberService } from '@/services/group-member.service';
import { InviteMemberModal } from '@/components/features/group/InviteMemberModal';

interface MemberManagementListProps {
    members: GroupMember[];
    groupId: string;
    isOwner: boolean;
    currentUserId: string;
    onUpdate: () => void;
    groupStatus?: string;
}

export const MemberManagementList: React.FC<MemberManagementListProps> = ({
    members,
    groupId,
    isOwner,
    currentUserId,
    onUpdate,
    groupStatus,
}) => {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    const activeMemberCount = members.filter(
        (m) => m.invitation_status !== InvitationStatus.REJECTED
    ).length;

    const handleRemoveMember = async (member: GroupMember) => {
        const result = await Swal.fire({
            title: 'ต้องการลบสมาชิก?',
            text: `ต้องการลบ ${member.student?.first_name} ออกจากกลุ่มหรือไม่?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'ลบสมาชิก',
            cancelButtonText: 'ยกเลิก',
            customClass: {
                popup: 'dark:bg-gray-800 dark:text-white',
                title: 'dark:text-white',
                htmlContainer: 'dark:text-gray-300'
            }
        });

        if (result.isConfirmed) {
            try {
                await groupMemberService.removeMember(groupId, member.member_id);
                Swal.fire({
                    title: 'Deleted!',
                    text: 'ลบสมาชิกเรียบร้อยแล้ว',
                    icon: 'success',
                    customClass: {
                        popup: 'dark:bg-gray-800 dark:text-white',
                        title: 'dark:text-white',
                        htmlContainer: 'dark:text-gray-300'
                    }
                });
                onUpdate();
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || 'ไม่สามารถลบสมาชิกได้ เนื่องจากกลุ่มนี้ได้รับการอนุมัติเรียบร้อยแล้ว';
                Swal.fire({
                    title: 'Error',
                    text: errorMessage,
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

    const getStatusBadge = (status: InvitationStatus | string) => {
        switch (status) {
            case InvitationStatus.APPROVED:
                return <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full"><FiCheck className="w-3" /> ตอบรับแล้ว</span>;
            case InvitationStatus.PENDING:
                return <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-full"><FiClock className="w-3" /> รอตอบรับ</span>;
            case InvitationStatus.REJECTED:
                return <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-full"><FiXCircle className="w-3" /> ปฏิเสธ</span>;
            default:
                return null;
        }
    };

    // Sort: Owner first
    const sortedMembers = [...members].sort((a, b) => {
        if (a.role === GroupMemberRole.OWNER) return -1;
        if (b.role === GroupMemberRole.OWNER) return 1;
        return 0;
    });

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            {/* 1. เปลี่ยน items-center เป็น items-start ในมือถือ และใช้ flex-col */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

                {/* ส่วนหัวข้อ: สมาชิกกลุ่ม */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center shrink-0">
                        <FiUsers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">สมาชิกกลุ่ม ({activeMemberCount})</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">จัดการสมาชิกในกลุ่ม</p>
                    </div>
                </div>

                {/* 2. ส่วนข้อความแจ้งเตือน: ใช้ flex-1 เพื่อให้ขยายในจอคอม แต่ในมือถือจะลงมาบรรทัดใหม่ตาม flex-col */}
                <div className="flex items-start md:items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl flex-1 md:flex-initial transition-colors">
                    <div className="w-2 h-2 bg-amber-400 dark:bg-amber-500 rounded-full animate-pulse shrink-0 mt-1.5 md:mt-0" />
                    <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                        <span className="font-semibold">หมายเหตุ:</span> สมาชิกทุกคนต้องกดตอบรับคำเชิญ เจ้าหน้าที่จึงจะเริ่มดำเนินการอนุมัติกลุ่มได้
                    </p>
                </div>

                {/* 3. ปุ่มเชิญสมาชิก: ในมือถือจะแสดงต่อท้ายสุดของบรรทัด */}
                {isOwner && groupStatus?.toLowerCase() !== 'approved' && (
                    <button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-sm rounded-lg transition-colors shrink-0"
                    >
                        <FiUserPlus /> เชิญสมาชิก
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {sortedMembers.map((member) => (
                    <div
                        key={member.member_id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700 gap-4 transition-colors"
                    >
                        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                            {/* รูป Profile */}
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 ${member.role === GroupMemberRole.OWNER 
                                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' 
                                : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300'
                                }`}>
                                <FiUser className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                                        {member.student?.prefix_name}{member.student?.first_name} {member.student?.last_name}
                                    </h3>
                                    {member.role === GroupMemberRole.OWNER && (
                                        <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full shrink-0">
                                            OWNER
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{member.student?.student_code}</span>
                                    <div className="scale-90 sm:scale-100 origin-left">
                                        {getStatusBadge(member.invitation_status)}
                                    </div>
                                </div>
                            </div>

                            {/* ปุ่มลบสำหรับหน้าจอมือถือ (แสดงที่มุมขวาบนของ Card) */}
                            <div className="sm:hidden ml-auto">
                                {isOwner && member.role !== GroupMemberRole.OWNER &&
                                    member.student_uuid !== currentUserId && groupStatus !== 'approved' && (
                                        <button
                                            onClick={() => handleRemoveMember(member)}
                                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 active:bg-red-50 dark:active:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <FiTrash2 className="w-5 h-5" />
                                        </button>
                                    )}
                            </div>
                        </div>

                        {/* ปุ่มลบสำหรับหน้าจอคอมพิวเตอร์ (แสดงด้านขวาสุด) */}
                        <div className="hidden sm:block">
                            {isOwner && member.role !== GroupMemberRole.OWNER &&
                                member.student_uuid !== currentUserId && groupStatus !== 'approved' && (
                                    <button
                                        onClick={() => handleRemoveMember(member)}
                                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="ลบสมาชิก"
                                    >
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>
                                )}
                        </div>
                    </div>
                ))}
            </div>

            {isInviteModalOpen && (
                <InviteMemberModal
                    groupId={groupId}
                    onClose={() => setIsInviteModalOpen(false)}
                    onSuccess={() => {
                        setIsInviteModalOpen(false);
                        onUpdate();
                    }}
                />
            )}
        </div>
    );
};