// src/components/shared/thesis-validator/ValidatorPDFViewer.tsx
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Issue } from './ValidatorIssueList';
import { ValidatorMarginOverlay } from './ValidatorMarginOverlay';
import { ValidatorDrawingLayer } from './ValidatorDrawingLayer';

// Setup worker (ใช้ https เพื่อความชัวร์)
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface Props {
  fileUrl: string;
  pageNumber: number;
  setNumPages: (num: number) => void;
  pageDimensions: { width: number; height: number };
  setPageDimensions: (dim: { width: number; height: number }) => void;
  issues: Issue[];
  onToggleIgnore: (id: number) => void;
  isReadOnly?: boolean;
  activeMargins: string[];
  zoomLevel: number;
  isDrawingMode: boolean;
  onDrawComplete: (bbox: number[]) => void;
}

export const ValidatorPDFViewer: React.FC<Props> = ({
  fileUrl,
  pageNumber,
  setNumPages,
  pageDimensions,
  setPageDimensions,
  issues,
  onToggleIgnore,
  isReadOnly = false,
  activeMargins,
  zoomLevel,
  isDrawingMode,
  onDrawComplete,
}) => {
  const [loadProgress, setLoadProgress] = useState(0);
  const [isDocumentLoading, setIsDocumentLoading] = useState(true);

  // State สำหรับจัดการความกว้าง PDF ให้ Responsive
  const [pdfWidth, setPdfWidth] = useState(750);

  // คำนวณความกว้างเมื่อมีการ Resize หรือโหลดครั้งแรก
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setPdfWidth(window.innerWidth - 32);
      } else {
        setPdfWidth(750); // Desktop 
      }
    };

    handleResize(); // เรียกครั้งแรกตอน Mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderOverlayBoxes = () => {
    if (!pageDimensions.width || !pageDimensions.height || issues.length === 0) {
      return null;
    }

    return issues.map((issue) => {
      if (!issue.bbox || !Array.isArray(issue.bbox) || issue.bbox.length !== 4) return null;

      const [x0, y0, x1, y1] = issue.bbox;

      let borderColor = issue.severity === 'error' ? '#f43f5e' : '#fbbf24';
      let bgColor = issue.severity === 'error' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(251, 191, 36, 0.2)';

      if (issue.isIgnored) {
        borderColor = '#3b82f6';
        bgColor = 'rgba(59, 130, 246, 0.15)';
      }

      const boxWidth = Math.abs(x1 - x0);
      const boxHeight = Math.abs(y1 - y0);

      return (
        <div
          key={issue.id}
          onClick={(e) => {
            e.stopPropagation();
            if (!isReadOnly && !isDrawingMode) onToggleIgnore(issue.id);
          }}
          className={`absolute transition-all duration-200 border-2 rounded-sm z-50 mix-blend-multiply ${isReadOnly ? 'cursor-default' : 'cursor-pointer hover:opacity-80 hover:scale-[1.05]'}`}
          style={{
            left: `${(x0 / pageDimensions.width) * 100}%`,
            top: `${(y0 / pageDimensions.height) * 100}%`,
            width: `${(boxWidth / pageDimensions.width) * 100}%`,
            height: `${(boxHeight / pageDimensions.height) * 100}%`,
            borderColor: borderColor,
            backgroundColor: bgColor,
          }}
          title={issue.message}
        />
      );
    });
  };

  return (
    // ปรับ Padding p-8 เป็น p-3 md:p-8 
    <div className="flex-1 bg-gray-100 dark:bg-gray-900 overflow-auto p-3 md:p-8 relative scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 block text-center">

      {/* 2. Chrome-like Top Loading Bar */}
      {isDocumentLoading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-100/50 dark:bg-gray-800 z-50 overflow-hidden">
          <div
            className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${loadProgress}%` }}
          />
        </div>
      )}

      <div className={`relative shadow-xl border border-gray-200 dark:border-gray-700 bg-white inline-block text-left mx-auto transition-transform duration-200 origin-top
        ${isDrawingMode ? 'cursor-crosshair' : ''}
      `}>
        <Document
          file={fileUrl}
          onLoadProgress={({ loaded, total }) => {
            if (total) {
              setLoadProgress(Math.round((loaded / total) * 100));
            }
          }}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
            setIsDocumentLoading(false);
          }}
          loading={
            <div className="flex flex-col items-center justify-center min-h-[50vh] md:h-[800px] w-full md:w-[750px] text-gray-500 gap-4 p-8">
              <div className="w-8 h-8 md:w-10 md:h-10 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
              <span className="text-xs md:text-sm font-medium animate-pulse">กำลังโหลด PDF... {loadProgress}%</span>
            </div>
          }
          error={
            <div className="flex flex-col items-center justify-center min-h-[50vh] md:h-[800px] w-full md:w-[750px] text-red-500 gap-2 p-8 text-center">
              <span className="text-3xl md:text-4xl">⚠️</span>
              <span className="text-sm md:text-base font-medium">ไม่สามารถโหลดไฟล์ PDF ได้</span>
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            width={pdfWidth}
            scale={zoomLevel}
            className="bg-white"
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading={
              <div
                className="flex items-center justify-center bg-gray-50 animate-pulse text-gray-400 text-xs md:text-sm"
                style={{
                  width: pdfWidth * zoomLevel,
                  height: (window.innerWidth < 768 ? pdfWidth * 1.414 : 1000) * zoomLevel
                }}
              >
                กำลังเรนเดอร์หน้า {pageNumber}...
              </div>
            }
            onLoadSuccess={(page) => {
              setPageDimensions({
                width: page.originalWidth,
                height: page.originalHeight
              });
            }}
          >
            {renderOverlayBoxes()}
            <ValidatorMarginOverlay activeMargins={activeMargins} pageDimensions={pageDimensions} />

            {/* วาง Drawing Layer ไว้บนสุดของหน้า PDF */}
            <ValidatorDrawingLayer
              isDrawingMode={isDrawingMode}
              pageDimensions={pageDimensions}
              onDrawComplete={onDrawComplete}
            />
          </Page>
        </Document>
      </div>
    </div>
  );
};