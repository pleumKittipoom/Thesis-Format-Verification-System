// src/hooks/admin/useSectionManagement.ts
import { useState } from 'react';
import Swal from 'sweetalert2';
import { classSectionService } from '../../services/class-section.service';
import { ClassSection } from '../../types/class-section';

export const useSectionManagement = () => {
    const [data, setData] = useState<ClassSection[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [meta, setMeta] = useState<any>(null);

    const fetchSections = async (
        page: number,
        limit: number,
        search: string,
        filters?: { academic_year?: number; term?: string }
    ) => {
        setIsLoading(true);
        try {
            const res = await classSectionService.getAll({
                page,
                limit,
                search,
                ...filters // ค่า academic_year และ term จะถูกส่งไปที่นี่
            });

            setData(res.data);
            setMeta(res.meta);
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'ไม่สามารถดึงข้อมูลได้', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const saveSection = async (formData: any, sectionId: number | undefined, onSuccess: () => void) => {
        setIsSaving(true);
        try {
            if (sectionId) {
                await classSectionService.update(sectionId, formData);
                Swal.fire('สำเร็จ', 'แก้ไขข้อมูลเรียบร้อย', 'success');
            } else {
                await classSectionService.create(formData);
                Swal.fire('สำเร็จ', 'เพิ่มกลุ่มเรียนเรียบร้อย', 'success');
            }
            onSuccess();
        } catch (error: any) {
            console.error('Save Error:', error);
            const msg = error.message || 'บันทึกไม่สำเร็จ';

            if (msg.includes('มีอยู่ในระบบแล้ว') || msg.includes('Duplicate')) {
                Swal.fire('ข้อมูลซ้ำ', msg, 'warning');
            } else {
                Swal.fire('เกิดข้อผิดพลาด', msg, 'error');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const deleteSection = async (id: number, onSuccess: () => void) => {
        const result = await Swal.fire({
            title: 'ยืนยันการลบ?',
            text: "ข้อมูลกลุ่มเรียนจะถูกลบ",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'ลบข้อมูล'
        });

        if (result.isConfirmed) {
            try {
                await classSectionService.delete(id);
                Swal.fire('สำเร็จ', 'ลบข้อมูลเรียบร้อย', 'success');
                onSuccess();
            } catch (error) {
                Swal.fire('Error', 'ไม่สามารถลบข้อมูลได้', 'error');
            }
        }
    };

    return {
        data,
        meta,
        isLoading,
        isSaving,
        fetchSections,
        saveSection,
        deleteSection
    };
};