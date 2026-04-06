// src/pages/student/CreateThesisPage.tsx
// หน้าสร้างกลุ่มวิทยานิพนธ์

import React from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiInfo } from 'react-icons/fi';
import { CreateThesisForm } from '@/components/features/thesis/CreateThesisForm';
import { useTitle } from '@/hooks/useTitle';

/**
 * CreateThesisPage - หน้าสร้างกลุ่มวิทยานิพนธ์
 * * Features:
 * - Page header พร้อมคำอธิบาย
 * - CreateThesisForm component
 * - Responsive layout
 */
const CreateThesisPage: React.FC = () => {
    // Set page title
    useTitle('สร้างกลุ่มวิทยานิพนธ์');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/30 transition-colors">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-8"
                >
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <span>หน้าหลัก</span>
                        <span>/</span>
                        <span className="text-blue-600 dark:text-blue-400 font-medium">สร้างกลุ่มวิทยานิพนธ์</span>
                    </div>

                    {/* Title */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200 dark:shadow-none">
                            <FiFileText className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                สร้างกลุ่มวิทยานิพนธ์
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                กรอกข้อมูลเพื่อสร้างกลุ่มวิทยานิพนธ์ใหม่
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Info Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="mb-6"
                >
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-4 transition-colors">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FiInfo className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                                    คำแนะนำ
                                </h4>
                                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                                    <li>• กรอกข้อมูลวิทยานิพนธ์ให้ครบถ้วน</li>
                                    <li>• เพิ่มสมาชิกในกลุ่ม (ถ้ามี) - สมาชิกจะได้รับคำเชิญ</li>
                                    <li>• เลือกอาจารย์ที่ปรึกษาหลักอย่างน้อย 1 คน</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Form */}
                <CreateThesisForm />
            </div>
        </div>
    );
};

export default CreateThesisPage;