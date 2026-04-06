// src/components/features/admin/track/SubmittedList.tsx
import { useEffect, useState } from 'react';
import { trackThesisService } from '@/services/track-thesis.service';
import { TrackThesisFilterParams, SubmittedGroup } from '@/types/track-thesis';
import {
  FiFileText,
  FiCheckCircle,
  FiUser,
  FiClock,
  FiDownload,
  FiAlertCircle,
  FiEye,
  FiX
} from 'react-icons/fi';
import { FaFilePdf } from 'react-icons/fa6';
import { PdfPreviewModal } from '@/components/shared/pdf-preview/PdfPreviewModal';
import { Pagination } from './Pagination';

interface Props {
  filters: TrackThesisFilterParams;
  activeTab: string;
}

export const SubmittedList = ({ filters, activeTab }: Props) => {
  const [data, setData] = useState<SubmittedGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedFile, setSelectedFile] = useState<{
    url: string;
    downloadUrl: string;
    name: string;
    type?: string;
    size?: number;
  } | null>(null);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    const fetchData = async () => {
      if (activeTab !== 'submitted') return;
      if (!filters.inspectionId && (!filters.academicYear || !filters.term)) return;

      try {
        setLoading(true);
        setError(null);

        const params = {
          ...filters,
          status: filters.submissionStatus,
          page,
          limit
        };

        const res = await trackThesisService.getSubmittedGroups(params);

        if (res.success && Array.isArray(res.data)) {
          setData(res.data as any as SubmittedGroup[]);
          if (res.meta) {
            setTotalPages(res.meta.totalPages || 1);
            setTotalItems(res.meta.totalItems || res.data.length);
          }
        } else {
          setData([]);
          setTotalItems(0);
          setTotalPages(1);
        }
      } catch (err: any) {
        console.error(err);
        setError("ไม่สามารถโหลดข้อมูลได้");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchData, 500);
    return () => clearTimeout(timer);
  }, [filters, activeTab, page, limit]);

  const getFileType = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext || '')) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image';
    return 'other';
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown Size';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper กำหนดสี Badge ตามสถานะ
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'IN_PROGRESS':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'FAILED':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'PENDING':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-500 animate-pulse">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg border border-red-200">{error}</div>;

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
        <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-full mb-4">
          <FiFileText className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-gray-500 font-medium">ยังไม่มีกลุ่มที่ส่งงานในรอบนี้</p>
        <p className="text-sm text-gray-400 mt-1">
          {filters.inspectionId ? "รอให้นักศึกษาเริ่มส่งงาน" : "กรุณาเลือกรอบการตรวจ"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="px-1 flex justify-between items-end">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          ส่งแล้วทั้งหมด <span className="text-green-600 text-2xl">{totalItems}</span> กลุ่ม
        </h3>
        {data.length > 0 && (
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            ประจำรอบ: {data[0].context?.roundLabel || 'N/A'}
          </p>
        )}
      </div>

      <div className="grid gap-4">
        {data.map((group) => (
          <div key={group.groupId} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-green-100 dark:border-green-900/30 hover:border-green-300 dark:hover:border-green-700 transition-all relative overflow-hidden group">

            <div className={`absolute top-0 left-0 w-1.5 h-full ${group.courseType === 'PROJECT' ? 'bg-green-500' : 'bg-green-500'}`} />

            <div className="flex flex-col md:flex-row justify-between gap-4 pl-2">

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                    {group.thesisCode || 'No Code'}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${group.courseType === 'PROJECT' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
                    {group.courseType}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium border uppercase ${getStatusStyles(group.submission.status)}`}>
                    {group.submission.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gray-800 dark:text-white leading-tight">
                    {group.thesisTitleTh}
                  </h4>
                  <p className="text-sm text-gray-500 font-light mt-0.5">
                    {group.thesisTitleEn}
                  </p>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                  {/* แสดงรายชื่อสมาชิกทุกคน */}
                  <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                    <FiUser className="text-slate-400 mt-1 shrink-0" />
                    <div className="flex flex-wrap gap-x-2">
                      {group.groupMembers && group.groupMembers.length > 0 ? (
                        group.groupMembers.map((member, idx) => (
                          <span key={member.studentCode}>
                            {member.name} ({member.studentCode})
                            {idx < group.groupMembers.length - 1 && <span className="text-slate-300 ml-2">|</span>}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic">ไม่พบข้อมูลสมาชิก</span>
                      )}
                    </div>
                  </div>

                  {group.advisors && group.advisors.length > 0 && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <span className="font-medium text-slate-500">ที่ปรึกษา:</span>
                      <span>{group.advisors.map(a => a.name).join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 min-w-[180px] border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700 pt-3 md:pt-0 md:pl-4">
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5 text-green-600 font-medium text-sm mb-0.5">
                    <FiCheckCircle />
                    <span>ส่งเรียบร้อย</span>
                  </div>
                  <div className="flex items-center justify-end gap-1.5 text-slate-400 text-xs">
                    <FiClock />
                    <span>
                      {new Date(group.submission.submittedAt).toLocaleString('th-TH', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </span>
                  </div>
                </div>

                {group.submission.fileUrl ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedFile({
                        url: group.submission.fileUrl,
                        downloadUrl: group.submission.downloadUrl || group.submission.fileUrl,
                        name: group.submission.fileName,
                        type: getFileType(group.submission.fileName),
                        size: group.submission.fileSize
                      })}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200"
                      title="ดูตัวอย่างไฟล์"
                    >
                      <FiEye size={18} />
                    </button>

                    <a
                      href={group.submission.downloadUrl || group.submission.fileUrl}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-all border border-slate-200"
                    >
                      <FiDownload />
                      <span>Download</span>
                    </a>
                  </div>
                ) : (
                  <span className="text-xs text-red-400 flex items-center gap-1">
                    <FiAlertCircle /> ไฟล์มีปัญหา
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        limit={limit}
        onPageChange={setPage}
      />

      {/* Modal Preview */}
      {selectedFile && selectedFile.type === 'pdf' && (
        <PdfPreviewModal
          url={selectedFile.url}
          downloadUrl={selectedFile.downloadUrl}
          fileName={selectedFile.name}
          fileSize={selectedFile.size}
          onClose={() => setSelectedFile(null)}
        />
      )}

      {/* Fallback สำหรับ Image และไฟล์อื่นๆ */}
      {selectedFile && selectedFile.type !== 'pdf' && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-gray-900/95 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="flex justify-end p-2">
            <button onClick={() => setSelectedFile(null)} className="p-2 text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors">
              <FiX size={24} />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            {selectedFile.type === 'image' ? (
              <img src={selectedFile.url} alt="Preview" className="max-w-full max-h-full object-contain rounded-md shadow-2xl" />
            ) : (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl flex flex-col items-center shadow-2xl text-center">
                <FiFileText size={48} className="mb-4 text-gray-400 opacity-50" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">ไม่รองรับการพรีวิวไฟล์ประเภทนี้ในเบราว์เซอร์</p>
                <a href={selectedFile.downloadUrl} download={selectedFile.name} className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                  <FiDownload /> ดาวน์โหลดไฟล์
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};