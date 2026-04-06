// src/components/shared/thesis-validator/ValidatorAddIssueModal.tsx
import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

// ดึงรายการ Code จากไฟล์สรุปประเภทของ Issues
const PREDEFINED_CODES = [
  "MARGIN_LEFT", "MARGIN_RIGHT", "MARGIN_TOP", "MARGIN_BOTTOM",
  "INDENT_ERR", "TEXT_ALIGN_ERR", "FONT_STYLE_ERR", 
  "FONT_NAME", "FONT_SIZE", 
  "PAGE_SEQ_ERROR", "PAGE_SEQ_HIDDEN_ERR", 
  "SECTION_SEQ_ERR", 
  "PAPER_SIZE_ERR", 
  "SPACING_ERR_ABOVE", "SPACING_ERR_TEXT_ABOVE", 
  "SPACING_ERR_BELOW", "SPACING_ERR_TEXT_BELOW",
  "CUSTOM_MANUAL_ERR" // เผื่อกรณีอยากเพิ่มเรื่องอื่นนอกเหนือจากลิสต์
];

export interface NewIssueData {
  code: string;
  severity: 'error' | 'warning';
  message: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewIssueData) => void;
  bbox: number[] | null;
}

export const ValidatorAddIssueModal: React.FC<Props> = ({ isOpen, onClose, onSave, bbox }) => {
  const [code, setCode] = useState(PREDEFINED_CODES[0]);
  const [severity, setSeverity] = useState<'error' | 'warning'>('error');
  const [message, setMessage] = useState('');

  // รีเซ็ตค่าฟอร์มทุกครั้งที่เปิด Pop-up ใหม่
  useEffect(() => {
    if (isOpen) {
      setCode(PREDEFINED_CODES[0]);
      setSeverity('error');
      setMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!message.trim()) {
      alert('กรุณาระบุข้อความ (Message) ก่อนบันทึกครับ');
      return;
    }
    onSave({ code, severity, message });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-gray-700 bg-slate-50 dark:bg-gray-900/50">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">
            เพิ่ม Issue ใหม่ (Manual Annotation)
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-rose-500 transition-colors">
            <FiX size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          
          {/* แจ้งเตือนพิกัด */}
          <div className="text-[10px] text-slate-500 bg-slate-100 dark:bg-gray-700 p-2 rounded font-mono break-all">
            <b>BBox:</b> {bbox ? `[${bbox.map(n => n.toFixed(2)).join(', ')}]` : 'ไม่มีการลากกรอบ'}
          </div>

          {/* Code Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1.5">
              Issue Code
            </label>
            <select 
              value={code} 
              onChange={(e) => setCode(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {PREDEFINED_CODES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Severity Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1.5">
              ความรุนแรง (Severity)
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="severity" 
                  value="error" 
                  checked={severity === 'error'} 
                  onChange={() => setSeverity('error')}
                  className="w-4 h-4 text-rose-500 focus:ring-rose-500 border-gray-300"
                />
                <span className="text-sm font-medium text-rose-600 dark:text-rose-400">Error</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="severity" 
                  value="warning" 
                  checked={severity === 'warning'} 
                  onChange={() => setSeverity('warning')}
                  className="w-4 h-4 text-amber-500 focus:ring-amber-500 border-gray-300"
                />
                <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Warning</span>
              </label>
            </div>
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1.5">
              รายละเอียด (Message)
            </label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="ระบุสิ่งที่ต้องการให้แก้ไข..."
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-24"
            />
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-gray-900/50 border-t border-slate-100 dark:border-gray-700 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            ยกเลิก
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition-colors"
          >
            บันทึก Issue
          </button>
        </div>

      </div>
    </div>
  );
};