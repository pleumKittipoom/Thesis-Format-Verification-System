import React, { useState, useEffect } from 'react';
import { FiX, FiLoader } from 'react-icons/fi';
import { ClassSection } from '../../../../types/class-section';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: ClassSection | null;
  isSubmitting?: boolean;
}

export const SectionFormModal = ({ isOpen, onClose, onSubmit, initialData, isSubmitting = false }: Props) => {
  const isEditMode = !!initialData;
  
  // Default values
  const currentYear = new Date().getFullYear() + 543;
  
  const [formData, setFormData] = useState({
    section_name: '',
    academic_year: currentYear,
    term: '1'
  });

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        section_name: initialData.section_name,
        academic_year: initialData.academic_year,
        term: initialData.term
      });
    } else if (!isOpen) {
      setFormData({ section_name: '', academic_year: currentYear, term: '1' });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl transform transition-all">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {isEditMode ? 'แก้ไขกลุ่มเรียน' : 'เพิ่มกลุ่มเรียนใหม่'}
          </h2>
          <button 
            onClick={onClose} 
            disabled={isSubmitting} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ปีการศึกษา</label>
              <input 
                type="number" 
                required 
                className="w-full px-4 py-2 text-gray-600 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700"
                value={formData.academic_year}
                onChange={e => setFormData({...formData, academic_year: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ภาคเรียน</label>
              <select 
                className="w-full px-4 py-2 text-gray-600 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700"
                value={formData.term}
                onChange={e => setFormData({...formData, term: e.target.value})}
              >
                <option value="1">เทอม 1</option>
                <option value="2">เทอม 2</option>
                <option value="3">ภาคฤดูร้อน (3)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ชื่อกลุ่มเรียน (Section)</label>
            <input 
              type="text" 
              required 
              placeholder="เช่น 66344 INE1"
              className="w-full px-4 py-2 text-gray-600 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
              value={formData.section_name}
              onChange={e => setFormData({...formData, section_name: e.target.value})}
            />
          </div>

          <div className="pt-6 flex gap-3">
             <button 
                type="button" 
                onClick={onClose} 
                disabled={isSubmitting} 
                className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
             >
                ยกเลิก
             </button>
             <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 font-medium flex justify-center items-center gap-2 transition-colors"
             >
                {isSubmitting ? <><FiLoader className="animate-spin" /> กำลังบันทึก...</> : 'บันทึก'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};