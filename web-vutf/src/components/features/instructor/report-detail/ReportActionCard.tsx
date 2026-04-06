// src/components/features/instructor/report-detail/ReportActionCard.tsx
import React, { useState } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiSave, FiLoader, FiCheck } from 'react-icons/fi';
import { ReviewStatus } from '@/types/report';

interface Props {
    currentStatus: ReviewStatus;
    onUpdateStatus: (status: ReviewStatus) => Promise<void>;
}

export const ReportActionCard: React.FC<Props> = ({ currentStatus, onUpdateStatus }) => {
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<ReviewStatus>(currentStatus);

    const handleSave = async () => {
        if (selected === currentStatus) return;
        setLoading(true);
        try {
            await onUpdateStatus(selected);
        } finally {
            setLoading(false);
        }
    };

    const options = [
        { 
            value: 'PASSED', 
            label: 'อนุมัติ (Passed)', 
            icon: FiCheckCircle, 
            color: 'text-emerald-600 dark:text-emerald-400', 
            bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
            borderColor: 'border-emerald-500',
            selectedBg: 'bg-emerald-50 dark:bg-emerald-900/10'
        },
        { 
            value: 'NEEDS_REVISION', 
            label: 'ต้องแก้ไข (Revision)', 
            icon: FiAlertTriangle, 
            color: 'text-orange-600 dark:text-orange-400', 
            bgColor: 'bg-orange-100 dark:bg-orange-900/30',
            borderColor: 'border-orange-500',
            selectedBg: 'bg-orange-50 dark:bg-orange-900/10'
        },
        { 
            value: 'NOT_PASSED', 
            label: 'ไม่อนุมัติ (Not Passed)', 
            icon: FiXCircle, 
            color: 'text-rose-600 dark:text-rose-400', 
            bgColor: 'bg-rose-100 dark:bg-rose-900/30',
            borderColor: 'border-rose-500',
            selectedBg: 'bg-rose-50 dark:bg-rose-900/10'
        },
    ];

    const isChanged = selected !== currentStatus;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-fit">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    ผลการพิจารณา
                </h3>
                {/* Status Label (Current) */}
                <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400">
                    ปัจจุบัน: {currentStatus}
                </span>
            </div>
            
            <div className="space-y-3">
                {options.map((opt) => {
                    const isSelected = selected === opt.value;
                    const Icon = opt.icon;

                    return (
                        <button
                            key={opt.value}
                            onClick={() => setSelected(opt.value as ReviewStatus)}
                            className={`
                                relative w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 group
                                ${isSelected 
                                    ? `${opt.borderColor} ${opt.selectedBg} shadow-sm` 
                                    : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                }
                            `}
                        >
                            <div className="flex items-center gap-4">
                                {/* Icon Container */}
                                <div className={`p-2.5 rounded-full ${isSelected ? 'bg-white dark:bg-gray-800 shadow-sm' : opt.bgColor} transition-colors`}>
                                    <Icon className={`text-xl ${opt.color}`} />
                                </div>
                                
                                <span className={`font-semibold text-sm ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-200'}`}>
                                    {opt.label}
                                </span>
                            </div>

                            {/* Radio Indicator */}
                            <div className={`
                                w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200
                                ${isSelected 
                                    ? `border-transparent ${opt.bgColor.replace('/30', '')} ${opt.color}` 
                                    : 'border-gray-300 dark:border-gray-600 group-hover:border-gray-400'
                                }
                            `}>
                                {isSelected && <div className={`w-2.5 h-2.5 rounded-full currentColor bg-current`} />}
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <button
                    onClick={handleSave}
                    disabled={loading || !isChanged}
                    className={`
                        w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-sm
                        ${isChanged && !loading
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 dark:shadow-none hover:-translate-y-0.5' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        }
                    `}
                >
                    {loading ? (
                        <>
                            <FiLoader className="animate-spin" size={18} />
                            <span>กำลังบันทึก...</span>
                        </>
                    ) : (
                        <>
                            <FiSave size={18} />
                            <span>บันทึกสถานะ</span>
                        </>
                    )}
                </button>
                
                {!isChanged && (
                    <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">
                        เลือกสถานะใหม่เพื่อบันทึก
                    </p>
                )}
            </div>
        </div>
    );
};