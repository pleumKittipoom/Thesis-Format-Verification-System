import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { InspectionRound } from '@/types/inspection';
import { ActionMenu } from './ActionMenu'; // Import จากไฟล์ที่แยกไว้

interface InspectionTableProps {
    data: InspectionRound[];
    onEdit: (item: InspectionRound) => void;
    onDelete: (id: number) => void;
    onDetail: (item: InspectionRound) => void;
    onToggleStatus: (id: number) => void;
    isLoading: boolean;
}

export const InspectionTable = ({ data, onEdit, onDelete, onDetail, onToggleStatus, isLoading }: InspectionTableProps) => {
    return (
        <div className="overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative min-h-[200px] transition-colors">
            {/* Loading Overlay */}
            {isLoading && data.length > 0 && (
                <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 z-10 flex justify-center items-start pt-20 backdrop-blur-[1px]">
                    <div className="w-6 h-6 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50/80 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">ปีการศึกษา/เทอม</th>
                            <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">รอบที่</th>
                            <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider w-full">หัวข้อการตรวจ</th>
                            <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">ระยะเวลา</th>
                            <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">ประเภท</th>
                            <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">สถานะ</th>
                            <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                        {data.length === 0 && !isLoading ? (
                            <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500 font-light">ไม่พบข้อมูล</td></tr>
                        ) : (
                            data.map((item) => (
                                <tr key={item.inspectionId} className="hover:bg-gray-50/60 dark:hover:bg-gray-700/30 transition-colors group">
                                    {/* ปีการศึกษา และ เทอม */}
                                    <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">
                                        <div className="flex items-center gap-2 ">
                                            <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md text-xs font-bold border border-blue-100 dark:border-blue-800">
                                                {item.academicYear} / {item.term}
                                            </span>
                                        </div>
                                    </td>

                                    {/* รอบที่ */}
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full text-xs font-bold">
                                            #{item.roundNumber}
                                        </span>
                                    </td>

                                    {/* หัวข้อ */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900 dark:text-white text-base">{item.title}</span>
                                            {item.description && (
                                                <span className="text-gray-500 dark:text-gray-400 text-sm mt-1 truncate max-w-xs block">
                                                    {item.description}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* ระยะเวลา */}
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col gap-1 items-center justify-center">
                                            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-600 whitespace-nowrap">
                                                เริ่ม: {new Date(item.startDate).toLocaleString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} น.
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-2 py-0.5 rounded border border-gray-100 dark:border-gray-600 whitespace-nowrap">
                                                สิ้นสุด: {new Date(item.endDate).toLocaleString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} น.
                                            </span>
                                        </div>
                                    </td>

                                    {/* ประเภทโครงงาน */}
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex px-2 py-1 text-[11px] font-bold rounded-md border
                                            ${item.courseType === 'ALL'
                                                ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-800'
                                                : item.courseType === 'PRE_PROJECT'
                                                    ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-100 dark:border-orange-800'
                                                    : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-800'}`}>
                                            {item.courseType === 'ALL' ? 'ทั้งหมด' : item.courseType === 'PRE_PROJECT' ? 'Pre-Project' : 'Project'}
                                        </span>
                                    </td>

                                    {/* สถานะ */}
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => onToggleStatus(item.inspectionId)}
                                            title={item.status === 'OPEN' ? 'คลิกเพื่อปิดรับ' : 'คลิกเพื่อเปิดรับ'}
                                            className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm transition-all duration-200 transform hover:scale-105 active:scale-95
                                                ${item.status === 'OPEN'
                                                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/50'
                                                    : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                                                }`}
                                        >
                                            {item.status === 'OPEN' ? <FiCheckCircle size={12} /> : <FiXCircle size={12} />}
                                            {item.status === 'OPEN' ? 'OPEN' : 'CLOSED'}
                                        </button>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end">
                                            <ActionMenu
                                                onEdit={() => onEdit(item)}
                                                onDelete={() => onDelete(item.inspectionId)}
                                                onDetail={() => onDetail(item)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};