// src/components/features/admin/thesis-topic/AdminCreateGroupForm.tsx

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { FiSend, FiLoader, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

import { ThesisInfoSection } from '@/components/features/thesis/ThesisInfoSection';
import { MemberSelectSection } from '@/components/features/thesis/MemberSelectSection';
import { AdvisorSelectSection } from '@/components/features/thesis/AdvisorSelectSection';
import { adminThesisService } from '@/services/admin-thesis.service';
import {
    CreateThesisGroupFormData,
    AdvisorRole,
    GroupMemberRole,
} from '@/types/thesis';

interface AdminCreateGroupFormData extends CreateThesisGroupFormData {
    auto_approve: boolean;
}

interface AdminCreateGroupFormProps {
    onBack: () => void;
    onSuccess: () => void;
}

export const AdminCreateGroupForm: React.FC<AdminCreateGroupFormProps> = ({ onBack, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<AdminCreateGroupFormData>({
        defaultValues: {
            thesis_code: '',
            thesis_name_th: '',
            thesis_name_en: '',
            graduation_year: undefined,
            group_members: [],
            advisors: [],
            auto_approve: true, // Default to true for admin
        },
    });

    // Watch values for validation
    const advisors = watch('advisors') || [];
    const members = watch('group_members') || [];

    const hasMainAdvisor = advisors.some((a) => a.role === AdvisorRole.MAIN);

    const onSubmit = async (data: AdminCreateGroupFormData) => {
        // Validate
        if (members.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'กรุณาเลือกนักศึกษา',
                text: 'ต้องมีสมาชิกในกลุ่มอย่างน้อย 1 คน',
                confirmButtonColor: '#3b82f6',
            });
            return;
        }

        if (!hasMainAdvisor) {
            Swal.fire({
                icon: 'warning',
                title: 'กรุณาเลือกอาจารย์ที่ปรึกษาหลัก',
                text: 'ต้องมีอาจารย์ที่ปรึกษาหลักอย่างน้อย 1 คน',
                confirmButtonColor: '#3b82f6',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                thesis: {
                    thesis_code: data.thesis_code,
                    thesis_name_th: data.thesis_name_th,
                    thesis_name_en: data.thesis_name_en,
                    graduation_year: data.graduation_year,
                    course_type: data.course_type,
                    start_academic_year: data.start_academic_year,
                    start_term: data.start_term,
                },
                group_member: data.group_members.map((m, index) => ({
                    student_uuid: m.student_uuid,
                    // Give the first added member the OWNER role
                    role: index === 0 ? GroupMemberRole.OWNER : GroupMemberRole.MEMBER,
                })),
                advisor: data.advisors.map((a) => ({
                    instructor_uuid: a.instructor_uuid,
                    role: a.role,
                })),
                auto_approve: data.auto_approve,
            };

            await adminThesisService.createGroup(payload);

            await Swal.fire({
                icon: 'success',
                title: 'สร้างกลุ่มวิทยานิพนธ์สำเร็จ!',
                text: payload.auto_approve ? 'กลุ่มถูกอนุมัติทันที' : 'กลุ่มถูกสร้างในสถานะรออนุมัติ',
                confirmButtonColor: '#10b981',
                timer: 2000,
                timerProgressBar: true,
            });

            onSuccess();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาด';
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: errorMessage,
                confirmButtonColor: '#ef4444',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <ThesisInfoSection register={register as any} errors={errors as any} />
                <MemberSelectSection watch={watch as any} setValue={setValue as any} />
                <AdvisorSelectSection watch={watch as any} setValue={setValue as any} errors={errors as any} />

                {/* Admin Specific: Auto Approve Option */}
                <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none shrink-0">
                            <FiCheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2">ตัวเลือกเพิ่มเติมสำหรับผู้ดูแลระบบ</h2>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-indigo-500 transition-all duration-200"
                                    {...register('auto_approve')}
                                />
                                <div>
                                    <span className="block text-sm font-medium text-gray-900 dark:text-white">อนุมัติกลุ่มนี้ทันที</span>
                                    <span className="block text-xs text-gray-500 dark:text-gray-400">กลุ่มจะเริ่มดำเนินการได้ทันที ไม่ต้องรอผู้ดูแลอนุมัติอีกครั้ง</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Actions */}
                <div className="flex justify-between items-center gap-4 pt-4">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex items-center gap-2 px-6 py-2.5 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium text-sm transition-all"
                    >
                        <FiArrowLeft className="w-4 h-4" /> ย้อนกลับ
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-semibold text-white text-sm shadow-lg
                        transition-all duration-200
                        ${isSubmitting
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-blue-200 hover:-translate-y-0.5'
                            }
                        `}
                    >
                        {isSubmitting ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSend className="w-4 h-4" />}
                        {isSubmitting ? 'กำลังสร้าง...' : 'สร้างกลุ่มวิทยานิพนธ์'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default AdminCreateGroupForm;
