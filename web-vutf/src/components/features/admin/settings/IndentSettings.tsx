// src/components/features/admin/settings/IndentSettings.tsx
import type { IndentRulesConfig } from '@/types/doc-config';
import { SettingsCard } from './SettingsCard';

interface Props {
  data: IndentRulesConfig;
  onChange: (key: keyof IndentRulesConfig, value: number) => void;
}

// Map key เป็นข้อความภาษาไทยตามหน้าจอดีไซน์
const INDENT_LABELS: Record<keyof IndentRulesConfig, string> = {
  tolerance: 'TOLERANCE',
  main_heading_num: 'หัวข้อหลัก (ตัวเลข)',
  main_heading_text: 'หัวข้อหลัก (ข้อความ)',
  sub_heading_num: 'หัวข้อรอง (ตัวเลข)',
  sub_heading_text_1: 'หัวข้อรอง (ข้อความ 1)',
  sub_heading_text_2: 'หัวข้อรอง (ข้อความ 2)',
  sub_heading_text_3: 'SUB HEADING TEXT 3',
  list_item_num: 'รายการ (ตัวเลข)',
  list_item_text_1: 'รายการ (ข้อความ 1)',
  list_item_text_2: 'รายการ (ข้อความ 2)',
  bullet_point: 'BULLET',
  bullet_text: 'BULLET ข้อความ',
  para_indent: 'ย่อหน้า',
  dash_indent: 'DASH INDENT',
  dash_text: 'DASH TEXT',
  para_min_detect: 'ย่อหน้า (MIN DETECT)',
  para_max_detect: 'ย่อหน้า (MAX DETECT)',
};

export const IndentSettings = ({ data, onChange }: Props) => {
  // บังคับลำดับการแสดงผลให้ตรงกับรูปภาพ (เรียงจากซ้ายไปขวา)
  const order: Array<keyof IndentRulesConfig> = [
    'tolerance', 'main_heading_num', 'main_heading_text', 'sub_heading_num',
    'sub_heading_text_1', 'sub_heading_text_2', 'sub_heading_text_3', 'list_item_num',
    'list_item_text_1', 'list_item_text_2', 'bullet_point', 'bullet_text',
    'para_indent', 'dash_indent', 'dash_text', 'para_min_detect',
    'para_max_detect'
  ];

  return (
    <SettingsCard title="Indentation Rules (mm)">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-6">
        {order.map((key) => {
          // เช็คว่าใช่ช่องที่มีคำอธิบายเสริมหรือไม่
          const isMinDetect = key === 'para_min_detect';
          const isMaxDetect = key === 'para_max_detect';
          
          return (
            <div key={key}>
              <label 
                className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 truncate transition-colors" 
                title={INDENT_LABELS[key] || key}
              >
                {INDENT_LABELS[key] || key}
              </label>
              <input
                type="number"
                step="0.1"
                value={data[key]}
                onChange={(e) => onChange(key, parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              />
              {/* คำอธิบายเสริมใต้ช่องกรอก */}
              {isMinDetect && (
                <p className="mt-2 text-[10px] text-gray-500 dark:text-slate-500 leading-tight transition-colors">
                  * ระยะเยื้องขั้นต่ำสุดที่ระบบจะเริ่มนับว่าเป็นย่อหน้าใหม่ (ถ้าน้อยกว่านี้จะถือว่าชิดขอบ)
                </p>
              )}
              {isMaxDetect && (
                <p className="mt-2 text-[10px] text-gray-500 dark:text-slate-500 leading-tight transition-colors">
                  * ระยะเยื้องระยะไกลสุดที่จะยอมรับว่าเป็นย่อหน้า (ถ้าเยื้องเกินจะถือว่าเป็นหัวข้อย่อยหรือสิ่งอื่น)
                </p>
              )}
            </div>
          );
        })}
      </div>
    </SettingsCard>
  );
};