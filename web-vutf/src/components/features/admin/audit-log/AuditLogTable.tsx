import { FiClock, FiUser, FiActivity, FiGlobe } from 'react-icons/fi';
import { 
    formatDistanceToNow, 
    format, 
    differenceInDays 
} from 'date-fns';
import { th } from 'date-fns/locale';

export const AuditLogTable = ({ logs, loading }: { logs: any[], loading: boolean }) => {
    
    // ฟังก์ชันกำหนดสี Badge ตามประเภทกิจกรรม
    const getActionColor = (action: string) => {
        if (action.includes('FAILED')) return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400';
        if (action === 'LOGIN' || action === 'REGISTER') return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400';
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400';
    };

    /**
     * ฟังก์ชันแปลงเวลาแสดงผล
     * - ไม่เกิน 24 ชม.: แสดง "X นาที/ชั่วโมง ที่ผ่านมา"
     * - เกิน 1 วัน: แสดง "วันที่ เดือน พ.ศ."
     */
    const formatDisplayTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const now = new Date();

            if (differenceInDays(now, date) >= 1) {
                // รูปแบบ: 27 กุมภาพันธ์ 2569
                const formattedDate = format(date, 'd MMMM ', { locale: th });
                const thaiYear = date.getFullYear() + 543;
                return `${formattedDate}${thaiYear}`;
            }

            // รูปแบบ: 5 นาทีที่ผ่านมา
            return formatDistanceToNow(date, { addSuffix: true, locale: th });
        } catch (error) {
            return '-';
        }
    };

    // ฟังก์ชันสำหรับ Tooltip เมื่อเมาส์ชี้ (แสดงเวลาละเอียดระดับวินาที + พ.ศ.)
    const formatExactTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const thaiYear = date.getFullYear() + 543;
            return format(date, `d MMM ${thaiYear} HH:mm:ss`, { locale: th });
        } catch {
            return '-';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-gray-50/80 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider">
                            <th className="px-6 py-4">
                                <div className="flex items-center gap-2"><FiClock size={14} /> วันเวลา</div>
                            </th>
                            <th className="px-6 py-4">
                                <div className="flex items-center gap-2"><FiUser size={14} /> ผู้ใช้งาน</div>
                            </th>
                            <th className="px-6 py-4">
                                <div className="flex items-center gap-2"><FiActivity size={14} /> กิจกรรม</div>
                            </th>
                            <th className="px-6 py-4">รายละเอียด</th>
                            <th className="px-6 py-4">
                                <div className="flex items-center gap-2"><FiGlobe size={14} /> IP Address</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="text-center py-20">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-gray-500 text-sm">กำลังดึงข้อมูล...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : logs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-20 text-gray-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <FiActivity size={40} className="text-gray-300" />
                                        <span>ไม่พบประวัติกิจกรรมในช่วงเวลานี้</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => {
                                // จัดการชื่อผู้ใช้งานจากความสัมพันธ์ของ Table
                                let userName = log.user?.email || 'System';
                                if (log.user?.student) {
                                    userName = `${log.user.student.first_name} ${log.user.student.last_name}`;
                                } else if (log.user?.instructor) {
                                    userName = `${log.user.instructor.first_name} ${log.user.instructor.last_name}`;
                                }

                                return (
                                    <tr key={log.logId} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td 
                                            className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap cursor-help font-medium"
                                            title={formatExactTime(log.timeStamp)}
                                        >
                                            {formatDisplayTime(log.timeStamp)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-gray-800 dark:text-white">
                                                {userName}
                                            </div>
                                            <div className="text-xs text-gray-500 font-medium">
                                                {log.user?.email || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-[11px] font-bold rounded-full border shadow-sm ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td 
                                            className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate" 
                                            title={log.description}
                                        >
                                            {log.description || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/50 px-2 py-1 rounded w-fit">
                                                {log.ipAddress || 'Unknown'}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};