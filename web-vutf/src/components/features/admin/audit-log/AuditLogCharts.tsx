import { useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { FiActivity, FiAlertOctagon, FiUsers } from 'react-icons/fi';

// ชุดสีสำหรับสุ่ม (Color Palette)
const colorPalette = [
    '#2563eb', // blue-600
    '#db2777', // pink-600
    '#9333ea', // purple-600
    '#059669', // emerald-600
    '#d97706', // amber-600
    '#dc2626', // red-600
    '#0891b2', // cyan-600
    '#4f46e5', // indigo-600
    '#be123c', // rose-700
    '#15803d', // green-700
    '#eede4d'  // yellow-700
];

export const AuditLogCharts = ({ stats }: { stats: any }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        };

        // ตรวจสอบครั้งแรกตอน Load
        checkDarkMode();

        // สร้าง Observer เพื่อดักดูว่า class ของ <html> เปลี่ยนไหม
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    }, []);

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        const percentValue = (percent * 100).toFixed(1);

        return (
            <text
                x={x}
                y={y}
                fill={isDarkMode ? "#FFFFFF" : "#374151"}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[10px] font-bold select-none transition-colors duration-300"
            >
                {`${percentValue}%`}
            </text>
        );
    };

    // เช็คว่ามีข้อมูล stats ที่ส่งมาหรือไม่
    if (!stats || stats.totalLogs === 0) return null;

    // --------------------------------------------------------
    // 1. Formatting Data for Recharts (ใช้ข้อมูลจาก stats)
    // --------------------------------------------------------

    // ชันกำหนดสี (Semantic & Hashed Colors)
    const getColorForAction = (action: string) => {
        if (action.includes('FAILED')) return '#f1663c'; 
        if (action === 'LOGIN' || action === 'REGISTER') return '#10b981'; 
        if (action === 'MANUAL_UNLOCK') return '#f59e0b'; 
        if (action.includes('RESET')) return '#8b5cf6';

        // สำหรับ Action อื่นๆ สร้าง Hash เพื่อเลือกสีจาก Palette
        let hash = 0;
        for (let i = 0; i < action.length; i++) {
            hash = action.charCodeAt(i) + ((hash << 5) - hash);
        }
        // ใช้ค่า absolute และ modulo เพื่อให้ได้ index ที่อยู่ในขอบเขตของ colorPalette
        const index = Math.abs(hash % colorPalette.length);
        return colorPalette[index];
    };

    // แปลงข้อมูล Action Stats ที่ได้จาก DB ให้อยู่ในรูปแบบที่ Recharts เข้าใจ
    const actionData = (stats.actionStats || []).map((item: any) => ({
        name: item.action,
        value: Number(item.count),
        color: getColorForAction(item.action)
    }));

    // แปลงข้อมูล Top Users ที่ได้จาก DB ให้อยู่ในรูปแบบที่ Recharts เข้าใจ
    const topUsersData = (stats.topUsers || []).map((item: any) => ({
        name: item.identifier ? item.identifier.split('@')[0] : 'Unknown',
        fullName: item.identifier || 'Unknown',
        'จำนวนครั้ง': Number(item.count)
    }));

    // --------------------------------------------------------
    // 2. Quick Stats Calculation
    // --------------------------------------------------------
    const totalLogs = stats.totalLogs || 0;
    const failedLogs = stats.failedLogs || 0;
    const uniqueUsers = topUsersData.length;

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 text-sm z-50 relative">
                    <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                        {payload[0].payload.fullName || payload[0].name}
                    </p>
                    <p className="text-blue-600 dark:text-blue-400">
                        จำนวน: <span className="font-bold">{payload[0].value}</span> รายการ
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="mb-8">
            {/* --- Section 1: Quick Stats Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                        <FiActivity size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">กิจกรรมทั้งหมด</p>
                        <h4 className="text-2xl font-bold text-gray-800 dark:text-white">{totalLogs}</h4>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                    <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                        <FiAlertOctagon size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">ข้อผิดพลาด / ล้มเหลว</p>
                        <h4 className="text-2xl font-bold text-gray-800 dark:text-white">{failedLogs}</h4>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                        <FiUsers size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">ผู้ใช้งานที่มีความเคลื่อนไหว (Top)</p>
                        <h4 className="text-2xl font-bold text-gray-800 dark:text-white">{uniqueUsers}</h4>
                    </div>
                </div>
            </div>

            {/* --- Section 2: Charts --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Chart 1: Donut Chart - Action Distribution */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="mb-4">
                        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">สัดส่วนประเภทกิจกรรม</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">แบ่งตาม Action ที่เกิดขึ้นทั้งหมด</p>
                    </div>
                    <div className="h-64">
                        {/* ใส่ minHeight เพื่อแก้บัค Warning ของ Recharts */}
                        <ResponsiveContainer width="100%" height={250} minHeight={250}>
                            <PieChart key={isDarkMode ? 'dark' : 'light'}>
                                <Pie
                                    data={actionData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    innerRadius={65}
                                    outerRadius={90}
                                    paddingAngle={3}
                                    dataKey="value"
                                    isAnimationActive={true}
                                >
                                    {actionData.map((entry: any, index: number) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                            stroke="rgba(0,0,0,0.2)"
                                            strokeWidth={1}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 2: Bar Chart - Top Users */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="mb-4">
                        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">ผู้ใช้งานที่มีความเคลื่อนไหวสูงสุด</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Top 5 ผู้ใช้งานจากข้อมูลทั้งหมด</p>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height={250} minHeight={250}>
                            <BarChart data={topUsersData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 11, fill: '#6b7280' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    tick={{ fontSize: 11, fill: '#6b7280' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} />
                                <Bar
                                    dataKey="จำนวนครั้ง"
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={50}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};