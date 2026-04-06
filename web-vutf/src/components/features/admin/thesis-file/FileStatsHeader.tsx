// src/components/features/admin/thesis-file/FileStatsHeader.tsx
import { FiLayers, FiFileText, FiArchive, FiDatabase, FiActivity, FiBarChart2 } from 'react-icons/fi';
import { FaFilePdf, FaFileCsv } from 'react-icons/fa6';

export const FileStatsHeader = ({ stats, onOpenActivity }: any) => {

    const storageUsed = stats?.storageUsed || 0;
    const storageLimit = stats?.storageLimit || (5 * 1024 ** 3);

    const usedGB = (storageUsed / (1024 ** 3)).toFixed(2);
    const storagePercent = Math.min((storageUsed / storageLimit) * 100, 100).toFixed(1);

    const fmt = (n: number) => n?.toLocaleString() || '0';

    const items = [
        {
            label: 'Total Files',
            value: <span className="text-2xl font-bold tracking-tight text-gray-600 dark:text-white">{fmt(stats?.totalFiles)}</span>,
            unit: 'ไฟล์รวม',
            icon: <FiLayers className="text-purple-600" size={20} />,
            bg: 'bg-purple-50 dark:bg-purple-900/20 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40',
        },
        {
            label: 'Submissions',
            value: <span className="text-2xl font-bold tracking-tight text-gray-600 dark:text-white">{fmt(stats?.totalSubmissions)}</span>,
            unit: `รอตรวจ ${fmt(stats?.pendingInspection)}`,
            icon: <FiFileText className="text-blue-600" size={20} />,
            bg: 'bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40',
        },
        {
            label: 'Reports (PDF/CSV)',
            value: (
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                    {/* กลุ่ม PDF */}
                    <div className="flex items-center gap-1.5">
                        <FaFilePdf className="text-red-500 shrink-0" size={18} />
                        <span className="text-xl sm:text-2xl font-bold text-gray-600 dark:text-white">
                            {fmt(stats?.reports?.pdf)}
                        </span>
                    </div>

                    {/* เส้นคั่น */}
                    <div className="w-[1px] h-4 sm:h-5 bg-gray-300 dark:bg-gray-600"></div>

                    {/* กลุ่ม CSV */}
                    <div className="flex items-center gap-1.5">
                        <FaFileCsv className="text-green-500 shrink-0" size={18} />
                        <span className="text-xl sm:text-2xl font-bold text-gray-600 dark:text-white">
                            {fmt(stats?.reports?.csv)}
                        </span>
                    </div>
                </div>
            ),
            unit: `รวม ${fmt(stats?.reports?.total)} ไฟล์`,
            icon: <FiBarChart2 className="text-emerald-600" size={20} />,
            bg: 'bg-emerald-50 dark:bg-emerald-900/20 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40',
        },
        {
            label: 'Total Archive',
            value: <span className="text-2xl font-bold tracking-tight text-gray-600 dark:text-white">{fmt(stats?.totalArchive)}</span>,
            unit: 'เล่มจบในคลัง',
            icon: <FiArchive className="text-amber-600" size={20} />,
            bg: 'bg-amber-50 dark:bg-amber-900/20 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/40',
        }
    ];

    return (
        <div className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {items.map((item, idx) => (
                    <div key={idx} className="group p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 hover:border-blue-100 dark:hover:border-gray-600 transition-all duration-300">
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${item.bg} shrink-0 transition-colors duration-300`}>
                                {item.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                                <div className="mt-1">{item.value}</div>
                                <p className="text-sm text-gray-500 truncate mt-1">{item.unit}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm flex items-center gap-6 hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all duration-300">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600">
                        <FiDatabase size={24} />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Storage Capacity</p>
                                <p className="text-lg font-bold text-gray-600 dark:text-white">
                                    {usedGB} GB <span className="text-sm font-normal text-gray-400">/ 5.00 GB</span>
                                </p>
                            </div>
                            <span className="text-xs font-bold text-indigo-600">{storagePercent}%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-indigo-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${storagePercent}%` }}
                            />
                        </div>
                    </div>
                </div>

                <button
                    onClick={onOpenActivity}
                    className="group p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none transition-all flex items-center justify-between px-6 hover:scale-[1.02] active:scale-95 duration-200"
                >
                    <div className="flex items-center gap-4">
                        <FiActivity size={24} className="group-hover:animate-pulse" />
                        <div className="text-left">
                            <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Log History</p>
                            <p className="font-bold">Recent Activity</p>
                        </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                        →
                    </div>
                </button>
            </div>
        </div>
    );
};