import { useState, useEffect } from 'react';
import { FiX, FiCheck, FiLoader } from 'react-icons/fi';
import { User, Permission } from '../../../../types/user';
import { userService } from '../../../../services/user.service';
import toast from 'react-hot-toast';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onSuccess: () => void;
}

export const InstructorPermissionModal = ({ isOpen, onClose, user, onSuccess }: Props) => {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [userPermissions, setUserPermissions] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // ดึงรายการสิทธิ์ทั้งหมดที่มีในระบบมาแสดงเป็นตัวเลือก
    useEffect(() => {
        if (isOpen && user) {
            fetchPermissions();
            // ตั้งค่าสิทธิ์เริ่มต้นที่อาจารย์คนนี้มีอยู่แล้ว (แปลงจาก Object เป็น Array ของ ID)
            const initialPermIds = user.permissions?.map(p => p.permissions_id) || [];
            setUserPermissions(initialPermIds);
        }
    }, [isOpen, user]);

    const fetchPermissions = async () => {
        setIsLoading(true);
        try {
            const data = await userService.getAllPermissions();
            setPermissions(data);
        } catch (error) {
            console.error("Failed to load permissions", error);
            toast.error('ไม่สามารถโหลดข้อมูลสิทธิ์ได้');
        } finally {
            setIsLoading(false);
        }
    };

    // ฟังก์ชันเปิด/ปิด Checkbox ก่อนกดบันทึก
    const togglePermission = (permId: number) => {
        setUserPermissions(prev => 
            prev.includes(permId) 
                ? prev.filter(id => id !== permId) 
                : [...prev, permId]
        );
    };

    // ฟังก์ชันกดยืนยันการบันทึก
    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            await userService.updatePermissions(user.user_uuid, userPermissions);
            toast.success('อัปเดตสิทธิ์สำเร็จ');
            onSuccess(); 
            onClose();  
        } catch (error) {
            console.error("Failed to save permissions", error);
            toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl transform transition-all">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                            จัดการสิทธิ์การเข้าถึง
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            อาจารย์: {user.instructor?.first_name} {user.instructor?.last_name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Body - Checkbox List */}
                <div className="p-6">
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <FiLoader className="animate-spin text-blue-600" size={24} />
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {permissions.length === 0 ? (
                                <p className="text-center text-gray-500 py-4">ไม่พบสิทธิ์ในระบบ</p>
                            ) : (
                                permissions.map(perm => {
                                    const hasPerm = userPermissions.includes(perm.permissions_id);
                                    
                                    return (
                                        <div 
                                            key={perm.permissions_id}
                                            onClick={() => togglePermission(perm.permissions_id)}
                                            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                                hasPerm 
                                                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' 
                                                    : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
                                            }`}
                                        >
                                            <div>
                                                <p className={`font-medium ${hasPerm ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}`}>
                                                    {perm.action === 'manage' ? 'จัดการ' : 'อนุมัติ'} {perm.resource.replace('_', ' ')}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5 font-mono">
                                                    {perm.action}:{perm.resource}
                                                </p>
                                            </div>
                                            
                                            <div className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                                                hasPerm ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-transparent'
                                            }`}>
                                                <FiCheck size={16} strokeWidth={3} />
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>

                {/* Footer - Buttons */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors disabled:opacity-50"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || isLoading}
                        className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 dark:shadow-none font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSaving ? <><FiLoader className="animate-spin" /> กำลังบันทึก...</> : 'บันทึกสิทธิ์'}
                    </button>
                </div>

            </div>
        </div>
    );
};