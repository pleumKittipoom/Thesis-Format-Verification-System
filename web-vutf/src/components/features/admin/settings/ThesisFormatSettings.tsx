// src/components/features/admin/settings/ThesisFormatSettings.tsx
import { useEffect, useState } from 'react';
import { FiSave, FiRefreshCw, FiSettings, FiArrowLeft } from 'react-icons/fi';

// Import Types & Services
import { getDocConfig, updateDocConfig } from '@/services/doc-config.service'; // ปรับ path ถ้าจำเป็น
import type { DocumentConfigData } from '@/types/doc-config'; // ปรับ path ถ้าจำเป็น

// Import Components
import { MarginSettings } from './MarginSettings';
import { FontSettings } from './FontSettings';
import { IndentSettings } from './IndentSettings';
import { CheckListSettings } from './CheckListSettings';
import { SettingsCard } from './SettingsCard';

// Initial State (เพิ่ม property ใหม่ตาม Type ล่าสุด)
const INITIAL_CONFIG: DocumentConfigData = {
    margin_mm: { top: 0, bottom: 0, left: 0, right: 0 },
    font: { name: 'sarabun', size: 16, tolerance: 0 },
    indent_rules: {
        tolerance: 0, main_heading_num: 0, main_heading_text: 0,
        sub_heading_num: 0, sub_heading_text_1: 0, sub_heading_text_2: 0,
        sub_heading_text_3: 0, list_item_num: 0, list_item_text_1: 0,
        list_item_text_2: 0, bullet_point: 0, bullet_text: 0,
        para_indent: 0, dash_indent: 0, dash_text: 0,
        para_min_detect: 0, para_max_detect: 0
    },
    check_list: {
        check_font: true, check_margin: true, check_section_seq: true,
        check_page_seq: true, check_indentation: true, check_spacing: true,
        check_paper_size: true
    },
    ignored_units: []
};

export const ThesisFormatSettings = () => {
    const [config, setConfig] = useState<DocumentConfigData>(INITIAL_CONFIG);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // --- 1. Fetch Data ---
    const fetchConfig = async () => {
        setLoading(true);
        try {
            const data = await getDocConfig();
            if (data) {
                setConfig((prev) => ({
                    ...prev,
                    ...data,
                    ignored_units: data.ignored_units || []
                }));
            }
        } catch (error) {
            console.error('Failed to load config', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    // --- 2. Handle Changes ---
    const updateSection = (
        section: keyof DocumentConfigData,
        key: string,
        value: any
    ) => {
        setConfig((prev) => ({
            ...prev,
            [section]: {
                ...(prev[section] as Record<string, any>),
                [key]: value,
            },
        }));
    };

    // --- 3. Save Data ---
    const handleSave = async () => {
        setSaving(true);
        try {
            await updateDocConfig(config);
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Failed to save config', error);
            alert('Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] flex items-center justify-center text-gray-500 dark:text-slate-400 animate-pulse transition-colors">Loading configuration...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] p-6 md:p-10 font-sans transition-colors">
            <div className="max-w-6xl mx-auto">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-slate-800 rounded-lg text-blue-600 dark:text-slate-300 transition-colors">
                            <FiSettings size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 transition-colors">Validation Configuration</h1>
                            <p className="text-gray-500 dark:text-slate-400 transition-colors">ปรับแต่งค่าสำหรับการตรวจสอบเล่มปริญญานิพนธ์</p>
                        </div>
                    </div>
                    
                    {/* Back Button */}
                    <button 
                        onClick={() => window.history.back()} 
                        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-white font-medium rounded-lg transition-colors border border-gray-200 dark:border-slate-700 w-fit"
                    >
                        <FiArrowLeft size={18} />
                        Back
                    </button>
                </div>

                {/* Save Button Container */}
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-semibold shadow-md transition-all ${
                            saving ? 'bg-blue-600/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 active:scale-95'
                        }`}
                    >
                        <FiSave size={18} />
                        {saving ? 'Saving...' : 'Save Config'}
                    </button>

                    <button onClick={fetchConfig} className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors p-2">
                        <FiRefreshCw size={16} /> Refresh
                    </button>
                </div>

                {/* Main Content Grid */}
                <div className="space-y-6">
                    {/* Top Row: Margins & Font */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <MarginSettings
                            data={config.margin_mm}
                            onChange={(k, v) => updateSection('margin_mm', k as string, v)}
                        />
                        <FontSettings
                            data={config.font}
                            onChange={(k, v) => updateSection('font', k as string, v)}
                        />
                    </div>

                    {/* Middle Row: Enabled Checks */}
                    <CheckListSettings
                        data={config.check_list}
                        onChange={(k, v) => updateSection('check_list', k as string, v)}
                    />

                    {/* Bottom Row: Indent Rules */}
                    <IndentSettings
                        data={config.indent_rules}
                        onChange={(k, v) => updateSection('indent_rules', k as string, v)}
                    />

                    {/* Ignored Units */}
                    <SettingsCard title="Ignored Units">
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 transition-colors">Separate values with commas</label>
                            <input
                                type="text"
                                value={(config.ignored_units || []).join(', ')}
                                onChange={(e) => setConfig(prev => ({ ...prev, ignored_units: e.target.value.split(',').map(s => s.trim()) }))}
                                className="w-full px-4 py-2.5 bg-white dark:bg-[#0f172a] border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            />
                        </div>
                    </SettingsCard>
                </div>
                
            </div>
        </div>
    );
};