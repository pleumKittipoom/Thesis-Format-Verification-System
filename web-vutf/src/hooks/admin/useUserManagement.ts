// src/hooks/admin/useUserManagement.ts
import { useState } from 'react';
import Swal from 'sweetalert2';
import { userService } from '../../services/user.service';
import { User } from '../../types/user';

export const useUserManagement = () => {
    const [data, setData] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [meta, setMeta] = useState<any>(null);

    const fetchUsers = async (
        role: 'student' | 'instructor', 
        page: number, 
        limit: number, 
        search: string,
        filters?: { academicYear?: string; term?: string; sectionId?: number }
    ) => {
        setIsLoading(true);
        try {
            // ส่ง filters ต่อไปให้ userService
            const res = role === 'student'
                ? await userService.getStudents(page, limit, search, filters)
                : await userService.getInstructors(page, limit, search);

            // console.log('--- API Response Data ---', res.data);

            setData(res.data);
            setMeta(res.meta);
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'ไม่สามารถดึงข้อมูลได้', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Delete User
    const deleteUser = async (id: string, onSuccess: () => void) => {
        const result = await Swal.fire({
            title: 'ยืนยันการปิดใช้งานบัญชี?',
            text: "บัญชีนี้จะถูกระงับการใช้งาน (Inactive) แต่ข้อมูลประวัติจะยังคงอยู่ในระบบ",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        });

        if (result.isConfirmed) {
            try {
                await userService.deleteUser(id);
                Swal.fire('สำเร็จ', 'ระงับการใช้งานเรียบร้อย', 'success');
                onSuccess();
            } catch (error: any) {
                Swal.fire('Error', error.response?.data?.message || 'ทำรายการไม่สำเร็จ', 'error');
            }
        }
    };

    // Save User (Create/Update/Invite)
    const saveUser = async (formData: any, role: 'student' | 'instructor', isEditMode: boolean, userId: string | undefined, onSuccess: () => void) => {
        setIsSaving(true);
        try {
            if (isEditMode && userId) {
                // Update
                await userService.updateUser(userId, formData);
                Swal.fire('สำเร็จ', 'แก้ไขข้อมูลเรียบร้อย', 'success');
            } else {
                // Create
                if (role === 'student') {
                    // Logic Invite Student
                    const rawEmails = formData.email || '';
                    const emailList = rawEmails.split(/[\n,\s]+/).map((e: string) => e.trim()).filter((e: string) => e !== '');

                    if (emailList.length === 0) {
                        Swal.fire('แจ้งเตือน', 'กรุณาระบุอีเมล', 'warning');
                        setIsSaving(false); return;
                    }

                    const res: any = await userService.inviteStudents(emailList);

                    const successCount = res.results?.filter((r: any) => r.status === 'success' || r.status === 'resent').length || 0;
                    const failCount = res.results?.filter((r: any) => r.status === 'failed' || r.status === 'warning').length || 0;

                    if (failCount === 0) {
                        Swal.fire('สำเร็จ', `ส่งคำเชิญ ${successCount} รายการ`, 'success');
                    } else {
                        // กรณีมีบางรายการไม่สำเร็จ ให้แจ้งเตือน
                        Swal.fire({
                            title: 'ดำเนินการเสร็จสิ้น',
                            html: `<p>ส่งสำเร็จ: ${successCount}</p><p style="color:red">ไม่สำเร็จ/ซ้ำ: ${failCount}</p>`,
                            icon: 'info'
                        });
                    }

                } else {
                    // Create Instructor
                    await userService.createInstructor(formData);
                    Swal.fire('สำเร็จ', 'เพิ่มอาจารย์เรียบร้อย', 'success');
                }
            }
            onSuccess();
        } catch (error: any) {
            let msg = error.response?.data?.message || error.message || 'Error';
            if (msg.includes('email already exists') || msg.includes('UQ_')) {
                Swal.fire('ซ้ำ', 'ข้อมูลนี้มีในระบบแล้ว', 'warning');
            } else {
                Swal.fire('Error', msg, 'error');
            }
        } finally {
            setIsSaving(false);
        }
    };

    // Show Detail Logic
    const showDetail = (user: User, role: 'student' | 'instructor') => {
        let infoHtml = '';

        if (role === 'student' && user.student) {
            const s = user.student;
            infoHtml = `
            <div style="text-align: left; font-size: 0.95rem; line-height: 1.6;">
                <p><strong>ชื่อ-นามสกุล:</strong> ${s.prefix_name || ''}${s.first_name} ${s.last_name}</p>
                <p><strong>รหัสนักศึกษา:</strong> ${s.student_code || '-'}</p>
                <p><strong>อีเมล:</strong> ${user.email}</p>
                <p><strong>เบอร์โทร:</strong> ${s.phone || '-'}</p>
                <p><strong>กลุ่มเรียน:</strong> ${s.section?.section_name || '-'}</p>
                <p><strong>สถานะบัญชี:</strong> ${user.isActive ? '<span style="color:green">ใช้งานปกติ</span>' : '<span style="color:red">ถูกระงับ/ยังไม่ยืนยัน</span>'}</p>
            </div>
        `;
        } else if (role === 'instructor' && user.instructor) {
            const i = user.instructor;
            infoHtml = `
            <div style="text-align: left; font-size: 0.95rem; line-height: 1.6;">
                <p><strong>ชื่อ-นามสกุล:</strong> ${i.first_name} ${i.last_name}</p>
                <p><strong>รหัสอาจารย์:</strong> ${i.instructor_code || '-'}</p>
                <p><strong>อีเมล:</strong> ${user.email || 'ไม่มีบัญชีผู้ใช้'}</p>
                <p><strong>สถานะบัญชี:</strong> ${user.isActive ? '<span style="color:green">ใช้งานปกติ</span>' : '<span style="color:red">ถูกระงับ</span>'}</p>
            </div>
        `;
        } else {
            infoHtml = '<p style="color:red">ไม่พบข้อมูลรายละเอียดโปรไฟล์</p>';
        }

        Swal.fire({
            title: 'รายละเอียดผู้ใช้',
            html: infoHtml,
            icon: 'info',
            confirmButtonText: 'ปิด',
            confirmButtonColor: '#3b82f6'
        });
    };

    return {
        data,
        meta,
        isLoading,
        isSaving,
        fetchUsers,
        deleteUser,
        saveUser,
        showDetail
    };
};