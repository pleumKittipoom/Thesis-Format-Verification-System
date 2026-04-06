// src/components/features/instructor/advised-groups/ProjectReportsCard.tsx
import React from 'react';
import { FiLayers, FiCheckCircle, FiAlertCircle, FiActivity, FiUser, FiEye, FiDownload, FiDatabase, FiFile } from 'react-icons/fi';
import { FaFilePdf } from 'react-icons/fa6';
import { GroupReport } from '../../../../types/group.types';

interface Props {
  reports: GroupReport[];
  // Changed to specific handlers
  onPreviewPdf: (file: { url: string; downloadUrl: string; name: string; type: string }) => void;
  onPreviewCsv: (file: { url: string; downloadUrl: string; name: string; type: string }) => void;
}

export const ProjectReportsCard: React.FC<Props> = ({ reports, onPreviewPdf, onPreviewCsv }) => {

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes && bytes !== 0) return '';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getVerificationStatusBadge = (status: string) => {
    switch (status) {
      case 'PASS': return <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-md text-xs font-bold uppercase"><FiCheckCircle /> ผ่านเกณฑ์</span>;
      case 'FAIL': return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-md text-xs font-bold uppercase"><FiAlertCircle /> ไม่ผ่านเกณฑ์</span>;
      default: return <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 rounded-md text-xs font-bold uppercase"><FiActivity /> ระบบขัดข้อง</span>;
    }
  };

  const getInstructorStatusBadge = (status: string) => {
    switch (status) {
      case 'PASSED': return <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md text-xs font-medium">ผ่าน</span>;
      case 'NOT_PASSED': return <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-md text-xs font-medium">ไม่ผ่าน</span>;
      case 'NEEDS_REVISION': return <span className="px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-md text-xs font-medium">ต้องแก้ไข</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-md text-xs font-medium">รอตรวจ</span>;
    }
  };

  const getFileType = (fileName: string): string => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return 'application/pdf';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) return 'image/' + extension;
    return 'application/octet-stream';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/50">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <FiLayers className="text-purple-600 dark:text-purple-400" /> รายการรายงานและเอกสาร (Project Reports)
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-100 dark:border-gray-700">
              <th className="px-6 py-4 font-medium w-22 text-center">รอบที่</th>
              <th className="px-6 py-4 font-medium w-20 text-center">ครั้งที่</th>
              <th className="px-6 py-4 font-medium">วันที่ตรวจ</th>
              <th className="px-6 py-4 font-medium">สถานะระบบ</th>
              <th className="px-6 py-4 font-medium">สถานะอาจารย์</th>
              <th className="px-6 py-4 font-medium min-w-[300px]">ไฟล์ที่ตรวจ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
            {reports.map((report, index) => (
              <tr key={report.id || index} className="hover:bg-purple-50/30 dark:hover:bg-purple-900/10 transition-colors">
                <td className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">{report.roundNumber}</td>
                <td className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">{report.attemptNumber || (index + 1)}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{formatDate(report.submittedAt)}</td>
                <td className="px-6 py-4">{getVerificationStatusBadge(report.verificationStatus)}</td>
                <td className="px-6 py-4">{getInstructorStatusBadge(report.reviewStatus)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    {/* PDF Icon */}
                    <div className="w-10 h-10 bg-red-50 dark:bg-white rounded-lg flex items-center justify-center shrink-0">
                      <FaFilePdf className="text-red-500 dark:text-red-500" size={20} />
                    </div>
                    
                    {/* File Name & Info */}
                    <div className="flex-1 min-w-0">
                      <button 
                        onClick={() => onPreviewPdf({
                          url: report.fileUrl, 
                          downloadUrl: report.downloadUrl || report.fileUrl, 
                          name: report.fileName, 
                          type: getFileType(report.fileName)
                        })}
                        className="text-sm font-semibold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate block text-left w-full focus:outline-none cursor-pointer"
                      >
                        {report.fileName}
                      </button>
                      <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2 mt-0.5"><span>PDF</span>{report.fileSize && <span>• {formatFileSize(report.fileSize)}</span>}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {report.csvUrl && (
                        <button 
                            onClick={() => onPreviewCsv({
                                url: report.csvUrl!, 
                                downloadUrl: report.csvUrl!, 
                                name: report.fileName.replace('.pdf', '.csv'), 
                                type: 'text/csv'
                            })}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/10 hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer"
                        >
                          <FiDatabase size={14} /> Preview Data <FiEye size={12}/>
                        </button>
                      )}
                      <a 
                        href={report.downloadUrl || report.fileUrl} 
                        download={report.fileName} 
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Download PDF"
                      >
                        <FiDownload size={18} />
                      </a>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reports.length === 0 && <div className="p-12 text-center text-gray-400 dark:text-gray-500"><FiFile className="w-12 h-12 mx-auto mb-3 opacity-20"/><p>ยังไม่มีประวัติการตรวจงาน</p></div>}
      </div>
    </div>
  );
};