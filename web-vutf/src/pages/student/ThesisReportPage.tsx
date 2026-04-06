// src/pages/student/ThesisReportPage.tsx
// หน้า Thesis Report แสดงประวัติการส่งไฟล์

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiLoader, FiInbox, FiDownload, FiX, FiFile } from 'react-icons/fi';
import { FaFilePdf } from 'react-icons/fa6';
import { useTitle } from '@/hooks/useTitle';
import { useAuth } from '@/contexts/AuthContext';
import { groupMemberService } from '@/services/group-member.service';
import { submissionService } from '@/services/submission.service';
import { reportService } from '@/services/report.service';
import { ThesisGroup } from '@/types/thesis';
import { Submission, formatFileSize } from '@/types/submission';
import { StudentReportData } from '@/types/report';
import { OwnerGroup } from '@/hooks/useOwnerGroups';

// Components
import { GroupSelector } from '@/components/features/submission/GroupSelector';
import { ReviewRoundSection } from '@/components/features/submission/ReviewRoundSection';
import { ThesisValidator } from '@/components/shared/thesis-validator/ThesisValidator';
import { PdfPreviewModal } from '@/components/shared/pdf-preview/PdfPreviewModal';

import { PDFDocument, rgb } from 'pdf-lib';
import { generateAnnotatedPdf } from '@/utils/pdf-export.util';
import Papa from 'papaparse';
import { Issue } from '@/components/shared/thesis-validator/ValidatorIssueList';

// interface GroupOption {
//     groupId: string;
//     thesisNameTh: string;
//     thesisNameEn: string;
//     thesisCode: string;
// }

/**
 * ThesisReportPage - หน้าแสดงประวัติการส่งไฟล์
 * * Features:
 * - เลือกกลุ่ม (ถ้ามีหลายกลุ่ม)
 * - แสดง submissions grouped by inspection round
 * - Original/Report cards
 * - Download files
 */
const ThesisReportPage: React.FC = () => {
    useTitle('Thesis Report');
    const { user } = useAuth();

    // State
    const [groups, setGroups] = useState<OwnerGroup[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);

    // State สำหรับเก็บ Report ที่จับคู่กับ SubmissionId
    const [reportsMap, setReportsMap] = useState<Record<number, StudentReportData>>({});

    const [isLoadingGroups, setIsLoadingGroups] = useState(true);
    const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [loadingAction, setLoadingAction] = useState<string | null>(null);

    // State สำหรับ Preview Modal
    const [previewFile, setPreviewFile] = useState<{
        url: string;
        downloadUrl: string;
        name: string;
        type: string;
        size: number;
        mode?: 'PDF' | 'VALIDATOR';
        csvUrl?: string;
        reportId?: number;
    } | null>(null);


    /**
     * Fetch user's groups
     */
    const fetchGroups = useCallback(async () => {
        if (!user?.id) return;
        setIsLoadingGroups(true);

        try {
            const myGroups = await groupMemberService.getMyGroups();

            // Map to GroupOption format
            const groupOptions: OwnerGroup[] = myGroups.map((g: ThesisGroup) => ({
                groupId: g.group_id,
                thesisNameTh: g.thesis?.thesis_name_th || 'ไม่มีชื่อ',
                thesisNameEn: g.thesis?.thesis_name_en || '-',
                thesisCode: g.thesis?.thesis_code || '-',
                status: g.status,
                thesisStatus: g.thesis?.status,
                rejection_reason: g.rejection_reason
            }));

            setGroups(groupOptions);

            // Auto-select first group
            if (groupOptions.length > 0 && !selectedGroupId) {
                setSelectedGroupId(groupOptions[0].groupId);
            }
        } catch (error) {
            console.error('Error fetching groups:', error);
        } finally {
            setIsLoadingGroups(false);
        }
    }, [user?.id, selectedGroupId]);

    /**
     * Fetch submissions & Reports for selected group
     */
    const fetchSubmissionsAndReports = useCallback(async () => {
        if (!selectedGroupId) return;
        setIsLoadingSubmissions(true);
        setReportsMap({}); // Reset reports ก่อนโหลดใหม่

        try {
            // 1. ดึง Submissions ทั้งหมดของกลุ่ม
            const data = await submissionService.getByGroup(selectedGroupId);
            // Sort by submittedAt descending (newest first)
            const sortedSubmissions = data.sort((a, b) =>
                new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
            );
            setSubmissions(sortedSubmissions);

            // 2. ดึง Reports ของแต่ละ Submission แบบ Parallel
            const reportsData: Record<number, StudentReportData> = {};

            await Promise.all(sortedSubmissions.map(async (sub) => {
                try {
                    // ดึง report ที่ตรวจแล้ว (Status != PENDING)
                    // รับค่ามาเป็น any ก่อน เพราะเราต้องแกะ key 'data' ออกมา
                    const response: any = await reportService.getForStudent(sub.submissionId);
                    const reports = response.data || response;

                    if (Array.isArray(reports) && reports.length > 0) {
                        reportsData[sub.submissionId] = reports[0];
                    }
                } catch (err) {
                    console.error(`Error fetching report for submission ${sub.submissionId}:`, err);
                }
            }));

            setReportsMap(reportsData);

        } catch (error) {
            console.error('Error fetching submissions:', error);
            setSubmissions([]);
        } finally {
            setIsLoadingSubmissions(false);
        }
    }, [selectedGroupId]);

    // Fetch groups on mount
    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    // Fetch submissions when group changes
    useEffect(() => {
        if (selectedGroupId) {
            fetchSubmissionsAndReports();
        }
    }, [selectedGroupId, fetchSubmissionsAndReports]);

    /**
     * Helper: Download File from URL
     */
    const downloadFile = (url: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    /**
     * Handle download (Original Submission)
     */
    const handleDownloadOriginal = async (submissionId: number) => {
        try {
            setLoadingAction(`download_original_${submissionId}`);
            const res = await submissionService.getFileUrl(submissionId);
            const targetUrl = res.downloadUrl || res.url;
            downloadFile(targetUrl);
            await new Promise(resolve => setTimeout(resolve, 800)); // หน่วงเวลา UI
        } catch (error) {
            console.error('Error getting download URL:', error);
            alert('ไม่สามารถดาวน์โหลดไฟล์ได้');
        } finally {
            setLoadingAction(null);
        }
    };

    /**
     * Handle download (Annotated Report PDF)
     * สร้าง PDF ใหม่ที่มีกรอบสีแดงตามข้อมูลใน CSV
     */
    const handleDownloadReport = async (report: StudentReportData, submissionId: number) => {
        try {
            // เซ็ต Action Name
            setLoadingAction(`download_report_${submissionId}`);
            setIsGeneratingReport(true);
            const startTime = Date.now();

            const originalFileRes = await submissionService.getFileUrl(submissionId);

            if (!report.urls.csv?.url) throw new Error("ไม่พบข้อมูลพิกัด (CSV)");
            const csvText = await fetch(report.urls.csv.url).then(res => res.text());
            const parsedResults = Papa.parse(csvText, { header: false, skipEmptyLines: true });

            const mappedIssues: Issue[] = parsedResults.data.slice(1).map((row: any, index: number) => {
                let bbox = null;
                try {
                    const bboxStr = row[4]?.toString().trim().replace(/^"|"$/g, '').replace(/^\(/, '[').replace(/\)$/, ']');
                    if (bboxStr && bboxStr !== '[]') bbox = JSON.parse(bboxStr);
                } catch (e) { }

                return {
                    id: index,
                    page: parseInt(row[0]) || 1,
                    code: row[1]?.toString() || 'UNK',
                    severity: row[2]?.toString().toLowerCase() || 'warning',
                    message: row[3]?.toString().replace(/^"|"$/g, '') || '',
                    bbox: bbox,
                    isIgnored: false
                };
            });

            await generateAnnotatedPdf(originalFileRes.url, report.file_name, mappedIssues);

            const duration = Date.now() - startTime;
            if (duration < 1500) {
                await new Promise(resolve => setTimeout(resolve, 1500 - duration));
            }

        } catch (error) {
            console.error('Download Error:', error);
            alert('เกิดข้อผิดพลาดในการสร้างไฟล์รายงาน');
        } finally {
            setIsGeneratingReport(false);
            setLoadingAction(null); // เคลียร์ Action
        }
    };

    /**
     * Handle Preview (Original Submission)
     */
    const handlePreviewOriginal = async (submissionId: number, fileName: string, fileSize: number, mimeType?: string) => {
        try {
            setLoadingAction(`preview_original_${submissionId}`);
            const res = await submissionService.getFileUrl(submissionId);
            setPreviewFile({
                url: res.url,
                downloadUrl: res.downloadUrl,
                name: fileName,
                type: mimeType || 'application/pdf',
                size: fileSize,
                mode: 'PDF'
            });
        } catch (error) {
            console.error('Error opening preview:', error);
            alert('ไม่สามารถเปิดไฟล์ได้');
        } finally {
            setLoadingAction(null);
        }
    };

    /**
     * Handle Preview (Report File)
     */
    const handlePreviewReport = async (report: StudentReportData, submissionId: number) => {
        try {
            setLoadingAction(`preview_report_${submissionId}`);
            const originalFileRes = await submissionService.getFileUrl(submissionId);

            setPreviewFile({
                url: originalFileRes.url,
                downloadUrl: report.urls.pdf.downloadUrl,
                name: report.file_name,
                type: report.file_type || 'application/pdf',
                size: report.file_size,
                mode: 'VALIDATOR',
                csvUrl: report.urls.csv?.url,
                reportId: report.id
            });
        } catch (error) {
            console.error('Error fetching original file for report preview:', error);
            alert('ไม่สามารถดึงไฟล์ต้นฉบับเพื่อนำมาแสดงผลได้');
        } finally {
            setLoadingAction(null);
        }
    };

    // Loading groups
    if (isLoadingGroups) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <FiLoader className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        );
    }

    // No groups
    if (groups.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <FiInbox className="w-16 h-16 mb-4" />
                <p className="text-lg font-medium text-gray-600 dark:text-gray-300">คุณยังไม่มีกลุ่ม</p>
                <p className="text-sm mt-1">กรุณาสร้างกลุ่มหรือรอรับคำเชิญจากหัวหน้ากลุ่ม</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-[80vh] space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
            >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
                    <FiFileText className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Thesis Report</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">ประวัติการส่งไฟล์ตรวจความก้าวหน้า</p>
                </div>
            </motion.div>

            {/* Group Selector */}
            {groups.length > 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors"
                >
                    <GroupSelector
                        groups={groups}
                        selectedGroupId={selectedGroupId}
                        onSelect={setSelectedGroupId}
                    />
                </motion.div>
            )}

            {/* Single group info */}
            {groups.length === 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors"
                >
                    <GroupSelector
                        groups={groups}
                        selectedGroupId={groups[0].groupId}
                        onSelect={() => { }}
                    />
                </motion.div>
            )}

            {/* Submissions List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors"
            >
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                    <FiFileText className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                    ประวัติการส่งไฟล์
                </h2>

                {/* Loading */}
                {isLoadingSubmissions && (
                    <div className="flex items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                        <FiLoader className="w-8 h-8 animate-spin" />
                    </div>
                )}

                {/* Empty */}
                {!isLoadingSubmissions && submissions.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                        <FiInbox className="w-12 h-12 mb-3" />
                        <p className="text-base font-medium text-gray-500 dark:text-gray-400">ยังไม่มีประวัติการส่งไฟล์</p>
                        <p className="text-sm mt-1">ไฟล์ที่ส่งจะแสดงที่นี่</p>
                    </div>
                )}

                {/* Submissions by round */}
                {!isLoadingSubmissions && submissions.length > 0 && (
                    <div className="space-y-6">
                        {submissions.map((submission, index) => {
                            // ดึง Report จาก Map มาเตรียมไว้
                            const report = reportsMap[submission.submissionId];

                            return (
                                <ReviewRoundSection
                                    key={submission.submissionId}
                                    roundNumber={submission.inspectionRoundNumber || (submissions.length - index)}
                                    submission={submission}

                                    // ส่ง Report Data ไปให้ Component
                                    reportFile={report}

                                    loadingAction={loadingAction}

                                    // Actions: Original File
                                    onDownloadOriginal={() => handleDownloadOriginal(submission.submissionId)}
                                    onPreviewOriginal={() => handlePreviewOriginal(submission.submissionId, submission.fileName, submission.fileSize, submission.mimeType)}

                                    // Actions: Report File (เช็คก่อนว่ามี report ไหม)
                                    onDownloadReport={() => report && handleDownloadReport(report, submission.submissionId)}
                                    onPreviewReport={() => report && handlePreviewReport(report, submission.submissionId)}
                                />
                            );
                        })}
                    </div>
                )}
            </motion.div>

            {/* Preview Modals */}
            {previewFile && (
                <>
                    {/* Case A: PDF Preview ธรรมดา (สำหรับ Original File) */}
                    {previewFile.mode === 'PDF' && (
                        <PdfPreviewModal
                            url={previewFile.url}
                            downloadUrl={previewFile.downloadUrl}
                            fileName={previewFile.name}
                            fileSize={previewFile.size}
                            onClose={() => setPreviewFile(null)}
                        />
                    )}

                    {/* Case B: VALIDATOR Preview (สำหรับ Report File) */}
                    {previewFile.mode === 'VALIDATOR' && previewFile.reportId && (
                        <div className="fixed inset-0 z-[9999] bg-gray-900/90 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
                            <div className="w-full h-full md:w-[95vw] md:h-[95vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
                                <ThesisValidator
                                    reportFileId={previewFile.reportId}
                                    pdfUrl={previewFile.url}
                                    csvUrl={previewFile.csvUrl}
                                    fileName={previewFile.name}
                                    onClose={() => setPreviewFile(null)}
                                    isReadOnly={true}
                                />
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Overlay สำหรับการ Generate Report */}
            {isGeneratingReport && (
                <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <div className="text-center">
                            <p className="text-sm font-bold text-gray-800 dark:text-white">กำลังเตรียมไฟล์รายงาน...</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">ระบบกำลังวาดตำแหน่งที่ต้องแก้ไขลงใน PDF</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThesisReportPage;