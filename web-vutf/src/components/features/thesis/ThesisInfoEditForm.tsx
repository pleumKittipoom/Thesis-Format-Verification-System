// src/components/features/thesis/ThesisInfoEditForm.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiFileText, FiSave, FiLoader } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { Thesis, UpdateThesisDto, CourseType } from '@/types/thesis'; 
import { thesisGroupService } from '@/services/thesis-group.service';

interface ThesisInfoEditFormProps {
    thesis: Thesis;
    groupId: string;
    onUpdate: () => void;
}

export const ThesisInfoEditForm: React.FC<ThesisInfoEditFormProps> = ({
    thesis,
    groupId,
    onUpdate,
}) => {
    // Suppress unused
    // console.log(groupId);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UpdateThesisDto>({
        defaultValues: {
            thesis_name_th: thesis.thesis_name_th,
            thesis_name_en: thesis.thesis_name_en,
            graduation_year: thesis.graduation_year || undefined,
            course_type: thesis.course_type,
            start_academic_year: thesis.start_academic_year,
            start_term: thesis.start_term,
        },
    });

    useEffect(() => {
        reset({
            thesis_name_th: thesis.thesis_name_th,
            thesis_name_en: thesis.thesis_name_en,
            graduation_year: thesis.graduation_year || undefined,
            course_type: thesis.course_type,
            start_academic_year: thesis.start_academic_year,
            start_term: thesis.start_term,
        });
    }, [thesis, reset]);

    const onSubmit = async (data: UpdateThesisDto) => {
        setIsSubmitting(true);
        try {
            await thesisGroupService.updateThesisInfo(groupId, data);

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
            onUpdate();
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

    // Calculate year options (Current year +/- 5)
    const currentYear = new Date().getFullYear() + 543;
    const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <FiFileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">ข้อมูลวิทยานิพนธ์</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">แก้ไขรายละเอียดวิทยานิพนธ์</p>
                </div>
            </div>

            <div className="space-y-4">
                {/* Read-only Thesis Code */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">รหัสวิทยานิพนธ์</label>
                    <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 text-sm font-mono">
                        {thesis.thesis_code}
                    </div>
                </div>

                {/* Grid สำหรับ Course Type, Start Year, Term */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-900/30 transition-colors">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ประเภทวิชา <span className="text-red-500 dark:text-red-400">*</span></label>
                        <select
                            className="text-black dark:text-white w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
                            {...register('course_type', { required: 'ระบุประเภทวิชา' })}
                        >
                            <option value={CourseType.PRE_PROJECT}>Pre-Project</option>
                            <option value={CourseType.PROJECT}>Project</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ปีที่เริ่ม <span className="text-red-500 dark:text-red-400">*</span></label>
                        <select
                            className="text-black dark:text-white w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
                            {...register('start_academic_year', { required: 'ระบุปีที่เริ่ม', valueAsNumber: true })}
                        >
                            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">เทอมที่เริ่ม <span className="text-red-500 dark:text-red-400">*</span></label>
                        <select
                            className="text-black dark:text-white w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
                            {...register('start_term', { required: 'ระบุเทอม', valueAsNumber: true })}
                        >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3 (ฤดูร้อน)</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ชื่อวิทยานิพนธ์ (ภาษาไทย) <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        className={`text-black dark:text-white w-full px-4 py-2.5 bg-white dark:bg-gray-700 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-colors
                            ${errors.thesis_name_th ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'}
                        `}
                        {...register('thesis_name_th', { required: 'กรุณากรอกชื่อภาษาไทย' })}
                    />
                    {errors.thesis_name_th && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.thesis_name_th.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ชื่อวิทยานิพนธ์ (ภาษาอังกฤษ) <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        className={`text-black dark:text-white w-full px-4 py-2.5 bg-white dark:bg-gray-700 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-colors
                            ${errors.thesis_name_en ? 'border-red-300 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'}
                        `}
                        {...register('thesis_name_en', { required: 'กรุณากรอกชื่อภาษาอังกฤษ' })}
                    />
                    {errors.thesis_name_en && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.thesis_name_en.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ปีการศึกษาที่จบ
                    </label>
                    <select
                        className="text-black dark:text-white w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
                        {...register('graduation_year', { valueAsNumber: true })}
                    >
                        <option value="">-- เลือกปี --</option>
                        {yearOptions.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 dark:bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? <FiLoader className="animate-spin" /> : <FiSave />}
                        บันทึกการเปลี่ยนแปลง
                    </button>
                </div>
            </div>
        </form>
    );
};