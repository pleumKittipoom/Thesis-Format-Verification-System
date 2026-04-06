import React, { useEffect, useState, useMemo } from 'react';
import { swal, toast } from '@/utils/swal';
import { FiPlus, FiSearch } from 'react-icons/fi';
import CreateInspectionForm from '@/components/features/admin/inspection/CreateInspectionForm';
import { inspectionService } from '@/services/inspection.service';
import { InspectionRound } from '@/types/inspection';
import { showApiErrorAlert } from '@/utils/error-handler';

// Import Component
import { FilterBar } from '@/components/features/admin/inspection/FilterBar';
import { InspectionTable } from '@/components/features/admin/inspection/InspectionTable';
import { Pagination } from '@/components/common/Pagination';

// Type Definitions
interface MetaData {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
}

interface FilterState {
    academicYear: string;
    term: string;
    roundNumber: string;
    courseType: string;
}

const InspectionManagePage = () => {
    const [showForm, setShowForm] = useState(false);
    const [inspections, setInspections] = useState<InspectionRound[]>([]);
    const [meta, setMeta] = useState<MetaData>({ total: 0, page: 1, lastPage: 1, limit: 10 });
    const [isFetching, setIsFetching] = useState(true);
    const [selectedItem, setSelectedItem] = useState<InspectionRound | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // State สำหรับ Filter
    const [filters, setFilters] = useState<FilterState>({
        academicYear: '',
        term: '',
        roundNumber: '',
        courseType: ''
    });

    const availableYears = useMemo(() => {
        const currentYear = new Date().getFullYear() + 543;
        const yearsSet = new Set<string>();
        for (let i = -2; i <= 2; i++) {
            yearsSet.add(String(currentYear + i));
        }
        inspections.forEach(item => {
            if (item.academicYear) yearsSet.add(item.academicYear);
        });
        return Array.from(yearsSet).sort((a, b) => Number(b) - Number(a));
    }, [inspections]);

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        fetchInspections(1, searchQuery, false, { ...filters, [key]: value });
    };

    const clearFilters = () => {
        const emptyFilters = { academicYear: '', term: '', roundNumber: '', courseType: '' };
        setFilters(emptyFilters);
        fetchInspections(1, searchQuery, false, emptyFilters);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchInspections(1, searchQuery, false, filters);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchInspections(meta.page, searchQuery, true, filters);
        }, 30000);
        return () => clearInterval(intervalId);
    }, [meta.page, searchQuery, filters]);

    const fetchInspections = async (page = 1, search = '', isBackground = false, currentFilters = filters) => {
        if (!isBackground) setIsFetching(true);
        try {
            const params = {
                page,
                limit: 10,
                search,
                ...currentFilters
            };
            const response = await inspectionService.getAll(params);
            setInspections(response.data);
            setMeta(response.meta);
        } catch (error) {
            console.error(error);
            if (!isBackground) {
                toast.fire({
                    icon: 'error',
                    title: 'โหลดข้อมูลไม่สำเร็จ'
                });
            }
        } finally {
            if (!isBackground) setIsFetching(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        fetchInspections(newPage, searchQuery, false, filters);
    };

    const handleToggleStatus = async (id: number) => {
        try {
            await inspectionService.toggleStatus(id);
            fetchInspections(meta.page, searchQuery, true, filters);
            toast.fire({
                icon: 'success',
                title: 'อัปเดตสถานะสำเร็จ'
            });
        } catch (error) {
            showApiErrorAlert(error, 'เปลี่ยนสถานะไม่สำเร็จ');
        }
    };

    const handleDelete = (id: number) => {
        swal.fire({
            title: 'ยืนยันการลบ?',
            text: "ข้อมูลจะถูกซ่อนจากระบบ",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ใช่, ลบเลย',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#ef4444',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await inspectionService.remove(id);
                    fetchInspections(meta.page, searchQuery, false, filters);
                    toast.fire({
                        icon: 'success',
                        title: 'ลบข้อมูลสำเร็จ'
                    });
                } catch (error: any) {
                    showApiErrorAlert(error, 'ลบข้อมูลไม่สำเร็จ');
                }
            }
        });
    };

    const handleDetail = (item: InspectionRound) => {
        const isOpen = item.status === 'OPEN';

        const formatDate = (dateStr: string) => {
            return new Date(dateStr).toLocaleString('th-TH', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit',
            }) + ' น.';
        };

        let courseTypeBadge = '';
        let courseTypeText = '';

        switch (item.courseType) {
            case 'PRE_PROJECT':
                courseTypeBadge = 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800';
                courseTypeText = 'Pre-Project';
                break;
            case 'PROJECT':
                courseTypeBadge = 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800';
                courseTypeText = 'Project';
                break;
            default:
                courseTypeBadge = 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800';
                courseTypeText = 'ทั้งหมด (All Types)';
        }

        swal.fire({
            html: `
                <div class="text-left font-sans text-gray-900 dark:text-gray-100">
                   <div class="flex items-start gap-4 mb-5 border-b border-gray-100 dark:border-gray-700 pb-4">
                        <div class="p-3 ${isOpen ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'} rounded-2xl shadow-sm mt-1">
                             ${isOpen
                    ? '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" width="28" height="28"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
                    : '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" width="28" height="28"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
                }
                        </div>
                        <div class="flex-1">
                             <div class="flex flex-wrap items-center gap-2 mb-1">
                                <span class="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-bold border border-blue-100 dark:border-blue-800">
                                    ปี ${item.academicYear} / เทอม ${item.term}
                                </span>
                                <span class="px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 text-xs font-bold border border-gray-200 dark:border-gray-600">
                                    รอบที่ ${item.roundNumber}
                                </span>
                             </div>
                             <h3 class="text-xl font-bold text-gray-800 dark:text-white leading-snug">${item.title}</h3>
                             <p class="text-sm ${isOpen ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} font-medium mt-1 flex items-center gap-1">
                                ${isOpen ? '● กำลังเปิดรับเอกสาร' : '● ปิดรับเอกสารแล้ว'}
                             </p>
                        </div>
                    </div>
                    
                    <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 mb-5 relative">
                        <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            ${item.description || '<span class="text-gray-400 dark:text-gray-500 italic">ไม่มีรายละเอียดเพิ่มเติม</span>'}
                        </p>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div class="p-3 border border-gray-100 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex flex-col justify-center">
                            <span class="text-xs text-gray-400 dark:text-gray-500 mb-1">ประเภท</span>
                            <span class="font-bold px-2 py-1 rounded-md text-xs w-fit border ${courseTypeBadge}">
                                ${courseTypeText}
                            </span>
                        </div>
                        <div class="p-3 border border-gray-100 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex flex-col justify-center">
                            <span class="text-xs text-gray-400 dark:text-gray-500 mb-1">ระยะเวลา</span>
                            <span class="font-semibold text-xs text-gray-700 dark:text-gray-200 block mt-0.5">
                                เริ่มต้น: ${formatDate(item.startDate)}
                            </span>
                            <span class="font-semibold text-xs text-gray-700 dark:text-gray-200 block mt-0.5">
                                สิ้นสุด: ${formatDate(item.endDate)}
                            </span>
                        </div>
                    </div>
                </div>
            `,
            showConfirmButton: false,
            showCloseButton: true,
            width: '500px',
            padding: '1.5rem',
        });
    };

    return (
        <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pt-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">จัดการรอบการส่งเอกสาร</h1>
                </div>
                {!showForm && (
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative group w-full md:w-72">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="ค้นหาหัวข้อ..."
                                className="pl-10 pr-4 py-2.5 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 dark:focus:border-blue-500 transition-all shadow-sm placeholder-gray-400 dark:placeholder-gray-500"
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => { setSelectedItem(null); setShowForm(true); }}
                            className="cursor-pointer flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700 hover:shadow-blue-300 dark:hover:bg-blue-500 transition-all font-medium whitespace-nowrap"
                        >
                            <FiPlus size={20} /> สร้างใหม่
                        </button>
                    </div>
                )}
            </div>

            {showForm ? (
                <div className="animate-in slide-in-from-right duration-300">
                    <CreateInspectionForm
                        initialData={selectedItem}
                        onSuccess={() => { setShowForm(false); fetchInspections(meta.page, searchQuery, false, filters); }}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <FilterBar
                        filters={filters}
                        onChange={handleFilterChange}
                        onClear={clearFilters}
                        availableYears={availableYears}
                    />

                    <InspectionTable
                        data={inspections}
                        onEdit={(item: InspectionRound) => { setSelectedItem(item); setShowForm(true); }}
                        onDelete={handleDelete}
                        onDetail={handleDetail}
                        onToggleStatus={handleToggleStatus}
                        isLoading={isFetching}
                    />
                    <Pagination meta={meta} onPageChange={handlePageChange} />
                </div>
            )}
        </div>
    );
};

export default InspectionManagePage;