import { useState, useRef, useEffect } from 'react';
import { FiMoreHorizontal, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

interface ActionMenuProps {
    onEdit: () => void;
    onDelete: () => void;
    onDetail: () => void;
}

export const ActionMenu = ({ onEdit, onDelete, onDetail }: ActionMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all active:scale-95"
            >
                <FiMoreHorizontal size={20} />
            </button>
            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 py-1 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <button onClick={() => { setIsOpen(false); onEdit(); }} className="cursor-pointer w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-3 font-medium transition-colors">
                        <FiEdit2 size={16} /> แก้ไขข้อมูล
                    </button>
                    <button onClick={() => { setIsOpen(false); onDelete(); }} className="cursor-pointer w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-3 font-medium transition-colors">
                        <FiTrash2 size={16} /> ลบข้อมูล
                    </button>
                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                    <button onClick={() => { setIsOpen(false); onDetail(); }} className="cursor-pointer w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 font-medium transition-colors">
                        <FiEye size={16} /> ดูรายละเอียด
                    </button>
                </div>
            )}
        </div>
    );
};