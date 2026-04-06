// src/components/features/inspection/RoundSelector.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLayers, FiChevronDown, FiCalendar, FiCheck } from 'react-icons/fi';
import { InspectionRound } from '@/types/inspection';

interface RoundSelectorProps {
    availableRounds: InspectionRound[];
    activeRound: InspectionRound | null;
    onSelect: (round: InspectionRound) => void;
}

export const RoundSelector: React.FC<RoundSelectorProps> = ({ 
    availableRounds, 
    activeRound, 
    onSelect 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // ปิด Dropdown เมื่อคลิกพื้นที่อื่นนอก Dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('th-TH', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors"
        >
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <FiLayers className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        พบรอบส่งงานที่เปิดรับ {availableRounds.length} รายการ
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        กรุณาเลือกรอบที่คุณต้องการส่งไฟล์
                    </p>
                </div>
            </div>

            {/* Custom Dropdown */}
            <div className="relative" ref={dropdownRef}>
                {/* Trigger Button */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
                        w-full flex items-center justify-between
                        bg-gray-50 dark:bg-gray-900/50 
                        border ${isOpen ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-gray-200 dark:border-gray-700'} 
                        text-gray-900 dark:text-white 
                        rounded-2xl px-5 py-4 
                        transition-all cursor-pointer outline-none
                    `}
                >
                    <div className="flex flex-col items-start gap-1">
                        <span className="font-semibold text-sm">
                            {activeRound ? `รอบที่ ${activeRound.roundNumber} - ${activeRound.title}` : 'เลือกรอบส่งงาน'}
                        </span>
                        {activeRound && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                <FiCalendar className="w-3.5 h-3.5" />
                                ครบกำหนด {formatDate(activeRound.endDate)}
                            </span>
                        )}
                    </div>
                    <div className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`}>
                        <FiChevronDown className="w-5 h-5" />
                    </div>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-50 top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden"
                        >
                            <div className="max-h-[280px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                                {availableRounds.map(r => {
                                    const isSelected = activeRound?.inspectionId === r.inspectionId;
                                    return (
                                        <button
                                            key={r.inspectionId}
                                            type="button"
                                            onClick={() => {
                                                onSelect(r);
                                                setIsOpen(false);
                                            }}
                                            className={`
                                                w-full text-left px-4 py-3 rounded-xl flex items-center justify-between mb-1 last:mb-0 transition-colors
                                                ${isSelected 
                                                    ? 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50' 
                                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent'
                                                }
                                            `}
                                        >
                                            <div className="flex flex-col gap-1">
                                                <span className={`text-sm font-semibold ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-200'}`}>
                                                    รอบที่ {r.roundNumber} — {r.title}
                                                </span>
                                                <span className={`text-xs flex items-center gap-1.5 ${isSelected ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                    <FiCalendar className="w-3.5 h-3.5" />
                                                    ครบกำหนด {formatDate(r.endDate)}
                                                </span>
                                            </div>
                                            
                                            {isSelected && (
                                                <FiCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};