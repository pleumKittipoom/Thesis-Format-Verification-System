// src/components/features/admin/settings/CheckListSettings.tsx
import type { CheckListConfig } from '@/types/doc-config';
import { SettingsCard } from './SettingsCard';

interface Props {
  data: CheckListConfig;
  onChange: (key: keyof CheckListConfig, value: boolean) => void;
}

// Map key เป็นข้อความภาษาไทยตามดีไซน์
const LABEL_MAP: Record<keyof CheckListConfig, string> = {
  check_margin: 'ระยะขอบกระดาษ',
  check_font: 'รูปแบบอักษร',
  check_page_seq: 'ลำดับหน้า',
  check_section_seq: 'ลำดับหัวข้อ',
  check_paper_size: 'บังคับขนาดกระดาษ A4',
  check_spacing: 'ระยะห่างรูป/ตาราง',
  check_indentation: 'ระยะเยื้องย่อหน้า',
};

export const CheckListSettings = ({ data, onChange }: Props) => {
  return (
    <SettingsCard title="Enabled Checks">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-8">
        {(Object.keys(data) as Array<keyof CheckListConfig>).map((key) => (
          <label 
            key={key} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={data[key]}
                onChange={(e) => onChange(key, e.target.checked)}
                className="peer appearance-none w-5 h-5 bg-white dark:bg-[#0f172a] border border-gray-300 dark:border-slate-600 rounded checked:bg-blue-500 checked:border-blue-500 dark:checked:bg-blue-500 dark:checked:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all cursor-pointer"
              />
              {/* Custom Checkmark Icon (แสดงเมื่อ checked) */}
              <svg 
                className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" 
                viewBox="0 0 14 10" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              {LABEL_MAP[key] || key}
            </span>
          </label>
        ))}
      </div>
    </SettingsCard>
  );
};