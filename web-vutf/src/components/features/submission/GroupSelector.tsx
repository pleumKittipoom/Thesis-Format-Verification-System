// src/components/features/submission/GroupSelector.tsx
// Dropdown สำหรับเลือกกลุ่มที่จะส่งไฟล์

import React from 'react';
import { FiChevronDown, FiUsers } from 'react-icons/fi';
import type { OwnerGroup } from '@/hooks/useOwnerGroups';

interface GroupSelectorProps {
    /** รายการกลุ่ม */
    groups: OwnerGroup[];
    /** กลุ่มที่เลือก */
    selectedGroupId: string | null;
    /** Callback เมื่อเลือกกลุ่ม */
    onSelect: (groupId: string) => void;
    /** Loading state */
    loading?: boolean;
    /** แสดงแบบ compact */
    compact?: boolean;
}

/**
 * GroupSelector - Dropdown เลือกกลุ่มสำหรับ Owner
 * * Single Responsibility: จัดการ UI สำหรับเลือกกลุ่ม
 * * Features:
 * - แสดงชื่อ thesis + code
 * - Support single/multiple groups
 * - Loading state
 */
export const GroupSelector: React.FC<GroupSelectorProps> = ({
    groups,
    selectedGroupId,
    onSelect,
    loading = false,
    compact = false,
}) => {
    // ถ้ามีกลุ่มเดียว ไม่ต้องแสดง selector
    if (groups.length === 1) {
        return (
            <div className={`
        flex items-center gap-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-900/50 rounded-xl
        ${compact ? 'px-3 py-2' : 'px-4 py-3'}
      `}>
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiUsers className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`font-medium text-gray-900 dark:text-white truncate ${compact ? 'text-sm' : ''}`}>
                        {groups[0].thesisNameTh}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{groups[0].thesisCode}</p>
                </div>
            </div>
        );
    }

    // ถ้ามีหลายกลุ่ม แสดง dropdown
    const selectedGroup = groups.find(g => g.groupId === selectedGroupId);

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                เลือกกลุ่มที่จะส่งไฟล์
            </label>
            <div className="relative">
                <select
                    value={selectedGroupId || ''}
                    onChange={(e) => onSelect(e.target.value)}
                    disabled={loading}
                    className={`
            w-full appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl
            text-gray-900 dark:text-white font-medium cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${compact ? 'px-3 py-2.5 pr-10 text-sm' : 'px-4 py-3 pr-12'}
          `}
                >
                    <option value="" disabled>-- เลือกกลุ่ม --</option>
                    {groups.map((group) => (
                        <option key={group.groupId} value={group.groupId}>
                            {group.thesisNameTh} ({group.thesisCode})
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
            </div>

            {/* Selected group info */}
            {selectedGroup && (
                <div className="mt-3 flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-900/50 rounded-xl px-4 py-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FiUsers className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate text-sm">
                            {selectedGroup.thesisNameTh}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{selectedGroup.thesisNameEn}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupSelector;