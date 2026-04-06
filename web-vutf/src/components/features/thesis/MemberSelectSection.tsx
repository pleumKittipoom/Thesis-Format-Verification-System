// src/components/features/thesis/MemberSelectSection.tsx
// ส่วนเลือกสมาชิกกลุ่ม

import React, { useState, useRef, useEffect } from 'react';
import { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { CreateThesisGroupFormData, StudentInfo, FormGroupMember, GroupMemberRole } from '@/types/thesis';
import { FiUsers, FiPlus, FiX, FiSearch, FiUser, FiLoader } from 'react-icons/fi';
import { useStudentSearch } from '@/hooks/useStudentSearch';
import { motion, AnimatePresence } from 'framer-motion';

interface MemberSelectSectionProps {
    /** Watch function จาก react-hook-form */
    watch: UseFormWatch<CreateThesisGroupFormData>;
    /** SetValue function จาก react-hook-form */
    setValue: UseFormSetValue<CreateThesisGroupFormData>;
}

/**
 * MemberSelectSection - ส่วนเลือกสมาชิกกลุ่ม
 * * Single Responsibility: จัดการเฉพาะการเลือกสมาชิกกลุ่ม
 * * Features:
 * - Searchable autocomplete ค้นหานักศึกษา
 * - เพิ่ม/ลบสมาชิก
 * - แสดงรายการสมาชิกที่เลือก
 */
export const MemberSelectSection: React.FC<MemberSelectSectionProps> = ({
    watch,
    setValue,
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { query, setQuery, results, isLoading, clearResults } = useStudentSearch();
    const selectedMembers = watch('group_members') || [];

    // ปิด dropdown เมื่อคลิกข้างนอก
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // เพิ่มสมาชิก
    const addMember = (student: StudentInfo) => {
        // ตรวจสอบว่าซ้ำหรือไม่
        const isAlreadySelected = selectedMembers.some(
            (m) => m.student_uuid === student.student_uuid
        );

        if (!isAlreadySelected) {
            const newMember: FormGroupMember = {
                student_uuid: student.student_uuid,
                role: GroupMemberRole.MEMBER,
                studentInfo: student,
            };
            setValue('group_members', [...selectedMembers, newMember]);
        }

        clearResults();
        setIsDropdownOpen(false);
    };

    // ลบสมาชิก
    const removeMember = (studentUuid: string) => {
        const updatedMembers = selectedMembers.filter(
            (m) => m.student_uuid !== studentUuid
        );
        setValue('group_members', updatedMembers);
    };

    // กรองผลลัพธ์ที่เลือกแล้วออก
    const filteredResults = results.filter(
        (student) => !selectedMembers.some((m) => m.student_uuid === student.student_uuid)
    );

    return (
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    {/* Icon */}
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 dark:shadow-none shrink-0">
                        <FiUsers className="w-5 h-5 text-white" />
                    </div>

                    {/* Text Group */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">สมาชิกกลุ่ม</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">เพิ่มสมาชิกในกลุ่มวิทยานิพนธ์</p>
                    </div>
                </div>

                {/* Badge แสดงจำนวนสมาชิก */}
                {selectedMembers.length > 0 && (
                    <div className="flex sm:block">
                        <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium rounded-full">
                            {selectedMembers.length} คน
                        </span>
                    </div>
                )}
            </div>

            {/* Search Input */}
            <div className="relative mb-4" ref={dropdownRef}>
                <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                        type="text"
                        placeholder="ค้นหานักศึกษาด้วยชื่อหรือรหัสนักศึกษา..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsDropdownOpen(true);
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white text-sm transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500"
                    />
                    {isLoading && (
                        <FiLoader className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
                    )}
                </div>

                {/* Dropdown Results */}
                <AnimatePresence>
                    {isDropdownOpen && query.length >= 2 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden"
                        >
                            {isLoading ? (
                                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                    <FiLoader className="w-5 h-5 animate-spin mx-auto mb-2" />
                                    กำลังค้นหา...
                                </div>
                            ) : filteredResults.length > 0 ? (
                                <ul className="max-h-60 overflow-y-auto custom-scrollbar">
                                    {filteredResults.map((student) => (
                                        <li key={student.student_uuid}>
                                            <button
                                                type="button"
                                                onClick={() => addMember(student)}
                                                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left border-b border-gray-50 dark:border-gray-700 last:border-0"
                                            >
                                                {/* 1. ซ่อนรูปโปรไฟล์ในหน้าจอเล็ก (hidden) และแสดงในหน้าจอปกติ (sm:flex) */}
                                                <div className="hidden sm:flex w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full items-center justify-center shrink-0">
                                                    <FiUser className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                                                </div>

                                                {/* 2. ส่วนข้อมูลชื่อและรหัส - min-w-0 ช่วยให้ truncate ทำงานได้ถูกต้องในมือถือ */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                        {student.first_name} {student.last_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                        {student.student_id} {student.email && `• ${student.email}`}
                                                    </p>
                                                </div>

                                                <FiPlus className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                    ไม่พบนักศึกษาที่ค้นหา
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Selected Members List */}
            <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                    {selectedMembers.map((member) => (
                        <motion.div
                            key={member.student_uuid}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            // ปรับให้เป็นแนวตั้ง (col) ในมือถือ และแนวนอน (row) ในจอคอม
                            className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl group"
                        >
                            {/* บรรทัดที่ 1: Icon + ชื่อนักศึกษา (จะติดกันเสมอ) */}
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center shrink-0">
                                    <FiUser className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {member.studentInfo
                                            ? `${member.studentInfo.first_name} ${member.studentInfo.last_name}`
                                            : member.student_uuid
                                        }
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {member.studentInfo?.student_id || 'สมาชิก'}
                                    </p>
                                </div>
                            </div>

                            {/* บรรทัดที่ 2: ป้ายสมาชิก + ปุ่มลบ (จะลงมาอยู่ด้านล่างในหน้าจอเล็ก) */}
                            <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-gray-50 dark:border-gray-700">
                                <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-[10px] sm:text-xs font-medium rounded-lg shrink-0">
                                    สมาชิก
                                </span>

                                <button
                                    type="button"
                                    onClick={() => removeMember(member.student_uuid)}
                                    // ในมือถือ (opacity-100) จะแสดงตลอดเวลาเพื่อให้ลบได้สะดวก
                                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                                >
                                    <FiX className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {selectedMembers.length === 0 && (
                    <div className="py-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/30">
                        <FiUsers className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">ยังไม่มีสมาชิก</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">ค้นหาและเพิ่มสมาชิกด้านบน</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default MemberSelectSection;