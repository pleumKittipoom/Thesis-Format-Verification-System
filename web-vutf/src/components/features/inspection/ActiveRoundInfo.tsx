import React from 'react';
import { FiClipboard, FiCalendar, FiClock } from 'react-icons/fi';
import { InspectionRound } from '@/types/inspection';

interface ActiveRoundInfoProps {
    activeRound: InspectionRound;
}

export const ActiveRoundInfo: React.FC<ActiveRoundInfoProps> = ({ activeRound }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    const getCountdown = () => {
        const now = new Date();
        const end = new Date(activeRound.endDate);
        const start = new Date(activeRound.startDate);

        if (now < start) {
            const diff = start.getTime() - now.getTime();
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            return { type: 'waiting', text: `เริ่มใน ${days > 0 ? `${days} วัน ` : ''}${hours} ชั่วโมง` };
        }

        if (now >= start && now <= end) {
            const diff = end.getTime() - now.getTime();
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            return { type: 'active', text: `เหลือเวลา ${days > 0 ? `${days} วัน ` : ''}${hours} ชั่วโมง` };
        }

        return { type: 'ended', text: 'หมดเวลาส่งแล้ว' };
    };

    const countdown = getCountdown();

    return (
        <>
            <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none flex-shrink-0">
                    <FiClipboard className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{activeRound.title}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{activeRound.description || `รอบที่ ${activeRound.roundNumber}`}</p>

                    <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                            ภาคเรียน {activeRound.term}/{activeRound.academicYear}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium">
                            รอบที่ {activeRound.roundNumber}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3 transition-colors">
                    <FiCalendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">เริ่มต้น</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(activeRound.startDate)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3 transition-colors">
                    <FiCalendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">สิ้นสุด</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(activeRound.endDate)}</p>
                    </div>
                </div>
            </div>

            {countdown && (
                <div className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                    ${countdown.type === 'active' ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800' : ''}
                    ${countdown.type === 'waiting' ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800' : ''}
                    ${countdown.type === 'ended' ? 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800' : ''}
                `}>
                    <FiClock className={`w-5 h-5
                        ${countdown.type === 'active' ? 'text-emerald-500 dark:text-emerald-400' : ''}
                        ${countdown.type === 'waiting' ? 'text-amber-500 dark:text-amber-400' : ''}
                        ${countdown.type === 'ended' ? 'text-red-500 dark:text-red-400' : ''}
                    `} />
                    <span className={`font-medium
                        ${countdown.type === 'active' ? 'text-emerald-700 dark:text-emerald-300' : ''}
                        ${countdown.type === 'waiting' ? 'text-amber-700 dark:text-amber-300' : ''}
                        ${countdown.type === 'ended' ? 'text-red-700 dark:text-red-300' : ''}
                    `}>
                        {countdown.text}
                    </span>
                </div>
            )}
        </>
    );
};