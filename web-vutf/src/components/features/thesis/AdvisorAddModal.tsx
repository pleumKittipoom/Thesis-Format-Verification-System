import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSearch, FiUser, FiLoader, FiPlus } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { useInstructorSearch } from '@/hooks/useInstructorSearch';
import { thesisGroupService } from '@/services/thesis-group.service';
import { AdvisorRole, InstructorInfo } from '@/types/thesis';

interface AdvisorAddModalProps {
    groupId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export const AdvisorAddModal: React.FC<AdvisorAddModalProps> = ({
    groupId,
    onClose,
    onSuccess,
}) => {
    // Suppress unused
    // console.log(groupId);
    const { query, setQuery, results, isLoading: isSearching } = useInstructorSearch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedRole, setSelectedRole] = useState<AdvisorRole>(AdvisorRole.CO);

    const handleAddAdvisor = async (instructor: InstructorInfo) => {
        setIsSubmitting(true);
        try {
            await thesisGroupService.addAdvisor(groupId, {
                instructor_uuid: instructor.instructor_uuid,
                role: selectedRole,
            });

            Swal.fire({
                icon: 'success',
                title: 'เพิ่มอาจารย์สำเร็จ',
                text: 'เพิ่มอาจารย์ที่ปรึกษาเรียบร้อยแล้ว',
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                    popup: 'dark:bg-gray-800 dark:text-white',
                    title: 'dark:text-white',
                    htmlContainer: 'dark:text-gray-300'
                }
            });

            onSuccess();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'ไม่สามารถเพิ่มอาจารย์ได้',
                text: error instanceof Error ? error.message : 'เกิดข้อผิดพลาด',
                customClass: {
                    popup: 'dark:bg-gray-800 dark:text-white',
                    title: 'dark:text-white',
                    htmlContainer: 'dark:text-gray-300'
                }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/50"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden transition-colors"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">เพิ่มอาจารย์ที่ปรึกษา</h2>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Role Selection */}
                    <div className="p-5 pb-0">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">บทบาท</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedRole(AdvisorRole.MAIN)}
                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors 
                                    ${selectedRole === AdvisorRole.MAIN
                                        ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300'
                                        : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                                    }`}
                            >
                                ที่ปรึกษาหลัก
                            </button>
                            <button
                                onClick={() => setSelectedRole(AdvisorRole.CO)}
                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors
                                    ${selectedRole === AdvisorRole.CO
                                        ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300'
                                        : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                                    }`}
                            >
                                ที่ปรึกษาร่วม
                            </button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="p-5">
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="ค้นหาอาจารย์..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 outline-none transition-all"
                            />
                            {isSearching && <FiLoader className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />}
                        </div>
                    </div>

                    {/* Results */}
                    <div className="max-h-80 overflow-y-auto border-t border-gray-100 dark:border-gray-700 custom-scrollbar">
                        {query.length >= 2 && results.map((instructor) => (
                            <button
                                key={instructor.instructor_uuid}
                                onClick={() => handleAddAdvisor(instructor)}
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-50 dark:border-gray-700 last:border-0 text-left transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
                                        <FiUser className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                                            {instructor.first_name} {instructor.last_name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {instructor.instructor_code}
                                        </p>
                                    </div>
                                </div>
                                <FiPlus className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                            </button>
                        ))}
                        {query.length >= 2 && results.length === 0 && !isSearching && (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">ไม่พบข้อมูล</div>
                        )}
                        {query.length < 2 && (
                            <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-sm">พิมพ์อย่างน้อย 2 ตัวอักษร</div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};