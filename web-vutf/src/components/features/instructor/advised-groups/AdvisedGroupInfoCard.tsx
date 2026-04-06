import React from 'react';
import { FiBook, FiHash, FiClock, FiTag, FiUsers, FiCheckCircle, FiAlertCircle, FiActivity } from 'react-icons/fi';
import { AdvisedGroupResponse } from '../../../../types/group.types';

interface Props {
  data: AdvisedGroupResponse;
}

export const AdvisedGroupInfoCard: React.FC<Props> = ({ data }) => {
  const { thesisName, thesisCode, thesisStatus, academicYear, term, students, courseType } = data;

  const getThesisStatusBadge = (status: string) => {
    switch (status) {
      case 'PASSED':
      case 'APPROVED':
        return <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-full text-sm font-bold flex items-center gap-1"><FiCheckCircle /> สอบผ่าน</span>;
      case 'FAILED':
        return <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-full text-sm font-bold flex items-center gap-1"><FiAlertCircle /> ไม่ผ่าน</span>;
      case 'IN_PROGRESS':
      default:
        return <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-full text-sm font-bold flex items-center gap-1"><FiActivity /> กำลังดำเนินการ</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
      <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <FiBook className="text-blue-600 dark:text-blue-400" /> ข้อมูลกลุ่มปริญญานิพนธ์
        </h2>
        <div>{getThesisStatusBadge(thesisStatus)}</div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="text-sm text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">ชื่อโครงงาน</label>
            <p className="text-xl font-bold text-gray-800 dark:text-white mt-1">{thesisName}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 transition-colors">
            <div>
              <label className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 mb-1"><FiHash /> รหัสโครงงาน</label>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{thesisCode}</p>
            </div>
            <div>
              <label className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 mb-1"><FiClock /> ปีการศึกษา</label>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{academicYear ? `${academicYear}/${term}` : '-'}</p>
            </div>
            <div>
              <label className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 mb-1"><FiTag /> ประเภทโครงงาน</label>
              <p className={`font-semibold ${courseType === 'PROJECT' ? 'text-gray-700 dark:text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>{courseType}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-5 h-full border border-gray-100 dark:border-gray-700 transition-colors">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-4 uppercase tracking-wider">
              <FiUsers /> รายชื่อสมาชิก
            </h3>
            <ul className="space-y-3">
              {students.map((student, idx) => (
                <li key={idx} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 transition-colors">
                  <p className="text-sm font-bold text-gray-800 dark:text-white">{student.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{student.code}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};