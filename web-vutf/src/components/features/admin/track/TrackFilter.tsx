// src/components/features/admin/track/TrackFilter.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  FiSearch, FiRefreshCw, FiCalendar, FiClock, FiLayers, FiChevronDown,
  FiFlag, FiFilter, FiList, FiCheckCircle, FiInfo, FiDownload,
  FiGrid, FiFileText, FiMenu
} from 'react-icons/fi';
import { TrackThesisFilterParams, ActiveRoundOption } from '@/types/track-thesis';
import { trackThesisService } from '@/services/track-thesis.service';
import { toast } from 'react-hot-toast';
import { exportFileService } from '@/services/export-file.service';

interface TrackFilterProps {
  filters: TrackThesisFilterParams;
  setFilters: React.Dispatch<React.SetStateAction<TrackThesisFilterParams>>;
  activeTab: 'unsubmitted' | 'submitted' | 'reports';
}

export const TrackFilter = ({ filters, setFilters, activeTab }: TrackFilterProps) => {
  const [activeRounds, setActiveRounds] = useState<ActiveRoundOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [mode, setMode] = useState<'ACTIVE' | 'CUSTOM'>('ACTIVE');

  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        const response = await trackThesisService.getActiveRoundOptions();
        let options: ActiveRoundOption[] = [];
        if (Array.isArray(response)) {
          options = response;
        } else if (response && Array.isArray((response as any).data)) {
          options = (response as any).data;
        }
        setActiveRounds(options);
        if (options.length > 0 && !filters.inspectionId && !filters.roundNumber) {
          setFilters(prev => ({ ...prev, inspectionId: options[0].id, sortOrder: prev.sortOrder || 'DESC' }));
        } else if (options.length === 0) {
          setMode('CUSTOM');
        }
      } catch (error) {
        console.error("Failed to load active rounds", error);
        setActiveRounds([]);
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleModeSwitch = (newMode: 'ACTIVE' | 'CUSTOM') => {
    setMode(newMode);
    if (newMode === 'ACTIVE') {
      const firstActiveId = activeRounds.length > 0 ? activeRounds[0].id : undefined;
      setFilters(prev => ({
        ...prev,
        inspectionId: firstActiveId,
        academicYear: undefined,
        term: undefined,
        roundNumber: undefined
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        inspectionId: undefined,
        academicYear: String(new Date().getFullYear() + 543),
        term: '1',
        roundNumber: 1
      }));
    }
  };

  const handleActiveSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, inspectionId: Number(e.target.value) }));
  };

  const handleReset = () => {
    setFilters({
      search: '',
      courseType: 'ALL',
      page: 1,
      inspectionId: activeRounds.length > 0 ? activeRounds[0].id : undefined,
      verificationStatus: undefined,
      submissionStatus: undefined,
      sortOrder: 'DESC'
    });
    setMode(activeRounds.length > 0 ? 'ACTIVE' : 'CUSTOM');
  };

  const FilterSelect = ({ icon: Icon, label, ...props }: any) => (
    <div className={`flex flex-col gap-1 ${props.width || 'w-full md:w-auto'}`}>
      {label && <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1">{label}</span>}
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 z-10 transition-colors">
          <Icon size={16} />
        </div>
        <select
          {...props}
          className="w-full pl-10 pr-8 py-2.5 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {props.children}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <FiChevronDown size={14} />
        </div>
      </div>
    </div>
  );

  // handleExport รองรับ type
  const handleExport = async (type: 'excel' | 'pdf') => {
    setIsExportMenuOpen(false); // ปิดเมนู
    const toastId = toast.loading(`กำลังจัดทำไฟล์ ${type === 'excel' ? 'Excel' : 'PDF'}...`);

    try {
      let blob: Blob;
      let filename: string;
      const timestamp = new Date().getTime();

      let contextStr = '';

      if (mode === 'ACTIVE') {
        const selectedRound = activeRounds.find(r => r.id === filters.inspectionId);
        if (selectedRound) {
          // รองรับ format เช่น "ปี 2568/2 รอบที่ 3: ..." หรือ "2568/2 รอบที่ 3"
          const match = selectedRound.label.match(/(\d{4})\/(\d)\s+รอบที่\s+(\d+)/);

          if (match) {
            const [_, year, term, round] = match;
            contextStr = `${year}_${term}_Round_${round}`;
          } else {
            // Fallback ถ้า format ไม่ตรงจริงๆ ให้ใช้ชื่อเดิมแต่ลบอักขระพิเศษ
            contextStr = selectedRound.label.replace(/[^a-zA-Z0-9]/g, '_');
          }
        }
      }

      const baseName = `Thesis_Master_Report_${contextStr}_${timestamp}`;

      if (type === 'excel') {
        blob = await exportFileService.exportMasterExcel(filters);
        filename = `${baseName}.xlsx`;
      } else {
        blob = await exportFileService.exportMasterPdf(filters);
        filename = `${baseName}.pdf`;
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`ดาวน์โหลด ${type === 'excel' ? 'Excel' : 'PDF'} สำเร็จ`, { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'การส่งออกข้อมูลขัดข้อง', { id: toastId });
    }
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700/50 transition-colors duration-200">

      {/* TOP BAR: Search & Mode Switcher */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-700/50 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">

        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <FiSearch size={18} />
          </div>
          <input
            type="text"
            name="search"
            placeholder="ค้นหาชื่อ, รหัสนักศึกษา, ชื่อโปรเจกต์..."
            value={filters.search || ''}
            onChange={handleChange}
            className="w-full pl-11 pr-4 h-[42px] bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900/80 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm shadow-sm"
          />
        </div>

        {/* Action Group */}
        <div className="flex items-center gap-3 w-full md:w-auto z-20">

          {/* Export Button */}
          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className={`
                flex items-center justify-center gap-2 px-4 h-[42px]
                bg-white dark:bg-slate-800 
                border border-slate-200 dark:border-slate-600
                text-slate-700 dark:text-slate-200 
                rounded-xl text-sm font-medium 
                hover:bg-slate-50 dark:hover:bg-slate-700
                hover:border-slate-300 dark:hover:border-slate-500
                transition-all shadow-sm active:scale-95
                ${isExportMenuOpen ? 'ring-2 ring-emerald-500/20 border-emerald-500 dark:border-emerald-500' : ''}
              `}
            >
              <FiDownload size={16} className={isExportMenuOpen ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'} />
              <span className="hidden sm:inline">Export Report</span>
              <FiChevronDown size={16} className={`transition-transform duration-200 text-slate-400 ${isExportMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-700/30 border-b border-slate-100 dark:border-slate-700/50">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">เลือกรูปแบบไฟล์</span>
                </div>
                <button
                  onClick={() => handleExport('excel')}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 flex items-start gap-3 transition-colors border-b border-slate-100 dark:border-slate-700/50 group"
                >
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg group-hover:scale-110 transition-transform">
                    <FiGrid size={18} />
                  </div>
                  <div>
                    <span className="font-semibold block group-hover:text-emerald-700 dark:group-hover:text-emerald-300">Excel (.xlsx)</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">สำหรับนำไปแก้ไขข้อมูลต่อ</span>
                  </div>
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-rose-50/50 dark:hover:bg-rose-900/20 flex items-start gap-3 transition-colors group"
                >
                  <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg group-hover:scale-110 transition-transform">
                    <FiFileText size={18} />
                  </div>
                  <div>
                    <span className="font-semibold block group-hover:text-rose-700 dark:group-hover:text-rose-300">PDF Document</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">สำหรับพิมพ์หรือส่งรายงาน</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Mode Segmented Control */}
          <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg border border-slate-200 dark:border-slate-700/50 flex-1 md:flex-none">
            <button
              onClick={() => handleModeSwitch('ACTIVE')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'ACTIVE'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800'
                }`}
            >
              <FiFlag size={14} />
              <span>Active Rounds</span>
            </button>
            <button
              onClick={() => handleModeSwitch('CUSTOM')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'CUSTOM'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800'
                }`}
            >
              <FiFilter size={14} />
              <span>Custom Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR: Specific Filters */}
      <div className="p-4 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 lg:flex gap-3">
          {mode === 'ACTIVE' && (
            <div className="w-full lg:w-96">
              <label className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1 mb-1 block">เลือกสอบรอบที่เปิดอยู่</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400 z-10">
                  <FiFlag size={16} />
                </div>
                <select
                  value={filters.inspectionId || ''}
                  onChange={handleActiveSelectChange}
                  className="w-full pl-10 pr-8 py-2.5 bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-100 border border-blue-200 dark:border-blue-500/30 hover:border-blue-300 dark:hover:border-blue-500/50 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50 text-sm appearance-none cursor-pointer font-medium transition-all"
                >
                  {Array.isArray(activeRounds) && activeRounds.map(round => (
                    <option key={round.id} value={round.id} className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                      {round.label}
                    </option>
                  ))}
                  {(!activeRounds || activeRounds.length === 0) && (
                    <option disabled className="bg-white dark:bg-slate-800 text-slate-400">
                      {loadingOptions ? 'กำลังโหลด...' : 'ไม่มีการสอบที่เปิดอยู่'}
                    </option>
                  )}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400 pointer-events-none">
                  <FiChevronDown size={14} />
                </div>
              </div>
            </div>
          )}
          {mode === 'CUSTOM' && (
            <>
              <FilterSelect icon={FiCalendar} name="academicYear" value={filters.academicYear} onChange={handleChange} width="w-full sm:w-32" label="ปีการศึกษา">
                <option value="" className="dark:bg-slate-800">เลือกปี</option>
                {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() + 543 - i).map(y => (
                  <option key={y} value={y} className="dark:bg-slate-800">{y}</option>
                ))}
              </FilterSelect>
              <FilterSelect icon={FiClock} name="term" value={filters.term} onChange={handleChange} width="w-full sm:w-28" label="เทอม">
                <option value="" className="dark:bg-slate-800">เลือกเทอม</option>
                <option value="1" className="dark:bg-slate-800">1</option>
                <option value="2" className="dark:bg-slate-800">2</option>
                <option value="3" className="dark:bg-slate-800">3</option>
              </FilterSelect>
              <FilterSelect icon={FiLayers} name="roundNumber" value={filters.roundNumber} onChange={handleChange} width="w-full sm:w-28" label="รอบที่">
                <option value="" className="dark:bg-slate-800">เลือกรอบ</option>
                {[1, 2, 3, 4, 5].map(r => <option key={r} value={r} className="dark:bg-slate-800">{r}</option>)}
              </FilterSelect>
            </>
          )}
          <FilterSelect icon={FiList} name="courseType" value={filters.courseType} onChange={handleChange} width="w-full sm:w-40" label="ประเภทวิชา">
            <option value="ALL" className="dark:bg-slate-800">ทั้งหมด</option>
            <option value="PROJECT" className="dark:bg-slate-800">Project</option>
            <option value="PRE_PROJECT" className="dark:bg-slate-800">Pre-Project</option>
          </FilterSelect>

          {activeTab === 'reports' && (
            <FilterSelect icon={FiCheckCircle} name="verificationStatus" value={filters.verificationStatus || ''} onChange={handleChange} width="w-full sm:w-48" label="สถานะการตรวจ (System)">
              <option value="" className="dark:bg-slate-800">ทั้งหมด</option>
              <option value="PASS" className="dark:bg-slate-800">PASS</option>
              <option value="FAIL" className="dark:bg-slate-800">FAIL</option>
            </FilterSelect>
          )}
          {activeTab === 'submitted' && (
            <FilterSelect icon={FiInfo} name="submissionStatus" value={filters.submissionStatus || ''} onChange={handleChange} width="w-full sm:w-48" label="สถานะงาน (Submission)">
              <option value="" className="dark:bg-slate-800">ทั้งหมด</option>
              <option value="PENDING" className="dark:bg-slate-800">รอดำเนินการ</option>
              <option value="IN_PROGRESS" className="dark:bg-slate-800">กำลังตรวจ</option>
              <option value="COMPLETED" className="dark:bg-slate-800">ตรวจเสร็จแล้ว</option>
            </FilterSelect>
          )}
          <FilterSelect icon={FiMenu} name="sortOrder" value={filters.sortOrder || 'DESC'} onChange={handleChange} width="w-full sm:w-36" label="เรียงตาม">
            <option value="DESC" className="dark:bg-slate-800">อัปเดตล่าสุด</option>
            <option value="ASC" className="dark:bg-slate-800">เก่าสุด</option>
          </FilterSelect>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="p-2.5 h-[42px] bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-500 border border-slate-200 dark:border-slate-700 hover:border-rose-500/50 rounded-lg transition-all shrink-0 flex items-center justify-center group shadow-sm"
          title="ล้างตัวกรอง"
        >
          <FiRefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>
    </div>
  );
};