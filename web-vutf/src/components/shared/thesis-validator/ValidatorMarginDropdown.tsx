// src/components/shared/thesis-validator/ValidatorMarginDropdown.tsx
import React, { useState, useRef, useEffect } from 'react';
import { FiCheck } from 'react-icons/fi';
import { FaRuler } from 'react-icons/fa6';

export const PAGE_MARGINS = {
  left: 38.1,
  right: 25.4,
  top: 38.1,
  bottom: 25.4
};

export const INDENT_GUIDELINES = [
  { id: 'indent-10', label: '10 mm (Para, Heading Text)', mm: 10 },
  { id: 'indent-15', label: '15 mm (List Item Num)', mm: 15 },
  { id: 'indent-20', label: '20 mm (Sub Heading 1)', mm: 20 },
  { id: 'indent-22.5', label: '22.5 mm (Sub Heading 2)', mm: 22.5 },
  { id: 'indent-24.5', label: '24.5 mm (Sub Heading 3)', mm: 24.5 },
  { id: 'indent-25', label: '25 mm (Bullet, List Text 1)', mm: 25 },
  { id: 'indent-27.6', label: '27.6 mm (List Text 2)', mm: 27.6 },
  { id: 'indent-30', label: '30 mm (Bullet Text, Dash)', mm: 30 },
  { id: 'indent-35', label: '35 mm (Dash Text)', mm: 35 },
];

interface Props {
  activeMargins: string[];
  setActiveMargins: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ValidatorMarginDropdown: React.FC<Props> = ({ activeMargins, setActiveMargins }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMargin = (id: string) => {
    setActiveMargins(prev => 
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-colors flex items-center gap-2 border
          ${isOpen || activeMargins.length > 0 
            ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' 
            : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100 border-transparent dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-gray-700'
          }`}
        title="แสดงระยะการเยื้อง (Margins & Indents)"
      >
        <FaRuler size={18} />
        {activeMargins.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
            {activeMargins.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 md:left-auto md:right-0 mt-2 w-56 md:w-64 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl shadow-lg z-[70] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Header & Clear All Button */}
          <div className="flex justify-between items-center px-3 py-2.5 md:py-2 bg-slate-100 dark:bg-gray-900 border-b border-slate-200 dark:border-gray-700">
            <span className="text-xs font-bold text-slate-700 dark:text-gray-300">เส้นกะระยะ</span>
            {activeMargins.length > 0 && (
              <button 
                onClick={() => setActiveMargins([])}
                className="text-[10px] text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/30 px-2 py-1 md:py-0.5 rounded transition-colors font-medium"
              >
                ล้างทั้งหมด
              </button>
            )}
          </div>

          {/* Section: Page Margins */}
          <div className="px-3 py-1.5 bg-slate-50 dark:bg-gray-800/50">
            <h3 className="text-[10px] uppercase font-bold text-slate-400 dark:text-gray-500">การตั้งค่ากระดาษ</h3>
          </div>
          <div className="p-1 border-b border-slate-100 dark:border-gray-700">
            <button
              onClick={() => toggleMargin('page-margins')}
              className={`flex items-center justify-between px-3 py-2.5 md:py-2 text-xs rounded-md transition-colors w-full text-left font-medium
                ${activeMargins.includes('page-margins')
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' 
                  : 'text-slate-600 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
            >
              <span>ขอบกระดาษ (Margins)</span>
              {activeMargins.includes('page-margins') && <FiCheck size={14} />}
            </button>
          </div>

          {/* Section: Indents */}
          <div className="px-3 py-1.5 bg-slate-50 dark:bg-gray-800/50">
            <h3 className="text-[10px] uppercase font-bold text-slate-400 dark:text-gray-500">ระยะเยื้อง (Indents)</h3>
          </div>
          <div className="p-1 flex flex-col max-h-[40vh] md:max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-gray-700">
            {INDENT_GUIDELINES.map((guide) => {
              const isActive = activeMargins.includes(guide.id);
              return (
                <button
                  key={guide.id}
                  onClick={() => toggleMargin(guide.id)}
                  className={`flex items-center justify-between px-3 py-2.5 md:py-2 text-xs rounded-md transition-colors w-full text-left
                    ${isActive 
                      ? 'bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300' 
                      : 'text-slate-600 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                >
                  <span>{guide.label}</span>
                  {isActive && <FiCheck size={14} />}
                </button>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
};