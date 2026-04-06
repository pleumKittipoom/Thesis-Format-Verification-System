// src/components/features/admin/thesis-file/FileTableView.tsx
import { FileNode } from '@/types/thesis-file';
import { FiFolder, FiFileText, FiClock, FiChevronRight, FiUser, FiHash } from 'react-icons/fi';
import { FaFilePdf, FaFileCsv } from 'react-icons/fa6';

interface FileTableViewProps {
    nodes: FileNode[];
    onNavigate: (node: FileNode) => void;
}

// Helper: เลือกไอคอนตามประเภทไฟล์
const getFileIcon = (node: FileNode) => {
    if (node.type === 'FOLDER') return <FiFolder size={20} className="text-blue-500" />;

    const name = node.name.toLowerCase();
    if (name.endsWith('.pdf') || node.mimeType === 'application/pdf') {
        return <FaFilePdf size={20} className="text-red-500" />;
    }
    if (name.endsWith('.csv') || node.mimeType === 'text/csv') {
        return <FaFileCsv size={20} className="text-green-500" />;
    }
    return <FiFileText size={20} className="text-gray-500" />;
};

// Helper: เลือกสีพื้นหลังไอคอน
const getIconBg = (node: FileNode) => {
    if (node.type === 'FOLDER') return 'bg-blue-50 dark:bg-blue-900/20';
    const name = node.name.toLowerCase();
    if (name.endsWith('.pdf')) return 'bg-red-50 dark:bg-red-900/20';
    if (name.endsWith('.csv')) return 'bg-green-50 dark:bg-green-900/20';
    return 'bg-gray-50 dark:bg-gray-800';
};

const StatusBadge = ({ status, color }: { status?: string, color?: string }) => {
    const colorStyles: Record<string, string> = {
        success: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 ring-1 ring-green-600/20',
        warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 ring-1 ring-amber-600/20',
        error: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 ring-1 ring-red-600/20',
        info: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 ring-1 ring-blue-600/20',
        default: 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400 ring-1 ring-gray-600/20',
    };

    const style = colorStyles[color || 'default'] || colorStyles['default'];

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
            {status || 'Unknown'}
        </span>
    );
};

const cleanOwnerName = (name: string | undefined) => {
    if (!name) return '-';
    // ตัดทุกอย่างตั้งแต่เครื่องหมายวงเล็บเปิดตัวแรกทิ้ง
    return name.split('(')[0].trim();
};

export const FileTableView = ({ nodes, onNavigate }: FileTableViewProps) => {
    if (nodes.length === 0) {
        return (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 border-dashed">
                <p className="text-gray-500 dark:text-gray-400">No files found in this directory.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50/80 dark:bg-gray-900/50 backdrop-blur-sm text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-[11px] border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="pl-6 pr-4 py-4 w-[40%]">Name / Group</th>
                            <th className="px-4 py-4">Code</th>
                            <th className="px-4 py-4">Submitted By</th>
                            <th className="px-4 py-4">Advisor</th>
                            <th className="px-4 py-4 text-center">Status</th>
                            <th className="pl-4 pr-6 py-4 text-right">Last Update</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {nodes.map((node) => (
                            <tr
                                key={node.id}
                                onClick={() => onNavigate(node)}
                                className="group hover:bg-blue-50/60 dark:hover:bg-gray-700/40 cursor-pointer transition-all duration-200"
                            >
                                {/* Name / Group */}
                                <td className="pl-6 pr-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg shrink-0 ${getIconBg(node)} transition-colors`}>
                                            {getFileIcon(node)}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[250px] lg:max-w-md group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {node.name}
                                            </span>
                                            {node.type === 'FOLDER' && (
                                                <span className="text-[10px] text-gray-400 dark:text-gray-500">Folder</span>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                {/* Code */}
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 font-mono text-xs">
                                        <FiHash className="text-gray-400" size={12} />
                                        {node.metadata?.code || '-'}
                                    </div>
                                </td>

                                {/* Owner */}
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                                            <FiUser size={12} />
                                        </div>
                                        <span className="text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
                                            {cleanOwnerName(node.metadata?.owner)}
                                        </span>
                                    </div>
                                </td>

                                {/* Advisor */}
                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400 truncate max-w-[150px]">
                                    {node.metadata?.advisor || '-'}
                                </td>

                                {/* Status */}
                                <td className="px-4 py-3 text-center">
                                    <StatusBadge
                                        status={node.metadata?.displayStatus}
                                        color={node.metadata?.statusColor}
                                    />
                                </td>

                                {/* Last Update */}
                                <td className="pl-4 pr-6 py-3 text-right">
                                    <div className="flex items-center justify-end gap-1.5 text-gray-500 dark:text-gray-400 text-xs">
                                        <span>
                                            {node.metadata?.updatedAt
                                                ? new Date(node.metadata.updatedAt).toLocaleDateString('th-TH', {
                                                    year: '2-digit',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })
                                                : '-'
                                            }
                                        </span>
                                        {/* ลูกศรชี้ขวาที่จะโผล่มาตอน Hover */}
                                        <FiChevronRight className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-blue-500" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};