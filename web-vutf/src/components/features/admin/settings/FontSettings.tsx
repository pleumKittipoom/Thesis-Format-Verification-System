// src/components/features/admin/settings/FontSettings.tsx
import type { FontConfig } from '../../../../types/doc-config';
import { SettingsCard } from './SettingsCard';

interface Props {
  data: FontConfig;
  onChange: (key: keyof FontConfig, value: any) => void;
}

const SUPPORTED_FONTS = [
  { label: 'sarabun', value: 'sarabun' }, 
  { label: 'THSarabunPSK', value: 'THSarabunPSK' },
  { label: 'Angsana New', value: 'angsana' },
  { label: 'Browallia New', value: 'browallia' },
  { label: 'Cordia New', value: 'cordia' },
];

export const FontSettings = ({ data, onChange }: Props) => {
  return (
    <SettingsCard title="Font Rules">
      <div className="flex flex-col gap-4">
        
        {/* แถวที่ 1: Font Name (เต็มความกว้าง) */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 transition-colors">
            Font Name
          </label>
          <div className="relative">
            <select
              value={data.name}
              onChange={(e) => onChange('name', e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="" disabled>-- Select Font --</option>
              {SUPPORTED_FONTS.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
              {/* Option สำรองกรณีค่าเดิมไม่อยู่ใน List */}
              {!SUPPORTED_FONTS.some(f => f.value === data.name) && data.name && (
                 <option value={data.name}>{data.name} (Custom)</option>
              )}
            </select>
            
            {/* Arrow Icon ตกแต่ง */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 dark:text-slate-400 transition-colors">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
        
        {/* แถวที่ 2: Size & Tolerance (แบ่งครึ่ง) */}
        <div className="grid grid-cols-2 gap-x-6">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 transition-colors">
              Base Size (pt)
            </label>
            <input
              type="number"
              value={data.size}
              onChange={(e) => onChange('size', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 transition-colors">
              Tolerance (pt)
            </label>
            <input
              type="number"
              step="0.1"
              value={data.tolerance || 0}
              onChange={(e) => onChange('tolerance', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            />
          </div>
        </div>

      </div>
    </SettingsCard>
  );
};