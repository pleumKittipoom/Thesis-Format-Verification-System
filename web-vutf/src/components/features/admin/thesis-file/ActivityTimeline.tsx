// src/components/features/admin/thesis-file/ActivityTimeline.tsx
import { FiDownload, FiUpload, FiFileText, FiUser, FiInfo } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';

export const ActivityTimeline = ({ activities = [] }: { activities?: any[] }) => {

    // ฟังก์ชันช่วยเลือก Icon ตาม Action
    const getActionStyle = (action: string) => {
        switch (action) {
            case 'DOWNLOAD_ZIP':
                return { icon: <FiDownload />, color: 'text-blue-600', bg: 'bg-blue-100' };
            case 'UPLOAD_FILE':
                return { icon: <FiUpload />, color: 'text-emerald-600', bg: 'bg-emerald-100' };
            case 'VIEW_PDF':
                return { icon: <FiFileText />, color: 'text-amber-600', bg: 'bg-amber-100' };
            default:
                return { icon: <FiInfo />, color: 'text-gray-600', bg: 'bg-gray-100' };
        }
    };

    if (!Array.isArray(activities) || activities.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-400 text-sm">ไม่พบประวัติกิจกรรม</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-[19px] before:w-0.5 before:bg-gray-100 dark:before:bg-gray-800">
            {activities.map((item) => {
                const style = getActionStyle(item.action);
                return (
                    <div key={item.logId} className="relative pl-12">
                        {/* Dot / Icon */}
                        <div className={`absolute left-0 top-0 w-10 h-10 rounded-full border-4 border-white dark:border-gray-900 z-10 flex items-center justify-center ${style.bg} ${style.color}`}>
                            {style.icon}
                        </div>

                        <div className="flex flex-col">
                            <div className="flex justify-between items-start">
                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                    {item.action.replace('_', ' ')}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                    {/* แสดงเวลาแบบ: 2 นาทีที่แล้ว */}
                                    {formatDistanceToNow(new Date(item.timeStamp), { addSuffix: true, locale: th })}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                {item.description}
                            </p>

                            {/* แสดงข้อมูลผู้กระทำ (User Email) */}
                            <div className="mt-2 flex items-center gap-1.5">
                                <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <FiUser size={10} className="text-gray-500" />
                                </div>
                                <span className="text-[10px] font-medium text-gray-400">
                                    {item.user?.email || 'System'}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};