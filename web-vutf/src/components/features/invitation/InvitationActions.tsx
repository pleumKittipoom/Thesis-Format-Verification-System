// src/components/features/invitation/InvitationActions.tsx
// ปุ่ม Accept/Reject คำเชิญ

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiLoader } from 'react-icons/fi';
import { groupMemberService } from '@/services/group-member.service';

interface InvitationActionsProps {
    /** รหัสสมาชิก (member_id) */
    memberId: string;
    /** Callback เมื่อ action สำเร็จ */
    onSuccess?: (action: 'accept' | 'reject') => void;
    /** Callback เมื่อ error */
    onError?: (error: Error) => void;
    /** ขนาดของปุ่ม */
    size?: 'sm' | 'md' | 'lg';
}

/**
 * InvitationActions - ปุ่ม Accept/Reject คำเชิญ
 * * Single Responsibility: จัดการ UI และ logic สำหรับ accept/reject
 * * Features:
 * - ปุ่ม "ตอบรับ" และ "ปฏิเสธ"
 * - Confirm dialog ก่อนดำเนินการ
 * - Loading state
 * - Error handling
 */
export const InvitationActions: React.FC<InvitationActionsProps> = ({
    memberId,
    onSuccess,
    onError,
    size = 'md',
}) => {
    const [isAccepting, setIsAccepting] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);

    // Size configuration
    const sizeConfig = {
        sm: {
            padding: 'px-3 py-1.5',
            fontSize: 'text-xs',
            iconSize: 'w-3.5 h-3.5',
        },
        md: {
            padding: 'px-4 py-2',
            fontSize: 'text-sm',
            iconSize: 'w-4 h-4',
        },
        lg: {
            padding: 'px-6 py-2.5',
            fontSize: 'text-base',
            iconSize: 'w-5 h-5',
        },
    };

    const sizing = sizeConfig[size];

    /**
     * Handle Accept Invitation
     */
    const handleAccept = async () => {
        const result = await Swal.fire({
            title: 'ยืนยันการตอบรับ?',
            text: 'คุณต้องการตอบรับเข้าร่วมกลุ่มวิทยานิพนธ์นี้หรือไม่?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'ตอบรับ',
            cancelButtonText: 'ยกเลิก',
            customClass: {
                popup: 'dark:bg-gray-800 dark:text-white',
                title: 'dark:text-white',
                htmlContainer: 'dark:text-gray-300'
            }
        });

        if (!result.isConfirmed) return;

        setIsAccepting(true);

        try {
            await groupMemberService.acceptInvitation(memberId);

            await Swal.fire({
                icon: 'success',
                title: 'ตอบรับเรียบร้อย!',
                text: 'คุณเข้าร่วมกลุ่มวิทยานิพนธ์แล้ว',
                timer: 2000,
                timerProgressBar: true,
                confirmButtonColor: '#10b981',
                customClass: {
                    popup: 'dark:bg-gray-800 dark:text-white',
                    title: 'dark:text-white',
                    htmlContainer: 'dark:text-gray-300'
                }
            });

            onSuccess?.('accept');
        } catch (error) {
            const err = error instanceof Error ? error : new Error('เกิดข้อผิดพลาด');

            Swal.fire({
                icon: 'info',
                title: 'คุณมีกลุ่มโครงงานอยู่แล้ว',
                text: err.message,
                confirmButtonText: 'รับทราบ',
                confirmButtonColor: '#3085d6',
                customClass: {
                    popup: 'dark:bg-gray-800 dark:text-white',
                    title: 'dark:text-white',
                    htmlContainer: 'dark:text-gray-300'
                }
            });

            onError?.(err);
        } finally {
            setIsAccepting(false);
        }
    };

    /**
     * Handle Reject Invitation
     */
    const handleReject = async () => {
        const result = await Swal.fire({
            title: 'ยืนยันการปฏิเสธ?',
            text: 'คุณต้องการปฏิเสธคำเชิญนี้หรือไม่?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'ปฏิเสธ',
            cancelButtonText: 'ยกเลิก',
            customClass: {
                popup: 'dark:bg-gray-800 dark:text-white',
                title: 'dark:text-white',
                htmlContainer: 'dark:text-gray-300'
            }
        });

        if (!result.isConfirmed) return;

        setIsRejecting(true);

        try {
            await groupMemberService.rejectInvitation(memberId);

            await Swal.fire({
                icon: 'success',
                title: 'ปฏิเสธเรียบร้อย',
                text: 'คุณได้ปฏิเสธคำเชิญแล้ว',
                timer: 2000,
                timerProgressBar: true,
                confirmButtonColor: '#10b981',
                customClass: {
                    popup: 'dark:bg-gray-800 dark:text-white',
                    title: 'dark:text-white',
                    htmlContainer: 'dark:text-gray-300'
                }
            });

            onSuccess?.('reject');
        } catch (error) {
            const err = error instanceof Error ? error : new Error('เกิดข้อผิดพลาด');

            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: err.message,
                confirmButtonColor: '#ef4444',
                customClass: {
                    popup: 'dark:bg-gray-800 dark:text-white',
                    title: 'dark:text-white',
                    htmlContainer: 'dark:text-gray-300'
                }
            });

            onError?.(err);
        } finally {
            setIsRejecting(false);
        }
    };

    const isLoading = isAccepting || isRejecting;

    return (
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            {/* Accept Button */}
            <motion.button
                type="button"
                onClick={handleAccept}
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className={`
          w-full sm:w-auto flex items-center justify-center gap-2 ${sizing.padding} ${sizing.fontSize}
          font-medium rounded-xl transition-all duration-200
          ${isLoading
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-emerald-500 dark:bg-emerald-600 text-white hover:bg-emerald-600 dark:hover:bg-emerald-500 shadow-lg shadow-emerald-200 dark:shadow-none hover:shadow-xl'
                    }
        `}
            >
                {isAccepting ? (
                    <FiLoader className={`${sizing.iconSize} animate-spin`} />
                ) : (
                    <FiCheck className={sizing.iconSize} />
                )}
                ตอบรับ
            </motion.button>

            {/* Reject Button */}
            <motion.button
                type="button"
                onClick={handleReject}
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className={`
          w-full sm:w-auto flex items-center justify-center gap-2 ${sizing.padding} ${sizing.fontSize}
          font-medium rounded-xl transition-all duration-200
          ${isLoading
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-white dark:bg-gray-800 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-800'
                    }
        `}
            >
                {isRejecting ? (
                    <FiLoader className={`${sizing.iconSize} animate-spin`} />
                ) : (
                    <FiX className={sizing.iconSize} />
                )}
                ปฏิเสธ
            </motion.button>
        </div>
    );
};

export default InvitationActions;