// src/components/features/admin/settings/PermissionsTable.tsx
import { FiCheck, FiInbox } from 'react-icons/fi';
import { User, Permission } from '../../../../types/user';

interface PermissionsTableProps {
    instructors: User[];
    permissions: Permission[];
    savingId: string | null;
    onToggle: (user: User, permissionId: number) => void;
}

export const PermissionsTable = ({ instructors, permissions, savingId, onToggle }: PermissionsTableProps) => {
    if (permissions.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700 rounded-lg">
                ยังไม่มีข้อมูลสิทธิ์ในระบบ กรุณาเพิ่มข้อมูลในฐานข้อมูล (Table: permissions)
            </div>
        );
    }

    return (
        <div className="overflow-x-auto custom-scrollbar border border-gray-100 dark:border-gray-700 rounded-lg">
            <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                    <tr className="bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-700">
                        <th className="px-6 py-4 font-medium text-gray-700 dark:text-gray-200">ชื่ออาจารย์</th>
                        {permissions.map(perm => (
                            <th key={perm.permissions_id} className="px-4 py-4 font-medium text-center text-gray-700 dark:text-gray-200 text-sm">
                                {perm.action} <br />
                                <span className="text-xs text-gray-500 font-normal">{perm.resource}</span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {/* กรณีไม่มีข้อมูลอาจารย์ (เช่น ค้นหาแล้วไม่เจอ) */}
                    {instructors.length === 0 ? (
                        <tr>
                            <td colSpan={permissions.length + 1} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <FiInbox size={32} className="text-gray-300 dark:text-gray-600" />
                                    <p>ไม่พบข้อมูลอาจารย์</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        instructors.map(instructor => (
                            <tr key={instructor.user_uuid} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-800 dark:text-gray-200">
                                        {instructor.instructor?.first_name} {instructor.instructor?.last_name}
                                    </div>
                                    <div className="text-xs text-gray-500">{instructor.email}</div>
                                </td>
                                {permissions.map(perm => {
                                    const hasPerm = instructor.permissions?.some(p => p.permissions_id === perm.permissions_id);
                                    const isSavingThis = savingId === instructor.user_uuid;

                                    return (
                                        <td key={perm.permissions_id} className="px-4 py-4 text-center">
                                            <label className="relative flex items-center justify-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={hasPerm || false}
                                                    disabled={isSavingThis}
                                                    onChange={() => onToggle(instructor, perm.permissions_id)}
                                                />
                                                <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center
                                                    ${hasPerm
                                                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200 dark:shadow-none'
                                                        : 'bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600'
                                                    }
                                                    ${isSavingThis ? 'opacity-50 cursor-wait' : 'hover:border-blue-500 dark:hover:border-blue-400'}
                                                `}>
                                                    {hasPerm && <FiCheck size={14} strokeWidth={3} />}
                                                </div>
                                            </label>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};