// src/pages/instructor/MyAdvisedGroupsPage.tsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    FiAward, FiBookOpen, FiGrid, FiSearch, FiFilter,
    FiChevronLeft, FiChevronRight, FiSlash
} from 'react-icons/fi';
import { getMyAdvisedGroups } from '../../services/instructor.service';
import { AdvisedGroupResponse } from '../../types/group.types';
import { AdvisedGroupCard } from '../../components/features/instructor/advised-groups/AdvisedGroupCard';
import { AdvisedGroupDetail } from '../../components/features/instructor/advised-groups/AdvisedGroupDetail';

export const MyAdvisedGroupsPage = () => {
    const location = useLocation();
    const [groups, setGroups] = useState<AdvisedGroupResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGroup, setSelectedGroup] = useState<AdvisedGroupResponse | null>(null);

    // State สำหรับ Search, Filter, Pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<'all' | 'main' | 'co'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // แสดง 6 การ์ดต่อหน้า

    useEffect(() => {
        fetchGroups();
    }, []);

    // เมื่อมีการค้นหา หรือเปลี่ยน Filter ให้กลับไปหน้า 1 เสมอ
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterRole]);

    const fetchGroups = async () => {
        try {
            const data = await getMyAdvisedGroups();
            setGroups(data);

            // Logic รับค่าจากการ Redirect หน้า Profile (เลือกกลุ่มอัตโนมัติ)
            const stateGroupId = location.state?.selectedGroupId;
            if (stateGroupId) {
                const targetGroup = data.find(g => g.groupId === stateGroupId);
                if (targetGroup) {
                    setSelectedGroup(targetGroup);
                    setTimeout(() => {
                        document.getElementById('detail-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                }
            }
        } catch (error) {
            console.error("Failed to fetch advised groups", error);
        } finally {
            setLoading(false);
        }
    };

    // Logic การกรองข้อมูล (Search & Filter)
    const filteredGroups = groups.filter(group => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            (group.thesisName || '').toLowerCase().includes(term) ||
            (group.thesisCode || '').toLowerCase().includes(term);

        const matchesRole =
            filterRole === 'all' ? true :
                filterRole === 'main' ? group.advisorRole === 'main' :
                    group.advisorRole !== 'main'; // co-advisor

        return matchesSearch && matchesRole;
    });

    // Logic การแบ่งหน้า (Pagination)
    const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
    const paginatedGroups = filteredGroups.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) return (
        <div className="max-w-6xl mx-auto p-8 text-center animate-pulse">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-4 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 min-h-screen transition-colors">

            {/* Page Header */}
            <div className="flex items-center gap-4 animate-enter-down">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400 shadow-sm shrink-0">
                    <FiAward size={32} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white leading-tight">
                        กลุ่มโครงงานที่ปรึกษา
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        จัดการและตรวจสอบสถานะโครงงานที่คุณดูแล ({groups.length} กลุ่ม)
                    </p>
                </div>
            </div>

            {groups.length === 0 ? (
                // Empty State: กรณีไม่มีข้อมูลเลยตั้งแต่ต้น
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 transition-colors">
                    <div className="bg-gray-50 dark:bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiBookOpen size={32} className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">ยังไม่มีข้อมูลกลุ่มที่ปรึกษา</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-2">
                        คุณยังไม่ได้ถูกมอบหมายให้เป็นที่ปรึกษาของกลุ่มโครงงานใดๆ ในขณะนี้
                    </p>
                </div>
            ) : (
                <>
                    {/* Section: Search & Filter Controls */}
                    <section className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between animate-enter-up transition-colors"
                        style={{ animationDelay: '100ms' }}>
                        {/* Search Input */}
                        <div className="relative w-full md:w-1/2 lg:w-1/3">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="ค้นหาชื่อโครงงาน หรือ รหัส..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                            {[
                                { id: 'all', label: 'ทั้งหมด' },
                                { id: 'main', label: 'ที่ปรึกษาหลัก' },
                                { id: 'co', label: 'ที่ปรึกษาร่วม' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setFilterRole(tab.id as any)}
                                    className={`px-4 py-2 text-sm rounded-lg whitespace-nowrap transition-colors border ${filterRole === tab.id
                                        ? 'bg-blue-600 dark:bg-blue-600 text-white border-blue-600 dark:border-blue-600 shadow-sm'
                                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Section: Group Selection Grid */}
                    <section
                        className="animate-enter-up"
                        style={{ animationDelay: '200ms' }}
                    >
                        <div className="flex items-center gap-2 mb-4 text-gray-700 dark:text-gray-300 font-semibold">
                            <FiGrid /> เลือกกลุ่มโครงงาน ({filteredGroups.length})
                        </div>

                        {paginatedGroups.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {paginatedGroups.map((item, index) => (
                                    <AdvisedGroupCard
                                        key={index}
                                        data={item}
                                        isSelected={selectedGroup?.groupId === item.groupId}
                                        onClick={() => setSelectedGroup(item)}
                                    />
                                ))}
                            </div>
                        ) : (
                            // Empty State: กรณีค้นหาไม่เจอ
                            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 transition-colors">
                                <div className="bg-white dark:bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                    <FiSlash className="text-gray-400 dark:text-gray-500" size={20} />
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">ไม่พบข้อมูลตามเงื่อนไขที่ค้นหา</p>
                                <button
                                    onClick={() => { setSearchTerm(''); setFilterRole('all'); }}
                                    className="text-blue-600 dark:text-blue-400 text-sm mt-2 hover:underline"
                                >
                                    ล้างการค้นหา
                                </button>
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-8">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm disabled:opacity-30 disabled:hover:shadow-none transition-all text-gray-600 dark:text-gray-400"
                                >
                                    <FiChevronLeft size={20} />
                                </button>

                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                                    หน้า {currentPage} / {totalPages}
                                </span>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm disabled:opacity-30 disabled:hover:shadow-none transition-all text-gray-600 dark:text-gray-400"
                                >
                                    <FiChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </section>

                    {/* Section: Detailed View */}
                    <section id="detail-section" className="transition-all duration-500 ease-in-out">
                        {selectedGroup ? (
                            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                                <AdvisedGroupDetail data={selectedGroup} />
                            </div>
                        ) : (
                            filteredGroups.length > 0 && (
                                <div className="mt-8 p-12 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-500 transition-colors">
                                    <p>กรุณาเลือกกลุ่มโครงงานด้านบนเพื่อดูรายละเอียด</p>
                                </div>
                            )
                        )}
                    </section>
                </>
            )}
        </div>
    );
};