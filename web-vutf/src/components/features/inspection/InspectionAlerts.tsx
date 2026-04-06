// src/components/features/inspection/InspectionAlerts.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiInfo, FiClipboard, FiCheckCircle } from 'react-icons/fi';

export const NoGroupAlert: React.FC = () => {
    const navigate = useNavigate();
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-sm border border-dashed border-gray-200 dark:border-gray-700 text-center transition-colors"
        >
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <FiUsers className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">คุณยังไม่มีกลุ่มโครงงาน</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                คุณต้องเข้าร่วมกลุ่มหรือสร้างกลุ่มโครงงานก่อน จึงจะสามารถส่งเล่มรายงานความก้าวหน้าได้
            </p>
            <button
                onClick={() => navigate('/student/group-management')}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all active:scale-95"
            >
                ไปที่หน้าจัดการกลุ่ม
            </button>
        </motion.div>
    );
};

export const SelectGroupAlert: React.FC = () => (
    <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-8 text-center mb-6 transition-colors"
    >
        <FiInfo className="w-12 h-12 text-blue-400 dark:text-blue-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">กรุณาเลือกกลุ่มโครงงาน</h2>
        <p className="text-gray-600 dark:text-gray-300">เพื่อตรวจสอบรอบส่งงานที่เปิดรับสำหรับกลุ่มของคุณ</p>
    </motion.div>
);

export const NoRoundAlert: React.FC<{ error: string }> = ({ error }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-sm border border-dashed border-gray-200 dark:border-gray-700 text-center transition-colors mb-6"
    >
        <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <FiClipboard className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">ไม่มีรอบส่งงาน</h2>
        <p className="text-gray-500 dark:text-gray-400">{error}</p>
    </motion.div>
);

export const NotOwnerAlert: React.FC = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-6 mb-6 transition-colors"
    >
        <div className="flex items-start gap-3">
            <FiInfo className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
                <h3 className="font-medium text-blue-900 dark:text-blue-200">คุณไม่ได้เป็นหัวหน้ากลุ่ม</h3>
                <p className="text-blue-700 dark:text-blue-300 mt-1 text-sm">
                    เฉพาะหัวหน้ากลุ่ม (Owner) เท่านั้นที่สามารถส่งไฟล์ได้
                    กรุณาติดต่อหัวหน้ากลุ่มของคุณ หรือหากคุณยังไม่มีกลุ่ม กรุณาสร้างกลุ่มใหม่
                </p>
            </div>
        </div>
    </motion.div>
);

export const ThesisPassedAlert: React.FC = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl p-10 border border-emerald-200 dark:border-emerald-800/50 flex flex-col items-center justify-center text-center transition-colors mb-6"
    >
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-800/50 rounded-full flex items-center justify-center mb-4 text-emerald-500 dark:text-emerald-400 shadow-sm">
            <FiCheckCircle size={32} />
        </div>
        <h3 className="text-emerald-800 dark:text-emerald-300 font-bold text-xl mb-2">
            โครงงานของคุณผ่านแล้ว 🎉
        </h3>
        <p className="text-emerald-600 dark:text-emerald-400 text-sm max-w-md mx-auto">
            ยินดีด้วย! โครงงานของคุณได้รับการอนุมัติและผ่านการประเมินเรียบร้อยแล้ว จึงไม่มีรอบการส่งเอกสารเพิ่มเติม
        </p>
    </motion.div>
);

export const GroupNotApprovedAlert: React.FC<{ status?: string }> = ({ status }) => (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
        <FiInfo className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-amber-900">
            {status === 'REJECTED' ? 'กลุ่มโครงงานถูกปฏิเสธ' : 'รอการอนุมัติกลุ่มโครงงาน'}
        </h3>
        <p className="text-amber-700 mt-2">
            {status === 'REJECTED' 
                ? 'ไม่สามารถส่งงานได้เนื่องจากกลุ่มของคุณไม่ผ่านการอนุมัติ กรุณาติดต่ออาจารย์ที่ปรึกษา' 
                : 'คุณจะสามารถส่งงานได้หลังจากที่กลุ่มโครงงานได้รับการอนุมัติจากอาจารย์ที่ปรึกษาแล้วเท่านั้น'}
        </p>
    </div>
);