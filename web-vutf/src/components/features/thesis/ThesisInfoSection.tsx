// src/components/features/thesis/ThesisInfoSection.tsx
// ส่วนกรอกข้อมูลวิทยานิพนธ์

import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { CreateThesisGroupFormData, CourseType } from '@/types/thesis'; // ตรวจสอบว่ามี CourseType ใน types
import { FiFileText, FiHash, FiCalendar, FiBookOpen, FiClock } from 'react-icons/fi';

interface ThesisInfoSectionProps {
    /** Register function จาก react-hook-form */
    register: UseFormRegister<CreateThesisGroupFormData>;
    /** Errors จาก react-hook-form */
    errors: FieldErrors<CreateThesisGroupFormData>;
}

/**
 * ThesisInfoSection - ส่วนกรอกข้อมูลวิทยานิพนธ์
 * * Single Responsibility: จัดการเฉพาะ form fields ของข้อมูลวิทยานิพนธ์
 * * Fields:
 * - thesis_code: รหัสวิทยานิพนธ์ (required)
 * - thesis_name_th: ชื่อภาษาไทย (required)
 * - thesis_name_en: ชื่อภาษาอังกฤษ (required)
 * - graduation_year: ปีที่จบการศึกษา (optional)
 */
export const ThesisInfoSection: React.FC<ThesisInfoSectionProps> = ({
    register,
    errors,
}) => {
    // สร้าง year options สำหรับปีที่เริ่มและปีที่จบ (พ.ศ.)
    const currentYear = new Date().getFullYear() + 543;
    const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    const inputClass = (hasError: boolean) => `
        w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl text-gray-900 dark:text-white text-sm
        transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500
        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800
        ${hasError 
            ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/10' 
            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}
    `;

    return (
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start md:items-center gap-4 mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none shrink-0">
                        <FiFileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                            ข้อมูลวิทยานิพนธ์
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            กรอกรายละเอียดโครงการวิทยานิพนธ์
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-5">
                {/* Thesis Code */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <FiHash className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        รหัสวิทยานิพนธ์ <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="เช่น THS-2024-001"
                        className={inputClass(!!errors.thesis_code)}
                        {...register('thesis_code', { required: 'กรุณากรอกรหัสวิทยานิพนธ์' })}
                    />
                    {errors.thesis_code && <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{errors.thesis_code.message}</p>}
                </div>

                {/* Course Type, Start Year, Start Term ในแถวเดียวกัน */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <FiBookOpen className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            ประเภทวิชา <span className="text-red-500 dark:text-red-400">*</span>
                        </label>
                        <select
                            className={inputClass(!!errors.course_type)}
                            {...register('course_type', { required: 'กรุณาเลือกประเภทวิชา' })}
                        >
                            <option value="">-- เลือกประเภท --</option>
                            <option value={CourseType.PRE_PROJECT}>เตรียมโครงงาน (Pre-Project)</option>
                            <option value={CourseType.PROJECT}>โครงงาน (Project)</option>
                        </select>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <FiCalendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            ปีการศึกษาที่เริ่ม <span className="text-red-500 dark:text-red-400">*</span>
                        </label>
                        <select
                            className={inputClass(!!errors.start_academic_year)}
                            {...register('start_academic_year', { required: 'กรุณาเลือกปีที่เริ่ม', valueAsNumber: true })}
                        >
                            <option value="">-- เลือกปี --</option>
                            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <FiClock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            ภาคเรียนที่เริ่ม <span className="text-red-500 dark:text-red-400">*</span>
                        </label>
                        <select
                            className={inputClass(!!errors.start_term)}
                            {...register('start_term', { required: 'กรุณาเลือกภาคเรียน', valueAsNumber: true })}
                        >
                            <option value="">-- ภาคเรียน --</option>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3 (ฤดูร้อน)</option>
                        </select>
                    </div>
                </div>

                {/* Thesis Name TH & EN */}
                <div className="grid grid-cols-1 gap-5">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <FiFileText className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            ชื่อวิทยานิพนธ์ (ภาษาไทย) <span className="text-red-500 dark:text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="กรอกชื่อภาษาไทย"
                            className={inputClass(!!errors.thesis_name_th)}
                            {...register('thesis_name_th', { required: 'กรุณากรอกชื่อภาษาไทย' })}
                        />
                        {errors.thesis_name_th && <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{errors.thesis_name_th.message}</p>}
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <FiFileText className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                            ชื่อวิทยานิพนธ์ (ภาษาอังกฤษ) <span className="text-red-500 dark:text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter English Title"
                            className={inputClass(!!errors.thesis_name_en)}
                            {...register('thesis_name_en', { required: 'กรุณากรอกชื่อภาษาอังกฤษ' })}
                        />
                        {errors.thesis_name_en && <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{errors.thesis_name_en.message}</p>}
                    </div>
                </div>

                {/* Graduation Year */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <FiCalendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        ปีการศึกษาที่คาดว่าจะจบ <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <select
                        className={inputClass(!!errors.graduation_year)}
                        {...register('graduation_year', {
                            required: 'กรุณาเลือกปีการศึกษาที่คาดว่าจะจบ',
                            setValueAs: (v) => (v === '' ? undefined : parseInt(v, 10)),
                        })}
                    >
                        <option value="">-- เลือกปีการศึกษา --</option>
                        {yearOptions.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    {errors.graduation_year && (
                        <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{errors.graduation_year.message}</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ThesisInfoSection;