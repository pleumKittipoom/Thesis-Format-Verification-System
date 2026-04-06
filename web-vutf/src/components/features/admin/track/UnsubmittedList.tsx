// src/components/features/admin/track/UnsubmittedList.tsx
import React, { useState, useEffect } from 'react';
import { UnsubmittedGroup, TrackThesisFilterParams } from '@/types/track-thesis';
import { FiMail, FiAlertCircle, FiUser, FiCalendar, FiRefreshCw } from 'react-icons/fi';
import { trackThesisService } from '@/services/track-thesis.service';
import { toast } from 'react-hot-toast';
import { Pagination } from './Pagination';

interface Props {
  data: UnsubmittedGroup[];
  loading: boolean;
  error: string | null;
  filters: TrackThesisFilterParams;
}

export const UnsubmittedList = ({ data, loading, error, filters }: Props) => {
  const [sendingId, setSendingId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    setPage(1);
  }, [data]);

  const totalItems = data?.length || 0;
  const totalPages = Math.ceil(totalItems / limit);
  const paginatedData = data?.slice((page - 1) * limit, page * limit) || [];

  const handleSendReminder = async (groupId: string) => {
    const groupData = data.find(g => g.groupId === groupId);
    const targetInspectionId = filters.inspectionId || groupData?.missingContext?.inspectionId;

    if (!targetInspectionId) {
      return toast.error('ไม่สามารถระบุรอบการตรวจได้ กรุณาเลือกรอบการตรวจอีกครั้ง');
    }

    try {
      setSendingId(groupId);
      const res = await trackThesisService.remindGroup(groupId, targetInspectionId);
      // const res = await trackThesisService.remindGroup(groupId, Number(targetInspectionId));

      // console.log("API Response:", res);

      if (res.success) {
        toast.success(res.message || 'ส่งอีเมลแจ้งเตือนสำเร็จ');
      } else {
        toast.error(res.message || 'ไม่สามารถส่งอีเมลได้');
      }
    } catch (err) {
      console.error(err);
      toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อระบบ');
    } finally {
      setSendingId(null);
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-500 animate-pulse">กำลังโหลดข้อมูลรายชื่อ...</div>;
  if (error) return <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg border border-red-200">{error}</div>;

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
        <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-full mb-4">
          <FiAlertCircle className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-gray-500 font-medium">ไม่พบกลุ่มที่ค้างส่งงานในเงื่อนไขนี้</p>
        <p className="text-sm text-gray-400 mt-1">
          {filters.inspectionId ? "ทุกคนส่งงานครบแล้ว หรือไม่มีข้อมูล" : "กรุณาเลือกรอบการตรวจ"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="px-1 flex flex-col sm:flex-row justify-between items-end sm:items-center gap-3 mb-4 transition-colors duration-200">
        <div className="w-full sm:w-auto">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            ยังไม่ส่งจำนวน
            <span className="text-red-600 dark:text-red-500 text-2xl mx-1">
              {data.length}
            </span>
            กลุ่ม
          </h3>
        </div>

        {data.length > 0 && (
          <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            ประจำรอบ: {data[0].missingContext?.roundLabel || 'N/A'}
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {paginatedData.map((group) => (
          <div key={group.groupId} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-700 transition-all group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500" />

            <div className="flex flex-col md:flex-row justify-between gap-4 pl-2">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">{group.thesisCode || 'No Code'}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${group.courseType === 'PROJECT' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>{group.courseType}</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800 dark:text-white leading-tight">{group.thesisTitleTh}</h4>
                  <p className="text-sm text-gray-500 font-light mt-0.5">{group.thesisTitleEn}</p>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/50 text-slate-600 dark:text-slate-400">
                  <div className="flex items-start gap-2"><FiUser className="text-slate-400 mt-1 shrink-0" />
                    <div className="flex flex-wrap gap-x-2">
                      {group.groupMembers?.map((member, idx) => (
                        <span key={member.studentCode}>{member.name} ({member.studentCode}){idx < group.groupMembers.length - 1 && <span className="text-slate-300 ml-2">|</span>}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 min-w-[160px] border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700 pt-3 md:pt-0 md:pl-4">
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5 text-red-500 font-medium text-sm mb-0.5">
                    <FiAlertCircle /> <span>ยังไม่ส่งงาน</span>
                  </div>
                  <div className="flex items-center justify-end gap-1.5 text-slate-400 text-xs">
                    <FiCalendar /> <span>Deadline: {group.missingContext?.deadline ? new Date(group.missingContext.deadline).toLocaleDateString('th-TH') : 'N/A'}</span>
                  </div>
                </div>

                {/* ปุ่ม "ตามงาน" */}
                <button
                  disabled={sendingId === group.groupId}
                  onClick={() => handleSendReminder(group.groupId)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all w-full md:w-auto justify-center
                    ${sendingId === group.groupId
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-red-900/20'
                    }`}
                >
                  {sendingId === group.groupId ? (
                    <FiRefreshCw className="animate-spin" />
                  ) : (
                    <FiMail />
                  )}
                  <span>{sendingId === group.groupId ? 'กำลังส่ง...' : 'ตามงาน'}</span>
                </button>
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
    </div>
  );
};