// src/pages/admin/UserManagementPage.tsx
import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiFilter, FiRotateCcw } from 'react-icons/fi';

// Components
import { UserTabs } from '../../components/features/admin/users/UserTabs';
import { UserTable } from '../../components/features/admin/users/UserTable';
import { SectionTable } from '../../components/features/admin/class-sections/SectionTable';
import { Pagination } from '../../components/common/Pagination';

// Modals
import { UserFormModal } from '../../components/features/admin/users/UserFormModal';
import { SectionFormModal } from '../../components/features/admin/class-sections/SectionFormModal';

// Hooks (Logic)
import { useUserManagement } from '../../hooks/admin/useUserManagement';
import { useSectionManagement } from '../../hooks/admin/useSectionManagement';
import { useDebounce } from '../../hooks/useDebounce';

// Services
import { classSectionService } from '../../services/class-section.service';

// Types
import { User } from '../../types/user';
import { ClassSection } from '../../types/class-section';

// Utils
import { swal } from '../../utils/swal';

export const UserManagementPage = () => {
  // --- UI State ---
  const [activeTab, setActiveTab] = useState<'student' | 'instructor' | 'section'>('student');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;
  const debouncedSearch = useDebounce(searchTerm, 500);

  // --- Filter State ---
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [dropdownSections, setDropdownSections] = useState<ClassSection[]>([]);

  // --- Modal State ---
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<ClassSection | null>(null);

  // --- Custom Hooks ---
  const userMgr = useUserManagement();
  const sectionMgr = useSectionManagement();

  const currentMeta = activeTab === 'section' ? sectionMgr.meta : userMgr.meta;

  const paginationMeta = {
    page: page,
    limit: limit,
    // แปลงจาก totalItems (API เก่า) -> total (Component ใหม่)
    total: currentMeta?.totalItems || 0,
    // แปลงจาก totalPages (API เก่า) -> lastPage (Component ใหม่)
    lastPage: currentMeta?.totalPages || 1
  };

  // --- Effects ---
  useEffect(() => {
    setPage(1);
  }, [activeTab, debouncedSearch, selectedYear, selectedTerm, selectedSectionId]);

  useEffect(() => {
    const loadSectionsForDropdown = async () => {
      try {
        const res = await classSectionService.getAll({ page: 1, limit: 1000 });
        setDropdownSections(res.data);
      } catch (error) {
        console.error("Failed to load sections for dropdown", error);
      }
    };
    loadSectionsForDropdown();
  }, []);

  useEffect(() => {
    if (activeTab === 'section') {
      sectionMgr.fetchSections(page, limit, debouncedSearch, {
        academic_year: selectedYear ? Number(selectedYear) : undefined,
        term: selectedTerm || undefined
      });
    } else {
      userMgr.fetchUsers(activeTab, page, limit, debouncedSearch, {
        academicYear: selectedYear,
        term: selectedTerm,
        sectionId: selectedSectionId ? Number(selectedSectionId) : undefined
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, debouncedSearch, page, selectedYear, selectedTerm, selectedSectionId]);

  // --- Handlers ---
  const handleAddNew = () => {
    if (activeTab === 'section') {
      setSelectedSection(null);
      setIsSectionModalOpen(true);
    } else {
      setSelectedUser(null);
      setIsUserModalOpen(true);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedYear('');
    setSelectedTerm('');
    setSelectedSectionId('');
    setPage(1);
  };

  const handleViewDetail = (user: User) => {
    const isStudent = user.role === 'student';
    const roleLabel = isStudent ? 'นักศึกษา' : 'อาจารย์';

    let name = '-';
    let code = '-';
    let sectionInfo = '-';
    let phone = '-';

    if (isStudent && user.student) {
      name = `${user.student.prefix_name || ''}${user.student.first_name} ${user.student.last_name}`;
      code = user.student.student_code;
      phone = user.student.phone || '-';
      if (user.student.section) {
        sectionInfo = `${user.student.section.section_name} (${user.student.section.term}/${user.student.section.academic_year})`;
      }
    } else if (!isStudent && user.instructor) {
      name = `${user.instructor.first_name} ${user.instructor.last_name}`;
      code = user.instructor.instructor_code;
    }

    const firstChar = name !== '-' ? name.charAt(0) : '?';
    const statusHtml = user.isActive
      ? `<span class="px-2.5 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-800">ใช้งานปกติ</span>`
      : `<span class="px-2.5 py-1 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full border border-red-200 dark:border-red-800">ถูกระงับ</span>`;

    swal.fire({
      title: `ข้อมูล${roleLabel}`,
      html: `
            <div class="text-left mt-4 space-y-5">
                <div class="flex items-center gap-4 pb-5 border-b border-gray-100 dark:border-gray-700">
                    <div class="w-16 h-16 bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 rounded-full flex items-center justify-center text-3xl font-bold shadow-sm">
                        ${firstChar}
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white m-0">${name}</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 m-0 mt-1">${user.email}</p>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                        <span class="block text-xs text-gray-500 dark:text-gray-400 mb-1">รหัส${roleLabel}</span>
                        <strong class="text-sm text-gray-900 dark:text-white font-mono">${code}</strong>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                        <span class="block text-xs text-gray-500 dark:text-gray-400 mb-1">สถานะการใช้งาน</span>
                        <div class="mt-1">${statusHtml}</div>
                    </div>
                    
                    ${isStudent ? `
                    <div class="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                        <span class="block text-xs text-gray-500 dark:text-gray-400 mb-1">เบอร์โทรศัพท์</span>
                        <strong class="text-sm text-gray-900 dark:text-white font-mono">${phone}</strong>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                        <span class="block text-xs text-gray-500 dark:text-gray-400 mb-1">กลุ่มเรียน (Section)</span>
                        <strong class="text-sm text-gray-900 dark:text-white">${sectionInfo}</strong>
                    </div>
                    ` : ''}
                </div>
            </div>
        `,
      showCloseButton: true,
      showConfirmButton: false,
      width: '400px',
    });
  };

  return (
    <div className="max-w-7xl mx-auto pb-10 px-4">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pt-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">จัดการข้อมูลระบบ</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">จัดการข้อมูล นักศึกษา อาจารย์ และกลุ่มเรียน</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg font-medium cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          <FiPlus size={20} />
          {activeTab === 'section' ? 'เพิ่มกลุ่มเรียน' : 'เพิ่มผู้ใช้งาน'}
        </button>
      </div>

      {/* 2. Controls Section */}
      <div className="flex flex-col gap-6 mb-6">

        {/* --- ค้นหา และ ตัวกรอง --- */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">

          {/* ค้นหา */}
          <div className="relative w-full lg:w-80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder={activeTab === 'section' ? "ค้นหารหัสกลุ่มเรียน..." : "ค้นหา ชื่อ, อีเมล, รหัส..."}
              className="w-full pl-10 pr-4 py-2 text-gray-600 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white dark:bg-gray-700 dark:placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* ตัวกรอง */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
            {(activeTab === 'student' || activeTab === 'section') && (
              <>
                <div className="flex items-center gap-2 px-3 py-2 text-gray-400 dark:text-gray-500 text-sm italic">
                  <FiFilter /> กรองข้อมูล:
                </div>

                {/* ปีการศึกษา */}
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-2 text-gray-600 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 min-w-[100px]"
                >
                  <option value="">ทุกปีการศึกษา</option>
                  {[...new Set(dropdownSections.map(s => s.academic_year))]
                    .sort((a, b) => b - a)
                    .map(year => (
                      <option key={year} value={String(year)}>{year}</option>
                    ))
                  }
                </select>

                {/* เทอม */}
                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="px-3 py-2 text-gray-600 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 min-w-[100px]"
                >
                  <option value="">ทุกเทอม</option>
                  <option value="1">เทอม 1</option>
                  <option value="2">เทอม 2</option>
                  <option value="3">เทอม 3 (Summer)</option>
                </select>

                {/* กลุ่มเรียน */}
                {activeTab === 'student' && (
                  <select
                    value={selectedSectionId}
                    onChange={(e) => setSelectedSectionId(e.target.value)}
                    className="px-3 py-2 text-gray-600 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 min-w-[150px]"
                  >
                    <option value="">ทุกกลุ่มเรียน</option>
                    {dropdownSections
                      .filter(s =>
                        (!selectedYear || s.academic_year === Number(selectedYear)) &&
                        (!selectedTerm || String(s.term) === selectedTerm)
                      )
                      .map(section => (
                        <option key={section.section_id} value={section.section_id}>
                          {section.section_name}
                        </option>
                      ))
                    }
                  </select>
                )}

                {/* ปุ่มรีเซ็ตค่า */}
                {(searchTerm || selectedYear || selectedTerm || selectedSectionId) && (
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1.5 px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
                    title="ล้างตัวกรองทั้งหมด"
                  >
                    <FiRotateCcw size={14} /> รีเซ็ต
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* --- แถบ (Tabs) --- */}
        <div className="flex items-center">
          <UserTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* 3. Content Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        {activeTab === 'section' ? (
          <SectionTable
            data={sectionMgr.data}
            isLoading={sectionMgr.isLoading}
            onEdit={(item) => { setSelectedSection(item); setIsSectionModalOpen(true); }}
            onDelete={(id) => sectionMgr.deleteSection(id, () => sectionMgr.fetchSections(page, limit, debouncedSearch, {
              academic_year: selectedYear ? Number(selectedYear) : undefined,
              term: selectedTerm || undefined
            }))}
            onRefresh={() => sectionMgr.fetchSections(page, limit, debouncedSearch, {
              academic_year: selectedYear ? Number(selectedYear) : undefined,
              term: selectedTerm || undefined
            })}
          />
        ) : (
          <UserTable
            data={userMgr.data}
            totalItems={userMgr.meta?.totalItems || 0}
            role={activeTab}
            isLoading={userMgr.isLoading}
            onEdit={(user) => { setSelectedUser(user); setIsUserModalOpen(true); }}
            onDelete={(id) => userMgr.deleteUser(id, () => userMgr.fetchUsers(activeTab, page, limit, debouncedSearch, {
              academicYear: selectedYear,
              term: selectedTerm,
              sectionId: selectedSectionId ? Number(selectedSectionId) : undefined
            }))}
            onDetail={handleViewDetail}
            onRefresh={() => userMgr.fetchUsers(activeTab, page, limit, debouncedSearch, {
              academicYear: selectedYear,
              term: selectedTerm,
              sectionId: selectedSectionId ? Number(selectedSectionId) : undefined
            })}
          />
        )}
      </div>

      {/* 4. Pagination */}
      <div className="mt-6">
        <Pagination
          meta={paginationMeta}       // ส่ง object ที่แปลงแล้ว
          onPageChange={setPage}      // เปลี่ยนจาก setPage เป็น onPageChange
        />
      </div>

      {/* Modals */}
      <UserFormModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        role={activeTab === 'section' ? 'student' : activeTab}
        initialData={selectedUser}
        isSubmitting={userMgr.isSaving}
        onSubmit={(formData) =>
          userMgr.saveUser(
            formData,
            activeTab as 'student' | 'instructor',
            !!selectedUser,
            selectedUser?.user_uuid,
            () => {
              setIsUserModalOpen(false);
              userMgr.fetchUsers(activeTab as any, page, limit, debouncedSearch, {
                academicYear: selectedYear,
                term: selectedTerm,
                sectionId: selectedSectionId ? Number(selectedSectionId) : undefined
              });
            }
          )
        }
      />

      <SectionFormModal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        initialData={selectedSection}
        isSubmitting={sectionMgr.isSaving}
        onSubmit={(formData) =>
          sectionMgr.saveSection(
            formData,
            selectedSection?.section_id,
            () => { setIsSectionModalOpen(false); sectionMgr.fetchSections(page, limit, debouncedSearch); }
          )
        }
      />
    </div>
  );
};