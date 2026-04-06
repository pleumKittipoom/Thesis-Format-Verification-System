// src/components/features/admin/settings/MarginSettings.tsx
import type { MarginConfig } from '@/types/doc-config';
import { SettingsCard } from './SettingsCard';

interface Props {
  data: MarginConfig;
  onChange: (key: keyof MarginConfig, value: number) => void;
}

export const MarginSettings = ({ data, onChange }: Props) => {
  const fields: Array<keyof MarginConfig> = ['left', 'right', 'bottom', 'top'];

  return (
    <SettingsCard title="Page Margins (mm)">
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {fields.map((side) => (
          <div key={side}>
            <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              {side}
            </label>
            <input
              type="number"
              step="0.1"
              value={data[side]}
              onChange={(e) => onChange(side, parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0f172a] border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            />
          </div>
        ))}
      </div>
    </SettingsCard>
  );
};