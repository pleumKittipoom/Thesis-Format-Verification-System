import React from 'react';
import { FiFileText, FiCheckCircle, FiAlertCircle, FiEye, FiDownload } from 'react-icons/fi';
import { GroupProgress } from '../../../../types/group.types';

interface Props {
  progress: GroupProgress[];
  onPreview: (file: { url: string; downloadUrl: string; name: string; type: string }) => void;
}

export const SubmissionProgressCard: React.FC<Props> = ({ progress, onPreview }) => {
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const getSubmissionStatusBadge = (status: string) => {
    switch (status) {
      case 'WAITING_FOR_SUBMISSION': return <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium">ยังไม่ส่ง</span>;
      case 'PENDING': return <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-md text-xs font-medium">รอตรวจสอบ</span>;
      case 'IN_PROGRESS': return <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md text-xs font-medium">กำลังตรวจ</span>;
      case 'COMPLETED': return <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md text-xs font-medium flex items-center gap-1 w-fit"><FiCheckCircle /> ตรวจแล้ว</span>;
      case 'OVERDUE': return <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md text-xs font-medium flex items-center gap-1 w-fit"><FiAlertCircle /> เลยกำหนด</span>;
      default: return <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md text-xs font-medium">ยังไม่ส่ง</span>;
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
          <FiFileText className="text-blue-600 dark:text-blue-400" /> ประวัติการส่งงาน (Submission Progress)
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-100 dark:border-gray-700">
              <th className="px-6 py-4 font-medium w-16 text-center">#</th>
              <th className="px-6 py-4 font-medium">รอบการตรวจ</th>
              <th className="px-6 py-4 font-medium">ช่วงเวลาที่กำหนด</th>
              <th className="px-6 py-4 font-medium">สถานะ</th>
              <th className="px-6 py-4 font-medium text-center">ไฟล์แนบ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
            {progress.map((item) => (
              <tr key={item.roundId} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                <td className="px-6 py-4 text-center font-medium text-gray-400 dark:text-gray-500">{item.roundNumber}</td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-800 dark:text-white">{item.roundTitle}</p>
                  {item.submittedAt && <p className="text-xs text-green-600 dark:text-green-400 mt-1">ส่งเมื่อ: {formatDate(item.submittedAt)}</p>}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{formatDate(item.startDate)} - {formatDate(item.endDate)}</td>
                <td className="px-6 py-4">{getSubmissionStatusBadge(item.status)}</td>
                <td className="px-6 py-4 text-center">
                  {item.fileUrl ? (
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => onPreview({ url: item.fileUrl!, downloadUrl: item.downloadUrl || item.fileUrl!, name: item.fileName || 'document.pdf', type: getFileType(item.fileName || 'document.pdf') })} className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"><FiEye size={18} /></button>
                      <a href={item.downloadUrl || item.fileUrl} download={item.fileName} className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"><FiDownload size={18} /></a>
                    </div>
                  ) : <span className="text-gray-300 dark:text-gray-600 text-sm">-</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {progress.length === 0 && <div className="p-8 text-center text-gray-400 dark:text-gray-500">ไม่พบรอบการตรวจที่เกี่ยวข้อง</div>}
      </div>
    </div>
  );
};