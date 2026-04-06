import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Swal from 'sweetalert2';
import { FiSave, FiX, FiCalendar, FiType, FiAlignLeft, FiActivity, FiEdit2, FiPlusCircle, FiLayers, FiHash, FiInfo } from 'react-icons/fi';
import { createInspectionSchema, CreateInspectionSchema } from './inspection.schema';
import { inspectionService } from '@/services/inspection.service';
import { InspectionRound } from '@/types/inspection';
import { showApiErrorAlert } from '@/utils/error-handler';

interface Props {
    initialData?: InspectionRound | null;
    onSuccess: () => void;
    onCancel: () => void;
}

const CreateInspectionForm: React.FC<Props> = ({ initialData, onSuccess, onCancel }) => {
    const [isLoading, setIsLoading] = useState(false);
    const isEditMode = !!initialData;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<CreateInspectionSchema>({
        resolver: zodResolver(createInspectionSchema) as any,
        defaultValues: {
            status: 'CLOSED',
            academicYear: String(new Date().getFullYear() + 543),
            term: '1',
            roundNumber: 1,
            courseType: 'ALL',
            isActive: true,
            title: '',
            description: '',
            startDate: '',
            endDate: ''
        }
    });

    useEffect(() => {
        if (initialData) {
            // สร้างฟังก์ชันแปลงเวลาให้เป็น Local Time (YYYY-MM-DDTHH:mm)
            const toLocalDateTimeString = (dateString: string) => {
                if (!dateString) return '';
                const d = new Date(dateString);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                const hours = String(d.getHours()).padStart(2, '0');
                const minutes = String(d.getMinutes()).padStart(2, '0');

                return `${year}-${month}-${day}T${hours}:${minutes}`;
            };

            setValue('academicYear', initialData.academicYear);
            setValue('term', initialData.term);
            setValue('roundNumber', Number(initialData.roundNumber));
            setValue('courseType', initialData.courseType as 'PRE_PROJECT' | 'PROJECT' | 'ALL');

            setValue('title', initialData.title);
            setValue('description', initialData.description || '');

            setValue('startDate', toLocalDateTimeString(initialData.startDate));
            setValue('endDate', toLocalDateTimeString(initialData.endDate));

            setValue('status', initialData.status);
            setValue('isActive', initialData.isActive);
        }
    }, [initialData, setValue]);

    const onSubmit: SubmitHandler<CreateInspectionSchema> = async (data) => {
        setIsLoading(true);
        try {
            if (isEditMode && initialData) {
                await inspectionService.update(initialData.inspectionId, data);
                Swal.fire({ icon: 'success', title: 'แก้ไขข้อมูลสำเร็จ', showConfirmButton: false, timer: 1500, customClass: { popup: 'dark:bg-gray-800 dark:text-white' } });
            } else {
                await inspectionService.create(data);
                Swal.fire({ icon: 'success', title: 'สร้างรายการสำเร็จ', showConfirmButton: false, timer: 1500, customClass: { popup: 'dark:bg-gray-800 dark:text-white' } });
            }
            onSuccess();
        } catch (error: any) {
            console.error(error);
            showApiErrorAlert(error, 'บันทึกข้อมูลไม่สำเร็จ');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in duration-300 transition-colors">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        {isEditMode ? <FiEdit2 className="text-blue-600 dark:text-blue-400" /> : <FiPlusCircle className="text-blue-600 dark:text-blue-400" />}
                        {isEditMode ? 'แก้ไขรอบการตรวจสอบ' : 'สร้างรอบการตรวจสอบใหม่'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">กำหนดปีการศึกษาและรายละเอียดการสอบ</p>
                </div>
            </div>

            {/* Info Alert Box */}
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg flex items-start gap-3">
                <FiInfo className="text-blue-500 dark:text-blue-400 mt-1 min-w-[20px]" size={20} />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-semibold">ระบบจัดการสถานะอัตโนมัติ</p>
                    <p className="opacity-90 mt-0.5 leading-relaxed">
                        สถานะรอบการส่งเอกสารจะเปลี่ยนเป็น <span className="font-bold text-green-600 dark:text-green-400">OPEN (เปิดรับ)</span> เมื่อถึงเวลาเริ่มต้น
                        และจะเปลี่ยนเป็น <span className="font-bold text-red-600 dark:text-red-400">CLOSED (ปิดรับ)</span> เมื่อสิ้นสุดเวลาโดยอัตโนมัติ
                    </p>
                </div>
            </div>

            <div className="space-y-5">
                {/* --- 1. ส่วนข้อมูลปีการศึกษา --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                            <FiCalendar className="text-gray-400 dark:text-gray-500" /> ปีการศึกษา
                        </label>
                        <input
                            {...register('academicYear')}
                            type="text"
                            maxLength={4}
                            className={`block w-full rounded-xl border p-2.5 text-gray-700 dark:text-white dark:bg-gray-700 shadow-sm outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 ${errors.academicYear ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
                            placeholder="เช่น 2567"
                        />
                        {errors.academicYear && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.academicYear.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                            <FiLayers className="text-gray-400 dark:text-gray-500" /> เทอม
                        </label>
                        <select {...register('term')} className="block w-full rounded-xl border p-2.5 text-gray-700 dark:text-white shadow-sm outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 cursor-pointer">
                            <option value="1">เทอม 1</option>
                            <option value="2">เทอม 2</option>
                            <option value="3">Summer</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                            <FiHash className="text-gray-400 dark:text-gray-500" /> ครั้งที่ (Round)
                        </label>
                        <input
                            {...register('roundNumber')}
                            type="number"
                            min={1}
                            className={`block w-full rounded-xl border p-2.5 text-gray-700 dark:text-white dark:bg-gray-700 shadow-sm outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 ${errors.roundNumber ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
                        />
                        {errors.roundNumber && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.roundNumber.message}</p>}
                    </div>
                </div>

                {/* --- 2. ส่วนประเภทโครงงาน --- */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">ประเภทโครงงานที่เปิดรับ</label>
                    <div className="relative">
                        <select {...register('courseType')} className="block w-full rounded-xl border p-2.5 text-gray-700 dark:text-white shadow-sm outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 cursor-pointer">
                            <option value="ALL">🌐 เปิดรับทั้งหมด (All)</option>
                            <option value="PRE_PROJECT">📘 Pre-Project</option>
                            <option value="PROJECT">📙 Project</option>
                        </select>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>

                {/* --- 3. ข้อมูลทั่วไป --- */}
                <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                        <FiType className="text-gray-400 dark:text-gray-500" /> หัวข้อการตรวจ <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register('title')}
                        type="text"
                        placeholder="เช่น สอบหัวข้อวิทยานิพนธ์ รอบที่ 1"
                        className={`block w-full rounded-xl border p-2.5 text-gray-700 dark:text-white dark:bg-gray-700 shadow-sm transition-all focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none ${errors.title ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
                    />
                    {errors.title && <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">{errors.title.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                        <FiAlignLeft className="text-gray-400 dark:text-gray-500" /> รายละเอียดเพิ่มเติม
                    </label>
                    <textarea
                        {...register('description')}
                        rows={2}
                        className="block w-full rounded-xl border border-gray-200 dark:border-gray-600 p-2.5 text-gray-700 dark:text-white dark:bg-gray-700 shadow-sm outline-none resize-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                            <FiCalendar className="text-gray-400 dark:text-gray-500" /> วันที่เริ่มต้น <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register('startDate')}
                            type="datetime-local"
                            className={`block w-full rounded-xl border p-2.5 text-gray-700 dark:text-white dark:bg-gray-700 shadow-sm outline-none cursor-pointer ${errors.startDate ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
                        />
                        {errors.startDate && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.startDate.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                            <FiCalendar className="text-gray-400 dark:text-gray-500" /> วันที่สิ้นสุด <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register('endDate')}
                            type="datetime-local"
                            className={`block w-full rounded-xl border p-2.5 text-gray-700 dark:text-white dark:bg-gray-700 shadow-sm outline-none cursor-pointer ${errors.endDate ? 'border-red-500 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'}`}
                        />
                        {errors.endDate && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.endDate.message}</p>}
                    </div>
                </div>

                {/* Status Selection */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                        <FiActivity className="text-gray-400 dark:text-gray-500" /> สถานะเริ่มต้น
                    </label>
                    <div className="relative">
                        <select
                            {...register('status')}
                            className="block w-full appearance-none rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-2.5 pr-8 text-gray-700 dark:text-white shadow-sm transition-all focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 hover:border-blue-300 outline-none cursor-pointer"
                        >
                            <option value="CLOSED">🔴 CLOSED (ปิดรับ)</option>
                            <option value="OPEN">🟢 OPEN (เปิดรับ)</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                        </div>
                    </div>
                    <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                        * ท่านสามารถกำหนดสถานะเริ่มต้นเองได้ แต่เมื่อถึงเวลาระบบจะปรับให้อัตโนมัติ
                    </p>
                </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-500 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                    <FiX size={18} /> ยกเลิก
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 dark:bg-blue-600 rounded-xl shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700 dark:hover:bg-blue-500 hover:shadow-blue-300 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
                >
                    {isLoading ? 'กำลังบันทึก...' : (
                        <>
                            <FiSave size={18} /> {isEditMode ? 'บันทึกการแก้ไข' : 'สร้างรายการ'}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default CreateInspectionForm;