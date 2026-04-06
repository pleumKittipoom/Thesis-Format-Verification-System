// src/components/shared/thesis-validator/ExportPDFButton.tsx
import React, { useState } from 'react';
import { FaFilePdf } from 'react-icons/fa6';
import { Issue } from './ValidatorIssueList';
import { generateAnnotatedPdf } from '@/utils/pdf-export.util';

interface Props {
    pdfUrl: string;
    fileName: string;
    issues: Issue[];
}

export const ExportPDFButton: React.FC<Props> = ({ pdfUrl, fileName, issues }) => {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            // เรียกใช้ Logic กลางเพื่อทำการ Export
            await generateAnnotatedPdf(pdfUrl, fileName, issues);
        } catch (error) {
            console.error("Failed to export PDF:", error);
            alert("เกิดข้อผิดพลาดในการสร้างไฟล์ PDF");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={isExporting}
            className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:text-rose-300 dark:hover:bg-rose-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            title="Export Annotated PDF"
        >
            {isExporting ? (
                <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <FaFilePdf size={20} />
            )}
        </button>
    );
};