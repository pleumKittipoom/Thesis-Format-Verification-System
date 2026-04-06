// src/components/features/admin/users/UserFormModal.tsx
import { useState, useEffect, useRef } from 'react';
import { FiX, FiAlertCircle, FiLoader, FiLayers, FiSearch, FiCheck } from 'react-icons/fi';
import { User } from '../../../../types/user';
import { classSectionService } from '../../../../services/class-section.service';
import { ClassSection } from '../../../../types/class-section';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: User | null;
    role: 'student' | 'instructor';
    isSubmitting?: boolean;
}

export const UserFormModal = ({ isOpen, onClose, onSubmit, initialData, role, isSubmitting = false }: Props) => {
    const isEditMode = !!initialData;
    const isAddStudent = role === 'student' && !isEditMode;

    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (initialData?.student?.section) {
            const s = initialData.student.section;
            setSearchTerm(`${s.section_name} (${s.term}/${s.academic_year})`);
        } else if (!isOpen) {
            setSearchTerm(''); // ล้างค่าเมื่อปิด Modal
        }
    }, [initialData, isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // State
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        prefixName: 'นาย',
        firstName: '',
        lastName: '',
        code: '',
        phone: '',
        isActive: true,
        sectionId: '' as string | number
    });

    // State สำหรับเก็บรายการกลุ่มเรียน
    const [sections, setSections] = useState<ClassSection[]>([]);

    // Load Sections (เฉพาะตอนเป็น Student)
    useEffect(() => {
        if (role === 'student' && isOpen) {
            const loadSections = async () => {
                try {
                    // ดึงมาทั้งหมด (limit เยอะๆ)
                    const res = await classSectionService.getAll({ page: 1, limit: 1000 });
                    setSections(res.data);
                } catch (error) {
                    console.error("Failed to load sections", error);
                }
            };
            loadSections();
        }
    }, [role, isOpen]);

    // Load Data
    useEffect(() => {
        if (initialData && isOpen) {
            if (role === 'student' && initialData.student) {
                setFormData({
                    email: initialData.email || '',
                    password: '',
                    prefixName: initialData.student.prefix_name || 'นาย',
                    firstName: initialData.student.first_name || '',
                    lastName: initialData.student.last_name || '',
                    code: initialData.student.student_code || '',
                    phone: initialData.student.phone || '',
                    isActive: initialData.isActive ?? true,
                    sectionId: initialData.student.section?.section_id || ''
                });
            } else if (role === 'instructor' && initialData.instructor) {
                setFormData({
                    email: initialData.email || '',
                    password: '',
                    prefixName: '',
                    firstName: initialData.instructor.first_name || '',
                    lastName: initialData.instructor.last_name || '',
                    code: initialData.instructor.instructor_code || '',
                    phone: '',
                    isActive: initialData.isActive ?? true,
                    sectionId: ''
                });
            }
        } else if (!isOpen) {
            setFormData({ email: '', password: '', prefixName: 'นาย', firstName: '', lastName: '', code: '', phone: '', isActive: true, sectionId: '' });
        }
    }, [initialData, role, isOpen]);

    // Logic กรองข้อมูลตามคำค้นหา
    const filteredSections = sections.filter(s => {
        const term = searchTerm.toLowerCase();
        return s.section_name.toLowerCase().includes(term) ||
            String(s.academic_year).includes(term) ||
            s.term.includes(term);
    });

    // ฟังก์ชันเมื่อเลือกรายการ
    const handleSelectSection = (sec: ClassSection) => {
        setFormData({ ...formData, sectionId: sec.section_id });
        setSearchTerm(`${sec.section_name} (${sec.term}/${sec.academic_year})`);
        setIsDropdownOpen(false);
    };

    // ฟังก์ชันล้างค่า
    const handleClearSection = () => {
        setFormData({ ...formData, sectionId: '' });
        setSearchTerm('');
        setIsDropdownOpen(true);
    };

    // ... (Validation Logic เหมือนเดิม)
    const validateBulkEmails = (text: string) => {
        if (!text) return true;
        const emails = text.split(/[\n,\s]+/).filter(e => e.trim() !== '');
        return emails.every(email => email.endsWith('@mail.rmutt.ac.th'));
    };

    const validateSingleEmail = (email: string) => {
        if (!email) return true;
        if (role === 'student') return email.endsWith('@mail.rmutt.ac.th');
        // if (role === 'instructor') {
        //     if (isEditMode && initialData) {
        //         const currentEmail = initialData.email;
        //         const isEmailChanged = email !== currentEmail;
        //         const isPasswordChanged = !!formData.password;

        //         if (isEmailChanged || isPasswordChanged) {
        //             return email.endsWith('@mail.rmutt.ac.th');
        //         }
        //         return true;
        //     }
        //     return true;
        // }
        if (role === 'instructor') {
            return true;
        }
        return true;
    };

    const validatePassword = (password: string) => {
        if (password && password.length < 6) return false;
        return true;
    };

    const emailError = isAddStudent
        ? (formData.email && !validateBulkEmails(formData.email))
        : (formData.email && !validateSingleEmail(formData.email));

    const passwordError = formData.password && !validatePassword(formData.password);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (emailError || passwordError) return;

        if (isAddStudent) {
            onSubmit({ email: formData.email });
            return;
        }

        const payload: any = {
            firstName: formData.firstName,
            lastName: formData.lastName,
        };

        if (role === 'student') {
            payload.studentCode = formData.code;
            payload.phone = formData.phone;
            payload.prefixName = formData.prefixName;

            if (formData.sectionId) payload.sectionId = Number(formData.sectionId);

            if (isEditMode) payload.isActive = formData.isActive;

        } else {
            payload.instructorCode = formData.code;
            if (formData.email && formData.email !== initialData?.email) {
                payload.email = formData.email;
            }
            if (!isEditMode && formData.password) {
                payload.password = formData.password;
            }
            if (isEditMode) {
                if (formData.password) {
                    payload.password = formData.password;
                }
                payload.isActive = formData.isActive;
            }
        }
        onSubmit(payload);
    };

    if (!isOpen) return null;

    const isEmailDisabled = isEditMode && role === 'student';
    const isCodeDisabled = isEditMode && role === 'student';

    const isSubmitDisabled = !!emailError || !!passwordError || (isAddStudent && !formData.email) || isSubmitting;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        {isEditMode ? 'Edit' : (isAddStudent ? 'Invite New' : 'Add New')} {role === 'student' ? 'Student' : 'Instructor'}
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {!isAddStudent && (
                        <>
                            {/* ส่วน Prefix Name และ Class Section (จัด Layout ใหม่) */}
                            {role === 'student' && (
                                <div className="grid grid-cols-3 gap-4 mb-4">

                                    {/* 1. Prefix Name (กินพื้นที่ 1 ส่วน) */}
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prefix Name</label>
                                        <select
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white bg-white dark:bg-gray-700 h-[42px]"
                                            value={formData.prefixName}
                                            onChange={e => setFormData({ ...formData, prefixName: e.target.value })}
                                        >
                                            <option value="นาย">นาย (Mr.)</option>
                                            <option value="นางสาว">นางสาว (Ms.)</option>
                                            <option value="นาง">นาง (Mrs.)</option>
                                        </select>
                                    </div>

                                    {/* 2. Class Section Autocomplete (กินพื้นที่ 2 ส่วน - ขยายเต็มขวา) */}
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                                            Class Section
                                        </label>

                                        <div className="relative" ref={dropdownRef}>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm transition-all h-[42px] ${formData.sectionId
                                                        ? 'border-blue-500 bg-blue-50/10 dark:bg-blue-900/20 dark:border-blue-500'
                                                        : 'border-gray-300 dark:border-gray-600'
                                                        }`}
                                                    placeholder="Search section..."
                                                    value={searchTerm}
                                                    onChange={(e) => {
                                                        setSearchTerm(e.target.value);
                                                        setFormData({ ...formData, sectionId: '' });
                                                        setIsDropdownOpen(true);
                                                    }}
                                                    onFocus={() => setIsDropdownOpen(true)}
                                                />
                                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />

                                                {/* ปุ่ม Clear */}
                                                {searchTerm && (
                                                    <button
                                                        type="button"
                                                        onClick={handleClearSection}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                                                    >
                                                        <FiX size={14} />
                                                    </button>
                                                )}
                                            </div>

                                            {/* Dropdown List */}
                                            {isDropdownOpen && (
                                                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                                                    {filteredSections.length > 0 ? (
                                                        <ul className="py-1">
                                                            {filteredSections.map((sec) => (
                                                                <li
                                                                    key={sec.section_id}
                                                                    onClick={() => handleSelectSection(sec)}
                                                                    className={`px-4 py-2.5 text-sm cursor-pointer flex justify-between items-center hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors ${formData.sectionId === sec.section_id
                                                                        ? 'bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/30 dark:text-blue-300'
                                                                        : 'text-gray-700 dark:text-gray-200'
                                                                        }`}
                                                                >
                                                                    <span className="truncate mr-2">{sec.section_name}</span>
                                                                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full whitespace-nowrap">
                                                                        {sec.term}/{sec.academic_year}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                                                            No sections found
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                                        value={formData.firstName}
                                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                                        value={formData.lastName}
                                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {role === 'student' ? 'Student ID' : 'Instructor ID'}
                                    {isCodeDisabled && <span className="text-xs text-gray-400 dark:text-gray-500 font-normal ml-2">(Cannot be changed)</span>}
                                </label>
                                <input
                                    required
                                    type="text"
                                    disabled={isCodeDisabled}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white bg-white dark:bg-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-500"
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                                />
                            </div>

                            {role === 'student' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            )}

                            <hr className="my-4 border-gray-100 dark:border-gray-700" />
                        </>
                    )}

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email {role === 'student' ? '(RMUTT Only)' : ''}
                            {!isEditMode && role === 'instructor' && <span className="text-xs text-gray-400 dark:text-gray-500 font-normal ml-2">(Optional - Auto Generated if empty)</span>}
                            {isEmailDisabled && <span className="text-xs text-gray-400 dark:text-gray-500 font-normal ml-2">(Cannot be changed)</span>}
                        </label>

                        {isAddStudent ? (
                            <>
                                <textarea
                                    required
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none text-gray-900 dark:text-white bg-white dark:bg-gray-700 min-h-[150px] ${emailError
                                        ? 'border-red-500 focus:ring-red-200 dark:border-red-500 dark:focus:ring-red-900'
                                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                        }`}
                                    placeholder={`student1@mail.rmutt.ac.th\nstudent2@mail.rmutt.ac.th`}
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    * สามารถกรอกหลายอีเมลได้โดยการคั่นด้วยเครื่องหมายจุลภาค (,) หรือขึ้นบรรทัดใหม่
                                </p>
                            </>
                        ) : (
                            <input
                                type="email"
                                required={role === 'student'}
                                disabled={isEmailDisabled}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none text-gray-900 dark:text-white bg-white dark:bg-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-500 ${emailError
                                    ? 'border-red-500 focus:ring-red-200 dark:border-red-500 dark:focus:ring-red-900'
                                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                    }`}
                                placeholder="example@mail.rmutt.ac.th"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        )}

                        {/* {emailError && (
                            <div className="flex items-center gap-1 mt-1.5 text-red-500 dark:text-red-400 animate-fadeIn">
                                <FiAlertCircle size={14} />
                                <span className="text-xs">
                                    {role === 'instructor' && isEditMode
                                        ? "หากแก้ไขอีเมลหรือรหัสผ่าน ต้องใช้อีเมล @mail.rmutt.ac.th เท่านั้น"
                                        : "อีเมลต้องลงท้ายด้วย @mail.rmutt.ac.th เท่านั้น"
                                    }
                                </span>
                            </div>
                        )} */}
                        {emailError && (
                            <div className="flex items-center gap-1 mt-1.5 text-red-500 dark:text-red-400 animate-fadeIn">
                                <FiAlertCircle size={14} />
                                <span className="text-xs">
                                    อีเมลต้องลงท้ายด้วย @mail.rmutt.ac.th เท่านั้น
                                </span>
                            </div>
                        )}
                    </div>

                    {/* ... (Password Fields เหมือนเดิม) ... */}
                    {(!isAddStudent) && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Password
                                {!isEditMode && role === 'instructor' && <span className="text-xs text-gray-400 dark:text-gray-500 font-normal ml-2">(Optional)</span>}
                                {isEditMode && <span className="text-xs text-gray-400 dark:text-gray-500 font-normal ml-2">(Leave blank to keep current)</span>}
                            </label>
                            <input
                                type="password"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none text-gray-900 dark:text-white bg-white dark:bg-gray-700 ${passwordError
                                    ? 'border-red-500 focus:ring-red-200 dark:border-red-500 dark:focus:ring-red-900'
                                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                    }`}
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                placeholder={isEditMode ? "••••••••" : "อย่างน้อย 6 ตัวอักษร"}
                            />
                            {passwordError && (
                                <div className="flex items-center gap-1 mt-1.5 text-red-500 dark:text-red-400 animate-fadeIn">
                                    <FiAlertCircle size={14} />
                                    <span className="text-xs">รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร</span>
                                </div>
                            )}
                        </div>
                    )}

                    {isEditMode && (
                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                            />
                            <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">Active Status</label>
                        </div>
                    )}

                    {/* ... (Buttons เหมือนเดิม) ... */}
                    <div className="pt-6 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitDisabled}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-blue-400 disabled:shadow-none flex justify-center items-center gap-2 cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-500"
                        >
                            {isSubmitting ? (
                                <>
                                    <FiLoader className="animate-spin" />
                                    {isAddStudent ? 'Sending Invite...' : 'Saving...'}
                                </>
                            ) : (
                                isAddStudent ? 'Send Invite' : 'Save'
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};