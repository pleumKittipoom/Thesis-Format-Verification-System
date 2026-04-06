import { useState, useRef } from 'react';
import { FiFolder, FiFileText, FiEye, FiDownload } from 'react-icons/fi';
import { FaFilePdf, FaFileCsv } from 'react-icons/fa6';
import { FileNode } from '@/types/thesis-file';
import { thesisFileService } from '@/services/thesis-file.service';

import { swal, toast } from '@/utils/swal';

interface FileGridItemProps {
    node: FileNode;
    onClick: (node: FileNode) => void;
    onPreview: (node: FileNode) => void;
    onDownload: (node: FileNode) => void;
    isMenuOpen: boolean;
    onMenuOpen: (id: string) => void;
}

export const FileGridItem = ({
    node,
    onClick,
    onPreview,
    onDownload,
    isMenuOpen,
    onMenuOpen
}: FileGridItemProps) => {

    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
    const menuRef = useRef<HTMLDivElement>(null);

    //  Helpers 
    const getFileIcon = () => {
        if (node.type === 'FOLDER') return <FiFolder size={32} />;
        const name = node.name.toLowerCase();
        if (name.endsWith('.pdf') || node.mimeType === 'application/pdf') return <FaFilePdf size={32} />;
        if (name.endsWith('.csv') || node.mimeType === 'text/csv') return <FaFileCsv size={32} />;
        return <FiFileText size={32} />;
    };

    const getIconStyle = () => {
        if (node.type === 'FOLDER') return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
        const name = node.name.toLowerCase();
        if (name.endsWith('.pdf')) return 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400';
        if (name.endsWith('.csv')) return 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400';
        return 'bg-gray-50 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400';
    };

    const getStatusIndicator = (color?: string) => {
        switch (color) {
            case 'success': return 'bg-green-500 shadow-green-200';
            case 'error': return 'bg-red-500 shadow-red-200';
            case 'warning': return 'bg-amber-500 shadow-amber-200';
            default: return null;
        }
    };
    const statusClass = getStatusIndicator(node.metadata?.statusColor);

    const canDownloadZip = (path: string) => {
        if (!path) return false;
        const parts = path.split('/').filter(Boolean);
        const root = parts[0];
        const depth = parts.length;
        if (root === 'WIP') return depth >= 5;
        if (root === 'ARCHIVE') return depth >= 2;
        return false;
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setMenuPos({ x: e.pageX, y: e.pageY });
        onMenuOpen(node.id);
    };

    const displayName = node.name.replace(/\s*\(ท\.\d+\)/g, '');

    return (
        <>
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    onClick(node);
                }}
                onContextMenu={handleContextMenu}
                className="group p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900 cursor-pointer transition-all duration-200 flex flex-col items-center justify-start gap-3 h-full min-h-[140px] relative select-none"
            >
                {statusClass && (
                    <div className={`absolute top-3 right-3 w-3 h-3 rounded-full shadow-sm ring-2 ring-white dark:ring-gray-800 ${statusClass}`}
                        title={node.metadata?.displayStatus || 'Status'}
                    />
                )}
                <div className={`p-4 rounded-full flex-shrink-0 transition-colors ${getIconStyle()}`}>
                    {getFileIcon()}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 text-center px-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 break-words leading-tight w-full">
                    {displayName}
                </span>

                <div className="hidden group-hover:block absolute bottom-full mb-2 bg-gray-900 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap z-10 pointer-events-none">
                    {displayName} {node.metadata?.displayStatus ? `(${node.metadata.displayStatus})` : ''}
                </div>
            </div>

            {isMenuOpen && (
                <div
                    ref={menuRef}
                    className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 w-40 animate-in fade-in zoom-in-95 duration-100"
                    style={{ top: menuPos.y, left: menuPos.x }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {node.type === 'FILE' && (
                        <>
                            <button
                                onClick={() => { onPreview(node); onMenuOpen(''); }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                                <FiEye size={16} /> Preview
                            </button>
                            <button
                                onClick={() => { onDownload(node); onMenuOpen(''); }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                                <FiDownload size={16} /> Download
                            </button>
                        </>
                    )}

                    {node.type === 'FOLDER' && (
                        <>
                            <button
                                onClick={() => { onClick(node); onMenuOpen(''); }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                                <FiFolder size={16} /> Open
                            </button>

                            {canDownloadZip(node.path) && (
                                <button
                                    onClick={() => {
                                        onMenuOpen('');

                                        toast.fire({
                                            icon: 'info',
                                            title: 'กำลังเตรียมไฟล์ ZIP...'
                                        });

                                        thesisFileService.downloadZip(node.path)
                                            .then(() => {
                                                toast.fire({
                                                    icon: 'success',
                                                    title: 'เริ่มการดาวน์โหลดแล้ว'
                                                });
                                            })
                                            .catch(err => {
                                                console.error("Download failed", err);
                                                const message = err.message || "";

                                                if (
                                                    message.includes("404") ||
                                                    message.includes("No files found") ||
                                                    message.includes("ดาวน์โหลดไฟล์ล้มเหลว")
                                                ) {
                                                    swal.fire({
                                                        icon: 'info',
                                                        title: 'ไม่พบเอกสาร (No Files Found)',
                                                        text: 'ไม่มีไฟล์เอกสารใดๆ ในโฟลเดอร์นี้ให้ดาวน์โหลด',
                                                        confirmButtonText: 'ตกลง'
                                                    });
                                                } else {
                                                    swal.fire({
                                                        icon: 'error',
                                                        title: 'เกิดข้อผิดพลาด',
                                                        text: message,
                                                        confirmButtonText: 'ปิด'
                                                    });
                                                }
                                            });
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                >
                                    <FiDownload size={16} /> Download ZIP
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
        </>
    );
};