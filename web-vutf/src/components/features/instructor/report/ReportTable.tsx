// src/components/features/instructor/report/ReportTable.tsx
import React, { useState, useEffect, useRef } from 'react';
import { FiDownload, FiEdit3, FiX, FiChevronDown, FiCheck, FiEye } from 'react-icons/fi';
import { FaFilePdf, FaFileCsv, FaFile } from 'react-icons/fa6';
import { ReportData, ReviewStatus, VerificationStatus } from '@/types/report'; // เพิ่ม VerificationStatus
import { ReportStatusBadge } from './ReportStatusBadge';
import { Pagination } from '@/components/common/Pagination';
import { ThesisValidator } from '@/components/shared/thesis-validator/ThesisValidator';
import { PdfPreviewModal } from '@/components/shared/pdf-preview/PdfPreviewModal';

interface Props {
    data: ReportData[];
    isLoading: boolean;
    onReview: (report: ReportData) => void;
    onStatusChange?: (id: number, status: ReviewStatus) => void;
    onVerificationStatusChange?: (id: number, status: VerificationStatus) => void; // เพิ่ม Prop นี้
    meta: { page: number; total: number; lastPage: number; limit: number };
    onPageChange: (newPage: number) => void;
    onRefresh?: () => void;
}

type PreviewMode = 'PDF' | 'VALIDATOR';

export const ReportTable: React.FC<Props> = ({
    data,
    isLoading,
    onReview,
    onStatusChange,
    onVerificationStatusChange, // รับ Prop
    meta,
    onPageChange,
    onRefresh
}) => {
    const [previewFile, setPreviewFile] = useState<ReportData | null>(null);
    const [previewMode, setPreviewMode] = useState<PreviewMode>('PDF');

    // State สำหรับ Dropdown (Review Status)
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // State สำหรับ Dropdown (Verification Status)
    const [openVerificationDropdownId, setOpenVerificationDropdownId] = useState<number | null>(null);
    const verificationDropdownRef = useRef<HTMLDivElement>(null);

    // Handle Click Outside สำหรับปิด Dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdownId(null);
            }
            if (verificationDropdownRef.current && !verificationDropdownRef.current.contains(event.target as Node)) {
                setOpenVerificationDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const statusOptions = [
        { label: 'รอดำเนินการ', value: 'PENDING', dotColor: 'bg-gray-400', textColor: 'text-gray-700', hoverBg: 'hover:bg-gray-50' },
        { label: 'อนุมัติ (Passed)', value: 'PASSED', dotColor: 'bg-green-500', textColor: 'text-green-700', hoverBg: 'hover:bg-green-50' },
        { label: 'ไม่อนุมัติ (Not Passed)', value: 'NOT_PASSED', dotColor: 'bg-red-500', textColor: 'text-red-700', hoverBg: 'hover:bg-red-50' },
        { label: 'ต้องแก้ไข (Revision)', value: 'NEEDS_REVISION', dotColor: 'bg-orange-500', textColor: 'text-orange-700', hoverBg: 'hover:bg-orange-50' },
    ];

    const handleStatusSelect = (id: number, status: ReviewStatus) => {
        if (onStatusChange) onStatusChange(id, status);
        setOpenDropdownId(null);
    };

    const handleVerificationSelect = (id: number, status: VerificationStatus) => {
        if (onVerificationStatusChange) onVerificationStatusChange(id, status);
        setOpenVerificationDropdownId(null);
    };

    const handlePreviewClick = async (e: React.MouseEvent, item: ReportData, type: 'MAIN' | 'CSV' = 'MAIN') => {
        e.stopPropagation();
        if (type === 'MAIN') {
            const fileType = getFileType(item.file.name);
            if (fileType === 'PDF') {
                setPreviewMode('PDF');
                setPreviewFile(item);
            } else {
                if (item.file.downloadUrl) {
                    window.open(item.file.downloadUrl, '_blank');
                }
            }
        } else if (type === 'CSV' && item.csv) {
            setPreviewMode('VALIDATOR');
            setPreviewFile(item);
        }
    };

    // Helper functions
    const formatSize = (bytes: number | null | undefined) => {
        if (!bytes && bytes !== 0) return 'Unknown';
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileType = (fileName: string) => (fileName?.split('.').pop()?.toUpperCase() || 'FILE');

    const getFileIcon = (fileName: string) => {
        const type = getFileType(fileName);
        if (type === 'PDF') return <FaFilePdf size={20} />;
        if (type === 'CSV') return <FaFileCsv size={20} />;
        return <FaFile size={20} />;
    };

    const getIconStyle = (fileName: string) => {
        const type = getFileType(fileName);
        if (type === 'PDF') return 'bg-red-50 text-red-600 dark:bg-white dark:text-red-600';
        if (type === 'CSV') return 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400';
        return 'bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
    };

    return (
        <>
            {isLoading && !previewFile ? (
                <div className="p-12 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">กำลังโหลดข้อมูลรายงาน...</div>
            ) : data.length === 0 ? (
                <div className="p-12 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">ไม่พบรายงานการตรวจสอบ</div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="overflow-x-visible">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase rounded-tl-xl">Report File</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Project</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-center">System Result</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-center">Review Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-center">Created At</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-right rounded-tr-xl">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {data.map((item) => {
                                    const fileType = getFileType(item.file.name);
                                    return (
                                        <tr key={item.id}
                                            onClick={() => onReview(item)}
                                            className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors">

                                            {/* 1. File Column */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-start gap-3">
                                                    <div className={`p-2.5 rounded-lg ${getIconStyle(item.file.name)}`}>
                                                        {getFileIcon(item.file.name)}
                                                    </div>
                                                    <div className="max-w-[220px]">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handlePreviewClick(e, item, 'MAIN')}
                                                            className="font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline text-left truncate block w-full text-sm cursor-pointer"
                                                            title={item.file.name}
                                                        >
                                                            {item.file.name}
                                                        </button>
                                                        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                                            <span className="font-semibold bg-gray-100 dark:bg-gray-700 px-1.5 rounded text-gray-600 dark:text-gray-300">
                                                                {fileType}
                                                            </span>
                                                            <span>•</span>
                                                            <span>{formatSize(item.file.size)}</span>
                                                        </div>

                                                        {item.csv && (
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => handlePreviewClick(e, item, 'CSV')}
                                                                    className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors border border-emerald-100 dark:border-emerald-900/50 cursor-pointer"
                                                                    title="เปิด Thesis Validator"
                                                                >
                                                                    <FaFileCsv size={12} />
                                                                    <span>Check Result</span>
                                                                    <FiEye size={10} className="ml-0.5 opacity-60" />
                                                                </button>
                                                                <a
                                                                    href={item.csv.downloadUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300"
                                                                    title="ดาวน์โหลดไฟล์ CSV"
                                                                >
                                                                    <FiDownload size={14} />
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* 2. Project Column */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col max-w-[200px]">
                                                    <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-0.5">
                                                        {item.project?.code || 'NO CODE'}
                                                    </span>
                                                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate" title={item.project?.nameEn}>
                                                        {item.project?.nameEn || 'No Project Name'}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* 3. System Result (Verification Status) */}
                                            <td className="px-6 py-4 text-center relative">
                                                <div className="relative inline-block text-left">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenVerificationDropdownId(openVerificationDropdownId === item.id ? null : item.id);
                                                            setOpenDropdownId(null); // ปิด Dropdown ของ Review Status หากเปิดอยู่
                                                        }}
                                                        className="group hover:scale-105 transition-all duration-200 cursor-pointer focus:outline-none rounded-full flex items-center justify-center mx-auto"
                                                    >
                                                        <div className="flex items-center gap-1">
                                                            <ReportStatusBadge type="verification" status={item.verificationStatus} />
                                                            <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors">
                                                                <FiChevronDown size={12} className={`transition-transform duration-200 ${openVerificationDropdownId === item.id ? 'rotate-180' : ''}`} />
                                                            </div>
                                                        </div>
                                                    </button>

                                                    {/* Verification Dropdown Menu */}
                                                    {openVerificationDropdownId === item.id && (
                                                        <div
                                                            ref={verificationDropdownRef}
                                                            className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl bg-white dark:bg-[#1E2330] border border-gray-100 dark:border-gray-700 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right overflow-hidden"
                                                            style={{ top: '100%', left: '50%', transform: 'translateX(-50%)' }}
                                                        >
                                                            <div className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 text-left">
                                                                แก้ไขสถานะจากระบบ
                                                            </div>
                                                            <div className="p-2 space-y-1 text-left">
                                                                {(['PASS', 'FAIL', 'ERROR'] as VerificationStatus[]).map((status) => {
                                                                    const isSelected = item.verificationStatus === status;
                                                                    
                                                                    let dotColor = '';
                                                                    let label = '';
                                                                    if (status === 'PASS') {
                                                                        dotColor = 'bg-emerald-500';
                                                                        label = 'ผ่านเกณฑ์ (PASS)';
                                                                    } else if (status === 'FAIL') {
                                                                        dotColor = 'bg-rose-500';
                                                                        label = 'ไม่ผ่านเกณฑ์ (FAIL)';
                                                                    } else if (status === 'ERROR') {
                                                                        dotColor = 'bg-amber-500';
                                                                        label = 'ระบบขัดข้อง (ERROR)';
                                                                    }

                                                                    return (
                                                                        <button
                                                                            key={status}
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleVerificationSelect(item.id, status);
                                                                            }}
                                                                            className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-colors ${
                                                                                isSelected
                                                                                    ? 'bg-blue-50 dark:bg-[#2A2F45] text-blue-700 dark:text-white font-medium'
                                                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                                            }`}
                                                                        >
                                                                            <div className="flex items-center gap-3">
                                                                                <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></span>
                                                                                <span>{label}</span>
                                                                            </div>
                                                                            {isSelected && (
                                                                                <FiCheck className="text-blue-600 dark:text-indigo-400 text-lg" />
                                                                            )}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* 4. Review Status */}
                                            <td className="px-6 py-4 text-center relative">
                                                <div className="relative inline-block text-left">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenDropdownId(openDropdownId === item.id ? null : item.id);
                                                            setOpenVerificationDropdownId(null); // ปิด Dropdown ของ System Result หากเปิดอยู่
                                                        }}
                                                        className="group hover:scale-105 transition-all duration-200 cursor-pointer focus:outline-none rounded-full flex items-center justify-center mx-auto"
                                                    >
                                                        <div className="flex items-center gap-1">
                                                            <ReportStatusBadge type="review" status={item.reviewStatus} />
                                                            <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-colors">
                                                                <FiChevronDown size={12} className={`transition-transform duration-200 ${openDropdownId === item.id ? 'rotate-180' : ''}`} />
                                                            </div>
                                                        </div>
                                                    </button>

                                                    {/* Review Dropdown Menu */}
                                                    {openDropdownId === item.id && (
                                                        <div
                                                            ref={dropdownRef}
                                                            className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl bg-white dark:bg-[#1E2330] border border-gray-100 dark:border-gray-700 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right overflow-hidden"
                                                            style={{ top: '100%', left: '50%', transform: 'translateX(-50%)' }}
                                                        >
                                                            <div className="p-1" role="menu">
                                                                <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 mb-1">
                                                                    เลือกสถานะ
                                                                </div>
                                                                {statusOptions.map((option) => {
                                                                    const isSelected = item.reviewStatus === option.value;
                                                                    return (
                                                                        <button
                                                                            key={option.value}
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleStatusSelect(item.id, option.value as any);
                                                                            }}
                                                                            className={`group flex items-center justify-between w-full px-3 py-2 text-xs rounded-lg transition-all duration-150 mb-0.5 ${isSelected ? 'bg-indigo-50 dark:bg-[#2A2F45] text-indigo-700 dark:text-white font-medium' : `text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800`}`}
                                                                        >
                                                                            <div className="flex items-center gap-2.5">
                                                                                <span className={`w-2.5 h-2.5 rounded-full ${option.dotColor} shadow-sm ring-1 ring-white dark:ring-gray-800`}></span>
                                                                                <span>{option.label.split(' (')[0]}</span>
                                                                            </div>
                                                                            {isSelected && <FiCheck className="text-indigo-600 dark:text-indigo-400" size={14} />}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* 5. Date */}
                                            <td className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(item.createdAt).toLocaleDateString('th-TH', {
                                                    day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </td>

                                            {/* 6. Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); onReview(item); }}
                                                        className="p-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg transition-colors"
                                                        title="เปิดดูรายละเอียด"
                                                    >
                                                        <FiEdit3 size={18} />
                                                    </button>
                                                    <a
                                                        href={item.file.downloadUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                                                        title="ดาวน์โหลด"
                                                    >
                                                        <FiDownload size={18} />
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <Pagination meta={meta} onPageChange={onPageChange} />
                </div>
            )}

            {/* 4. MODAL SECTION: แสดงผลตาม PreviewMode */}
            {/* Case A: PDF Preview (สำหรับไฟล์ Report ทั่วไป) */}
            {previewFile && previewMode === 'PDF' && (
                <PdfPreviewModal
                    url={previewFile.file.url}
                    downloadUrl={previewFile.file.downloadUrl || previewFile.file.url}
                    fileName={previewFile.file.name}
                    fileSize={previewFile.file.size}
                    onClose={() => setPreviewFile(null)}
                />
            )}

            {/* Case B: VALIDATOR Preview (สำหรับไฟล์ CSV ที่เป็น Thesis Result) */}
            {previewFile && previewMode === 'VALIDATOR' && (
                <div className="fixed inset-0 z-[100] bg-gray-900/90 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
                    <div className="w-full h-full md:w-[95vw] md:h-[95vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
                        <ThesisValidator
                            reportFileId={previewFile.id}
                            pdfUrl={previewFile.originalFile?.url || previewFile.file.url}
                            csvUrl={previewFile.csv?.url}
                            fileName={previewFile.originalFile?.name || previewFile.file.name}
                            onClose={() => setPreviewFile(null)}
                            onSaveSuccess={onRefresh}
                        />
                    </div>
                </div>
            )}
        </>
    );
};