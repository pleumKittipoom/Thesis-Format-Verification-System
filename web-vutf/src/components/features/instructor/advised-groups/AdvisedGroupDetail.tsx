// src/components/features/instructor/advised-groups/AdvisedGroupDetail.tsx
import React, { useState } from 'react';
import {
  FiFileText,
  FiDownload,
  FiEye,
  FiX,
} from 'react-icons/fi';
import { FaFilePdf, FaFileCsv } from 'react-icons/fa6';
import { AdvisedGroupResponse } from '../../../../types/group.types';

// Child Components
import { AdvisedGroupInfoCard } from './AdvisedGroupInfoCard';
import { SubmissionProgressCard } from './SubmissionProgressCard';
import { ProjectReportsCard } from './ProjectReportsCard';

import { ThesisValidator } from '@/components/shared/thesis-validator/ThesisValidator';

interface AdvisedGroupDetailProps {
  data: AdvisedGroupResponse;
}

type PreviewMode = 'PDF' | 'VALIDATOR';

export const AdvisedGroupDetail: React.FC<AdvisedGroupDetailProps> = ({ data }) => {
  const { progress, reports = [] } = data;

  // --- State for Modal ---
  // selectedFile จะเก็บข้อมูลไฟล์ที่จะแสดง (PDF URL, CSV URL)
  const [selectedFile, setSelectedFile] = useState<{ 
      url: string;          // PDF URL (ต้นฉบับ)
      csvUrl?: string;      // CSV URL (ถ้ามี)
      downloadUrl: string; 
      name: string; 
      type: string 
  } | null>(null);

  const [previewMode, setPreviewMode] = useState<PreviewMode>('PDF'); 

  // --- Handlers ---

  // Handle PDF Preview (ดูไฟล์ทั่วไป)
  const handlePreviewPdf = (file: { url: string; downloadUrl: string; name: string; type: string }) => {
    setPreviewMode('PDF');
    setSelectedFile(file);
  };

  // Handle CSV Preview (เปิด Validator)
  const handlePreviewValidator = (file: { url: string; downloadUrl: string; name: string; type: string }) => {
    
    // 1. หา Object Report ที่ตรงกับไฟล์ CSV นี้ เพื่อเอาเลขรอบ (roundNumber)
    const targetReport = reports.find(r => r.csvUrl === file.url);
    
    // 2. หา Object Progress ที่ตรงกับรอบของ Report (เพื่อเอาไฟล์ PDF ต้นฉบับ)
    const targetProgress = progress.find(p => p.roundNumber === targetReport?.roundNumber);
    
    setPreviewMode('VALIDATOR');
    setSelectedFile({
        ...file,
        url: targetProgress?.fileUrl || targetReport?.fileUrl || '',
        csvUrl: file.url,                
        name: targetProgress?.fileName || targetReport?.fileName || file.name.replace('.csv', '.pdf'),
        type: 'application/pdf'
    });
  };

  // Helper to close modal
  const handleCloseModal = () => {
    setSelectedFile(null);
    setPreviewMode('PDF');
  };

  // Helper for Modal Title Icon
  const getModalIcon = () => {
      if (selectedFile?.type.includes('pdf')) return <FaFilePdf size={24} className="text-red-500" />;
      return <FiFileText size={24} className="text-gray-500" />;
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* 1. Group Info */}
      <AdvisedGroupInfoCard data={data} />

      {/* 2. Submission Progress */}
      <SubmissionProgressCard 
        progress={progress} 
        onPreview={handlePreviewPdf} 
      />

      {/* 3. Project Reports */}
      <ProjectReportsCard 
        reports={reports} 
        onPreviewPdf={handlePreviewPdf} 
        onPreviewCsv={handlePreviewValidator}
      />

      {/* --- Unified Preview Modal --- */}
      {selectedFile && (
        <>
            {/* CASE A: VALIDATOR MODE (Thesis Validator Modal) */}
            {previewMode === 'VALIDATOR' && selectedFile.csvUrl && (
                <div className="fixed inset-0 z-[100] bg-gray-900/90 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
                    <div className="w-full h-full md:w-[95vw] md:h-[95vh] bg-white dark:bg-gray-900 md:rounded-xl shadow-2xl overflow-hidden">
                        <ThesisValidator
                            pdfUrl={selectedFile.url}
                            csvUrl={selectedFile.csvUrl}
                            fileName={selectedFile.name}
                            onClose={handleCloseModal}
                        />
                    </div>
                </div>
            )}

            {/* CASE B: PDF PREVIEW MODE (General File Viewer) */}
            {previewMode === 'PDF' && (
                <div className="fixed inset-0 z-[100] flex flex-col bg-gray-900/95 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in">
                    
                    {/* Header */}
                    <div className="bg-white dark:bg-gray-800 rounded-t-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700 shadow-sm shrink-0">
                        {/* Left: File Info */}
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                                {getModalIcon()}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <h3 className="font-semibold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-md">
                                    {selectedFile.name}
                                </h3>
                                <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">
                                    FILE PREVIEW
                                </p>
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <a 
                                href={selectedFile.downloadUrl} 
                                download={selectedFile.name} 
                                className="flex items-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-medium rounded-lg transition-colors"
                            >
                                <FiDownload size={16} /> <span className="hidden sm:inline">Download</span>
                            </a>
                            <button 
                                onClick={handleCloseModal} 
                                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 rounded-lg transition-colors"
                            >
                                <FiX size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 bg-gray-100 dark:bg-gray-900 rounded-b-xl overflow-hidden relative flex flex-col">
                        {selectedFile.type.includes('pdf') ? (
                            <iframe 
                                src={`${selectedFile.url}#toolbar=0`} 
                                className="w-full h-full border-none bg-gray-200 dark:bg-gray-800" 
                                title="File Preview" 
                            />
                        ) : selectedFile.type.startsWith('image/') ? (
                            <div className="w-full h-full flex items-center justify-center p-4 bg-black/50">
                                <img src={selectedFile.url} alt="Preview" className="max-w-full max-h-full object-contain shadow-2xl rounded-lg" />
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                <FiFileText size={64} className="mb-6 opacity-20" />
                                <p className="text-lg font-medium mb-2">Preview not available</p>
                                <p className="text-sm mb-6">This file type cannot be previewed directly.</p>
                                <a 
                                    href={selectedFile.downloadUrl} 
                                    download={selectedFile.name} 
                                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium shadow-lg"
                                >
                                    Download File
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
      )}
    </div>
  );
};