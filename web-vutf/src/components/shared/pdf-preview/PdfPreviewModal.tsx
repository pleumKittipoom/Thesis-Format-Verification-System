// src/components/shared/pdf-preview/PdfPreviewModal.tsx
import React, { useState } from 'react';
import { FiDownload, FiX, FiLoader } from 'react-icons/fi';
import { FaFilePdf } from 'react-icons/fa6';

interface PdfPreviewModalProps {
    url: string;
    downloadUrl?: string;
    fileName: string;
    fileSize?: number | string;
    onClose: () => void;
}

// Helper Function สำหรับแปลงขนาดไฟล์
const formatSize = (bytes?: number) => {
    if (!bytes && bytes !== 0) return 'Unknown';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
    url,
    downloadUrl,
    fileName,
    fileSize,
    onClose
}) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col bg-gray-900/95 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-none sm:rounded-t-xl border-b dark:border-gray-700 shrink-0 shadow-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2.5 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 shrink-0">
                        <FaFilePdf size={24} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-md" title={fileName}>
                            {fileName}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-0.5">
                            PDF {fileSize !== undefined ? `• ${typeof fileSize === 'number' ? formatSize(fileSize) : fileSize}` : ''}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {downloadUrl && (
                        <>
                            <a
                                href={downloadUrl}
                                download={fileName}
                                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm"
                            >
                                <FiDownload size={18} />
                                <span>Download</span>
                            </a>
                            <a
                                href={downloadUrl}
                                download={fileName}
                                className="sm:hidden p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            >
                                <FiDownload size={24} />
                            </a>
                        </>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg transition-colors ml-1"
                    >
                        <FiX size={24} />
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 bg-white dark:bg-gray-900 rounded-none sm:rounded-b-xl overflow-hidden shadow-2xl relative flex items-center justify-center">
                {/* UI Loading ปิดทับ */}
                {isLoading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
                        <FiLoader className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 animate-pulse">
                            กำลังโหลดไฟล์ PDF...
                        </p>
                    </div>
                )}

                {/* iframe ซ่อนจนกว่าจะโหลดเสร็จ */}
                {url ? (
                    <iframe
                        src={`${url}#toolbar=0`}
                        className={`w-full h-full border-none relative z-20 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                        title="PDF Preview"
                        onLoad={() => setIsLoading(false)}
                    />
                ) : (
                    <div className="text-gray-500 relative z-20">ไม่พบ URL ของไฟล์</div>
                )}
            </div>
        </div>
    );
};