import { useState, useRef, useEffect } from 'react';
import { FiSearch, FiFilter, FiChevronDown, FiCheck, FiCalendar, FiX } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { th } from 'date-fns/locale';
import { format } from 'date-fns';

export const AuditLogFilters = ({
    searchTerm, setSearchTerm,
    actionFilter, setActionFilter,
    startDate, setStartDate,
    endDate, setEndDate,
    availableActions = []
}: any) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // ปิด Dropdown เมื่อคลิกที่อื่น
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedActions = actionFilter ? actionFilter.split(',') : [];

    const toggleAction = (e: React.MouseEvent, action: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (selectedActions.includes(action)) {
            const newSelected = selectedActions.filter((a: string) => a !== action);
            setActionFilter(newSelected.join(','));
        } else {
            setActionFilter([...selectedActions, action].join(','));
        }
    };

    const handleDateChange = (date: Date | null, type: 'start' | 'end') => {
        if (!date) {
            type === 'start' ? setStartDate('') : setEndDate('');
            return;
        }
        const formattedDate = format(date, 'yyyy-MM-dd');
        type === 'start' ? setStartDate(formattedDate) : setEndDate(formattedDate);
    };

    const clearActions = () => setActionFilter('');

    const displayActions = availableActions.length > 0
        ? availableActions
        : ['LOGIN', 'LOGIN_FAILED', 'REGISTER', 'DOWNLOAD_ZIP', 'MANUAL_UNLOCK'];

    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 flex flex-col xl:flex-row gap-4">

            {/* 1. ช่องค้นหา */}
            <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="ค้นหาชื่อ, อีเมล, คำอธิบาย, IP..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                {/* 2. Dropdown สำหรับเลือกหลาย Action */}
                <div className="relative flex-shrink-0" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full sm:w-auto min-w-[200px] flex items-center justify-between gap-3 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm text-left whitespace-nowrap"
                    >
                        <div className="flex items-center gap-2">
                            <FiFilter className={selectedActions.length > 0 ? "text-blue-500" : "text-gray-400"} />
                            <span>
                                {selectedActions.length === 0
                                    ? "ทุกประเภทการกระทำ (All Actions)"
                                    : `เลือกแล้ว (${selectedActions.length}) ประเภท`}
                            </span>
                        </div>
                        <FiChevronDown className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute z-50 left-0 sm:right-0 sm:left-auto mt-2 min-w-full w-max max-w-[90vw] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden flex flex-col">
                            <div className="max-h-60 overflow-y-auto p-2 custom-scrollbar">
                                {displayActions.map((action: string) => {
                                    const isSelected = selectedActions.includes(action);
                                    return (
                                        <div
                                            key={action}
                                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors whitespace-nowrap"
                                            onClick={(e) => toggleAction(e, action)}
                                        >
                                            <div className={`w-5 h-5 flex-shrink-0 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900'}`}>
                                                {isSelected && <FiCheck size={14} strokeWidth={3} />}
                                            </div>
                                            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium pr-4">
                                                {action}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            {selectedActions.length > 0 && (
                                <div className="p-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                    <button
                                        onClick={clearActions}
                                        className="w-full text-xs font-semibold text-red-500 hover:text-red-600 py-1.5 cursor-pointer"
                                    >
                                        ล้างการเลือกทั้งหมด
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 3. ตัวกรองวันที่ */}
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-blue-500/50 transition-all group">
                    <FiCalendar className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />

                    <div className="flex items-center text-sm font-medium">
                        <DatePicker
                            selected={startDate ? new Date(startDate) : null}
                            onChange={(date: Date | null) => handleDateChange(date, 'start')}
                            selectsStart
                            startDate={startDate ? new Date(startDate) : undefined}
                            endDate={endDate ? new Date(endDate) : undefined}
                            placeholderText="วันที่เริ่ม"
                            locale={th}
                            dateFormat="dd/MM/yyyy"
                            className="w-[90px] bg-transparent text-gray-800 dark:text-gray-200 outline-none placeholder:text-gray-400 placeholder:font-normal"
                        />
                        <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
                        <DatePicker
                            selected={endDate ? new Date(endDate) : null}
                            onChange={(date: Date | null) => handleDateChange(date, 'end')}
                            selectsEnd
                            startDate={startDate ? new Date(startDate) : undefined}
                            endDate={endDate ? new Date(endDate) : undefined}
                            minDate={startDate ? new Date(startDate) : undefined}
                            placeholderText="วันที่สิ้นสุด"
                            locale={th}
                            dateFormat="dd/MM/yyyy"
                            className="w-[90px] bg-transparent text-gray-800 dark:text-gray-200 outline-none placeholder:text-gray-400 placeholder:font-normal"
                        />
                    </div>

                    {(startDate || endDate) && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setStartDate('');
                                setEndDate('');
                            }}
                            className="ml-1 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-gray-400 hover:text-red-500 transition-all"
                            title="ล้างวันที่"
                        >
                            <FiX size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};