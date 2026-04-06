// src/components/features/admin/settings/SettingsCard.tsx
import { ReactNode } from 'react';

interface SettingsCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  action?: ReactNode;
}

export const SettingsCard = ({ title, description, icon, children, action }: SettingsCardProps) => {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-gray-200 dark:border-slate-700/50 shadow-sm dark:shadow-lg overflow-hidden flex flex-col h-full transition-colors">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700/50 flex items-center justify-between gap-4">

        {/* ส่วนฝั่งซ้าย (Icon + Text) */}
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2.5 bg-blue-50 dark:bg-[#0f172a] text-blue-600 dark:text-blue-400 rounded-lg shrink-0 transition-colors">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
            {description && (
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">{description}</p>
            )}
          </div>
        </div>

        {/* ส่วนฝั่งขวา (Action Button) */}
        {action && (
          <div>{action}</div>
        )}
      </div>

      <div className="p-6 flex-1">
        {children}
      </div>
    </div>
  );
};