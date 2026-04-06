// src/components/features/instructor/submission-detail/SubmissionCommentCard.tsx
import React, { useState, useEffect } from 'react';
import { FiMessageSquare, FiEdit2, FiSave, FiX } from 'react-icons/fi';

interface Props {
  comment: string | null;
  onSave: (newComment: string) => Promise<void>; // รับฟังก์ชันบันทึกจากแม่
}

export const SubmissionCommentCard: React.FC<Props> = ({ comment, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Sync state กับ props (เมื่อโหลดข้อมูลเสร็จ)
  useEffect(() => {
    setText(comment || '');
  }, [comment]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(text);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save comment', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setText(comment || ''); // Revert กลับเป็นค่าเดิม
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md dark:hover:shadow-gray-900/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <FiMessageSquare className="text-orange-500" /> 
          ความคิดเห็นจากอาจารย์
        </h3>
        
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
          >
            <FiEdit2 size={14} /> แก้ไข
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="animate-fade-in">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 focus:border-blue-400 dark:focus:border-blue-500 outline-none min-h-[120px] text-gray-700 resize-none mb-3"
            placeholder="พิมพ์ความคิดเห็น หรือข้อเสนอแนะให้นักศึกษา..."
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium flex items-center gap-2 transition-colors"
              disabled={isSaving}
            >
              <FiX /> ยกเลิก
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-white bg-blue-600 dark:bg-blue-600 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 text-sm font-medium flex items-center gap-2 disabled:opacity-50 transition-colors"
              disabled={isSaving}
            >
              {isSaving ? 'กำลังบันทึก...' : <><FiSave /> บันทึก</>}
            </button>
          </div>
        </div>
      ) : (
        <div className={`p-4 rounded-xl text-sm leading-relaxed border transition-colors ${
          text 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-white border-green-100 dark:border-green-900/30' 
            : 'bg-gray-50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 border-gray-100 dark:border-gray-600 italic'
        }`}>
          {text || 'ยังไม่มีความคิดเห็น... กด "แก้ไข" เพื่อเพิ่มคอมเมนต์'}
        </div>
      )}
    </div>
  );
};