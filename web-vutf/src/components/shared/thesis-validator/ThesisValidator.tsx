// src/components/shared/thesis-validator/ThesisValidator.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Papa from 'papaparse';
import { ValidatorHeader } from './ValidatorHeader';
import { ValidatorSidebar } from './ValidatorSidebar';
import { ValidatorPDFViewer } from './ValidatorPDFViewer';
import { ValidatorAddIssueModal, NewIssueData } from './ValidatorAddIssueModal';
import { Issue } from './ValidatorIssueList';
import { api } from '@/services/api';

interface Props {
  reportFileId: number;
  pdfUrl: string;
  csvUrl?: string;
  fileName: string;
  onClose: () => void;
  onSaveSuccess?: () => void;
  isReadOnly?: boolean;
}

export const ThesisValidator: React.FC<Props> = ({
  reportFileId,
  pdfUrl,
  csvUrl,
  fileName,
  onClose,
  onSaveSuccess,
  isReadOnly = false
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });
  const [isLoadingCsv, setIsLoadingCsv] = useState(!!csvUrl);
  const [isSavingToServer, setIsSavingToServer] = useState(false);
  const [activeMargins, setActiveMargins] = useState<string[]>([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempBBox, setTempBBox] = useState<number[] | null>(null);

  // 1. Fetch & Parse CSV
  useEffect(() => {
    if (!csvUrl) {
      setIsLoadingCsv(false);
      return;
    }

    setIsLoadingCsv(true);

    fetch(csvUrl)
      .then(res => res.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: false,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedIssues: Issue[] = [];
            if (results.data && results.data.length > 0) {
              // สมมติ row แรกเป็น header ให้ slice(1)
              results.data.slice(1).forEach((row: any, index) => {
                // ป้องกัน row ว่าง
                if (!row || row.length < 4) return;

                let bbox = null;
                try {
                  if (row[4]) {
                    // 1. แปลงข้อมูลเป็น string และลบ quote หน้า-หลัง (ถ้ามี)
                    let bboxStr = row[4].toString().trim().replace(/^"|"$/g, '');

                    // แปลง ( ) เป็น [ ] เพื่อให้ JSON อ่านได้
                    if (bboxStr.startsWith('(') && bboxStr.endsWith(')')) {
                      bboxStr = bboxStr.replace(/^\(/, '[').replace(/\)$/, ']');
                    }

                    // 2. Parse JSON
                    if (bboxStr && bboxStr !== '[]') {
                      bbox = JSON.parse(bboxStr);
                      // ตรวจสอบว่าเป็น Array และมี 4 ตัวเลข
                      if (!Array.isArray(bbox) || bbox.length !== 4) bbox = null;
                    }
                  }
                } catch (e) {
                  // console.warn("BBox Parse Error:", row[4]); 
                  bbox = null;
                }

                parsedIssues.push({
                  id: index,
                  page: parseInt(row[0]) || 1,
                  code: row[1]?.toString() || 'UNK',
                  severity: row[2]?.toString().toLowerCase() || 'warning',
                  message: row[3]?.toString().replace(/^"|"$/g, '') || '',
                  bbox: bbox,
                  isIgnored: false
                });
              });
            }
            setIssues(parsedIssues);
            setIsLoadingCsv(false);
          },
          error: (err: any) => {
            console.error("Papa Parse Error:", err);
            setIsLoadingCsv(false);
          }
        });
      })
      .catch((err: any) => {
        console.error("Error loading CSV:", err);
        setIsLoadingCsv(false);
      });
  }, [csvUrl]);

  // 2. Logic Helpers
  const currentPageIssues = useMemo(() =>
    issues.filter(i => i.page === pageNumber),
    [issues, pageNumber]);

  const toggleIgnore = useCallback((id: number) => {
    setIssues(prev => prev.map(i =>
      i.id === id ? { ...i, isIgnored: !i.isIgnored } : i
    ));
  }, []);

  const handleApproveAndNext = useCallback(() => {
    // 1. เช็คว่าหน้าปัจจุบันมี Issue ที่ยังไม่ ignore ไหม
    const hasActiveIssues = issues.some(i => i.page === pageNumber && !i.isIgnored);

    if (hasActiveIssues) {
      // ถ้ามี -> สั่ง Ignore ทั้งหมดในหน้านี้
      setIssues(prev => prev.map(issue =>
        issue.page === pageNumber ? { ...issue, isIgnored: true } : issue
      ));
    }

    // 2. ไปหน้าถัดไป (ถ้ายังไม่ถึงหน้าสุดท้าย)
    if (numPages && pageNumber < numPages) {
      setPageNumber(p => p + 1);
    }
  }, [issues, pageNumber, numPages]);

  const jumpToNextIssue = useCallback(() => {
    if (!numPages) return;

    // หาหน้าถัดไปที่มีปัญหา (Active Issue)
    let targetPage = -1;

    // loop จากหน้าถัดไปจนจบ
    for (let p = pageNumber + 1; p <= numPages; p++) {
      if (issues.some(i => i.page === p && !i.isIgnored)) {
        targetPage = p;
        break;
      }
    }

    // ถ้าไม่เจอ ให้วนกลับไปหาตั้งแต่หน้าแรก
    if (targetPage === -1) {
      for (let p = 1; p <= pageNumber; p++) {
        if (issues.some(i => i.page === p && !i.isIgnored)) {
          targetPage = p;
          break;
        }
      }
    }

    if (targetPage !== -1) {
      setPageNumber(targetPage);
    } else {
      alert("🎉 ไม่พบปัญหาคงเหลือแล้ว (No active issues found)");
    }
  }, [numPages, pageNumber, issues]);

  // --- ฟังก์ชันนี้สำหรับสร้าง CSV  ---
  const generateUpdatedCSVString = useCallback(() => {
    if (issues.length === 0) return null;

    // กรองเอาเฉพาะที่ยังไม่ถูก Ignore
    const activeIssues = issues.filter(issue => !issue.isIgnored);

    // สร้างข้อมูลแต่ละแถว
    const csvData = activeIssues.map(issue => {
      let bboxStr = '';
      if (issue.bbox) {
        bboxStr = JSON.stringify(issue.bbox).replace('[', '(').replace(']', ')');
      }
      return [issue.page, issue.code, issue.severity, issue.message, bboxStr];
    });

    // ต่อกับ Header
    const finalData = [
      ["page", "code", "severity", "message", "bbox"],
      ...csvData
    ];

    return Papa.unparse(finalData);
  }, [issues]);

  // handleExportCSV 
  const handleExportCSV = useCallback(() => {
    const csvString = generateUpdatedCSVString();
    if (!csvString) return;

    // สร้างไฟล์และสั่งดาวน์โหลด
    const blob = new Blob(["\ufeff" + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `report_${fileName}.csv`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [generateUpdatedCSVString, fileName]);

  const getCsvStringFromIssues = useCallback((currentIssues: Issue[]) => {
    if (currentIssues.length === 0) return null;

    // กรองเอาเฉพาะที่ยังไม่ถูก Ignore
    const activeIssues = currentIssues.filter(issue => !issue.isIgnored);

    const csvData = activeIssues.map(issue => {
      let bboxStr = '';
      if (issue.bbox) {
        // แปลง [ ] เป็น ( ) ตาม format เดิม
        bboxStr = JSON.stringify(issue.bbox).replace('[', '(').replace(']', ')');
      }
      return [issue.page, issue.code, issue.severity, issue.message, bboxStr];
    });

    const finalData = [
      ["page", "code", "severity", "message", "bbox"],
      ...csvData
    ];

    return Papa.unparse(finalData);
  }, []);

  // ฟังก์ชันหลักสำหรับบันทึกข้อมูลขึ้น Server (รับข้อมูล issues เข้ามาโดยตรง)
  const performSaveToServer = useCallback(async (targetIssues: Issue[]) => {
    const csvString = getCsvStringFromIssues(targetIssues);
    if (!csvString) {
      // กรณีไม่มี issue เหลือเลย (อาจถูกลบหรือ ignore หมด) ให้ส่งไฟล์เปล่าที่มีแต่ header
      // หรือจัดการตามที่ระบบ Backend ต้องการ
    }

    setIsSavingToServer(true);
    try {
      await api.put(`/report-file/${reportFileId}/csv`, {
        csvContent: csvString
      });

      // ถ้าบันทึกสำเร็จ ให้กรองเอา issue ที่ถูก ignore ออกจากหน้าจอ
      setIssues(prev => prev.filter(issue => !issue.isIgnored));

      if (onSaveSuccess) {
        onSaveSuccess();
      }
      return true;
    } catch (error: any) {
      console.error("Save error:", error);
      alert(`❌ ไม่สามารถบันทึกลงฐานข้อมูลได้: ${error.message}`);
      return false;
    } finally {
      setIsSavingToServer(false);
    }
  }, [getCsvStringFromIssues, reportFileId, onSaveSuccess]);

  const handleSaveToServer = useCallback(async () => {
    await performSaveToServer(issues);
    alert("✅ บันทึกการตรวจสอบทั้งหมดเรียบร้อยแล้ว!");
  }, [performSaveToServer, issues]);

  const handleDrawComplete = useCallback((bbox: number[]) => {
    setTempBBox(bbox);
    setIsModalOpen(true); // เปิด Modal ฟอร์ม
  }, []);

  const handleSaveNewIssue = useCallback(async (data: NewIssueData) => {
    const newIssue: Issue = {
      id: Date.now(),
      page: pageNumber,
      code: data.code,
      severity: data.severity,
      message: data.message,
      bbox: tempBBox,
      isIgnored: false
    };

    // สร้างรายการ Issues ใหม่รวมกับของเดิม
    const updatedIssues = [...issues, newIssue];

    // อัปเดต State หน้าจอ
    setIssues(updatedIssues);

    // บันทึกลงฐานข้อมูลทันที
    const success = await performSaveToServer(updatedIssues);

    if (success) {
      setIsModalOpen(false);
      setTempBBox(null);
      setIsDrawingMode(false);
    }
  }, [pageNumber, tempBBox, issues, performSaveToServer]);

  // 4. Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ถ้าพิมพ์ใน Input/Textarea ไม่ต้องทำงาน
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

      switch (e.key) {
        case 'ArrowRight':
          setPageNumber((p) => Math.min(numPages || 1, p + 1));
          break;
        case 'ArrowLeft':
          setPageNumber((p) => Math.max(1, p - 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (!isReadOnly) {
            handleApproveAndNext();
          } else {
            if (numPages && pageNumber < numPages) {
              setPageNumber(p => p + 1);
            }
          }
          break;
        case 'Escape':
          if (isDrawingMode) {
            setIsDrawingMode(false);
          } else if (isModalOpen) {
            setIsModalOpen(false);
            setTempBBox(null);
          } else {
            onClose();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [numPages, pageNumber, jumpToNextIssue, onClose, handleApproveAndNext, isReadOnly]);

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 w-full">
      <div className="shrink-0">
        <ValidatorHeader
          fileName={fileName}
          pageNumber={pageNumber}
          numPages={numPages}
          setPageNumber={setPageNumber}
          onClose={onClose}
          onNextIssue={jumpToNextIssue}
          onDownloadReport={handleExportCSV}
          pdfUrl={pdfUrl}
          issues={issues}
          onSaveToServer={!isReadOnly ? handleSaveToServer : undefined}
          isSaving={isSavingToServer}
          activeMargins={activeMargins}
          setActiveMargins={setActiveMargins}
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
          isDrawingMode={isDrawingMode}
          setIsDrawingMode={setIsDrawingMode}
          isReadOnly={isReadOnly}
        />
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
        {isLoadingCsv && (
          <div className="absolute inset-0 z-50 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Loading Report Data...</span>
            </div>
          </div>
        )}

        <ValidatorPDFViewer
          fileUrl={pdfUrl}
          pageNumber={pageNumber}
          setNumPages={setNumPages}
          pageDimensions={pageDimensions}
          setPageDimensions={setPageDimensions}
          issues={currentPageIssues}
          onToggleIgnore={toggleIgnore}
          isReadOnly={isReadOnly}
          activeMargins={activeMargins}
          zoomLevel={zoomLevel}
          isDrawingMode={isDrawingMode}
          onDrawComplete={handleDrawComplete}
        />

        <ValidatorSidebar
          numPages={numPages}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          issues={issues}
          currentPageIssues={currentPageIssues}
          onToggleIgnore={toggleIgnore}
          isReadOnly={isReadOnly}
        />

        <ValidatorAddIssueModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setTempBBox(null);
          }}
          onSave={handleSaveNewIssue}
          bbox={tempBBox}
        />
      </div>
    </div>
  );
};