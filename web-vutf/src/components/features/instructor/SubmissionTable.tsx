// src/components/features/instructor/SubmissionTable.tsx
import React, { useState } from 'react';
import {
    FiCheckCircle,
    FiChevronLeft,
    FiChevronRight,
    FiEye,
    FiX,
    FiDownload,
    FiCheck
} from 'react-icons/fi';
import { FaFilePdf } from 'react-icons/fa6';
import { SubmissionData } from '@/types/submission';
import { StatusBadge } from './StatusBadge';
import { Pagination } from '@/components/common/Pagination';
import { PdfPreviewModal } from '@/components/shared/pdf-preview/PdfPreviewModal';

interface Props {
    data: SubmissionData[];
    isLoading: boolean;
    onVerify: (id: number) => void;
    onViewDetails: (id: number) => void;
    meta: {
        page: number;
        total: number;
        lastPage: number;
        limit: number;
    };
    onPageChange: (newPage: number) => void;
    // New props for batch selection
    selectedIds: number[];
    onSelectionChange: (ids: number[]) => void;
    onBatchVerify: () => void;
}

export const SubmissionTable: React.FC<Props> = ({
    data,
    isLoading,
    onVerify,
    onViewDetails,
    meta,
    onPageChange,
    selectedIds,
    onSelectionChange,
    onBatchVerify
}) => {
    const [selectedFile, setSelectedFile] = useState<{ url: string; downloadUrl: string; name: string; type: string; size?: number | string } | null>(null);

    // Get verifiable items
    const verifiableItems = data.filter(item => item.canVerify);
    const allVerifiableSelected = verifiableItems.length > 0 && verifiableItems.every(item => selectedIds.includes(item.id));
    const someSelected = selectedIds.length > 0;

    // Handle select all
    const handleSelectAll = () => {
        if (allVerifiableSelected) {
            // Deselect all
            onSelectionChange([]);
        } else {
            // Select all verifiable
            onSelectionChange(verifiableItems.map(item => item.id));
        }
    };

    // Handle single item toggle
    const handleToggle = (id: number) => {
        if (selectedIds.includes(id)) {
            onSelectionChange(selectedIds.filter(i => i !== id));
        } else {
            onSelectionChange([...selectedIds, id]);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">กำลังโหลดข้อมูล...</div>;
    if (data.length === 0) return <div className="p-8 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">ไม่พบข้อมูลการส่งงาน</div>;

    return (
        <>
            <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                {/* Checkbox Header */}
                                <th className="px-4 py-4 w-12">
                                    <input
                                        type="checkbox"
                                        checked={allVerifiableSelected}
                                        onChange={handleSelectAll}
                                        disabled={verifiableItems.length === 0}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                                    />
                                </th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">File Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Uploaded By</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date/Time</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Verification</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {data.map((item) => (
                                <tr
                                    key={item.id}
                                    className={`hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors ${selectedIds.includes(item.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                                >
                                    {/* Checkbox Cell */}
                                    <td className="px-4 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(item.id)}
                                            onChange={() => handleToggle(item.id)}
                                            disabled={!item.canVerify}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                                                <FaFilePdf size={20} />
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() => setSelectedFile({
                                                        url: item.file.url,
                                                        downloadUrl: item.file.downloadUrl || item.file.url,
                                                        name: item.file.name,
                                                        type: item.file.type,
                                                        size: item.file.size
                                                    })}
                                                    className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline text-left line-clamp-1 max-w-[150px] transition-colors cursor-pointer"
                                                    title={item.file.name}
                                                >
                                                    {item.file.name}
                                                </button>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                    <span className="uppercase">{item.file.type?.split('/')[1] || 'FILE'}</span>
                                                    <span>{item.file.size}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {item.uploadedBy.avatar ? (
                                                <img src={item.uploadedBy.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-300">
                                                    {item.uploadedBy.name.charAt(0)}
                                                </div>
                                            )}
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.uploadedBy.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-[200px]">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={item.project.nameEn}>
                                                {item.project.nameEn}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.project.code}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                        {new Date(item.submittedAt).toLocaleDateString('th-TH', {
                                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={item.status as any} />
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {item.status === 'IN_PROGRESS' ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-lg">
                                                <span className="animate-spin">⏳</span> กำลังตรวจ...
                                            </span>
                                        ) : item.verificationCount > 0 ? (
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    ตรวจแล้ว {item.verificationCount} ครั้ง
                                                </span>
                                                <button
                                                    onClick={() => onVerify(item.id)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs font-medium rounded-lg transition-colors"
                                                >
                                                    <FiCheckCircle size={12} /> ตรวจอีกครั้ง
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => onVerify(item.id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <FiCheckCircle size={14} /> Verify
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => onViewDetails(item.id)}
                                            className="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
                                        >
                                            <FiEye size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <Pagination meta={meta} onPageChange={onPageChange} />
            </div>

            {/* Floating Action Bar */}
            {someSelected && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center gap-4 px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-xl shadow-2xl">
                        <div className="flex items-center gap-2">
                            <FiCheck className="text-green-400" />
                            <span className="font-medium">เลือก {selectedIds.length} รายการ</span>
                        </div>
                        <div className="w-px h-6 bg-gray-600"></div>
                        <button
                            onClick={() => onSelectionChange([])}
                            className="px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={onBatchVerify}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                            <FiCheckCircle size={16} />
                            ส่งตรวจทั้งหมด
                        </button>
                    </div>
                </div>
            )}

            {/* In-App Preview Modal */}
            {selectedFile && selectedFile.type?.includes('pdf') && (
                <PdfPreviewModal
                    url={selectedFile.url}
                    downloadUrl={selectedFile.downloadUrl}
                    fileName={selectedFile.name}
                    fileSize={selectedFile.size}
                    onClose={() => setSelectedFile(null)}
                />
            )}

            {/* รองรับกรณีที่เป็นรูปภาพหรือไฟล์ประเภทอื่นที่ PdfPreviewModal ไม่รองรับ */}
            {selectedFile && !selectedFile.type?.includes('pdf') && (
                <div className="fixed inset-0 z-[100] flex flex-col bg-gray-900/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="flex justify-end p-2">
                        <button onClick={() => setSelectedFile(null)} className="p-2 text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                            <FiX size={24} />
                        </button>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center p-4">
                        {selectedFile.type?.startsWith('image/') ? (
                            <img src={selectedFile.url} alt="Preview" className="max-w-full max-h-full object-contain rounded-md shadow-2xl" />
                        ) : (
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl flex flex-col items-center shadow-2xl text-center">
                                <p className="text-gray-500 dark:text-gray-400 mb-4">ไม่รองรับการพรีวิวไฟล์ประเภทนี้ในเบราว์เซอร์</p>
                                <a href={selectedFile.downloadUrl} download={selectedFile.name} className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                                    <FiDownload /> ดาวน์โหลดไฟล์
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};