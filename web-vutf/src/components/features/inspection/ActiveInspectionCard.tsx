// src/components/features/inspection/ActiveInspectionCard.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiClipboard, FiCalendar, FiClock, FiArrowRight, 
    FiChevronLeft, FiChevronRight 
} from 'react-icons/fi';
import { InspectionRound } from '@/types/inspection';

interface ActiveInspectionCardProps {
    /** เปลี่ยนจาก round เดี่ยว เป็นรับ Array ของข้อมูล Inspection Round */
    rounds: InspectionRound[];
    /** ขนาด card */
    size?: 'sm' | 'md' | 'lg';
}

export const ActiveInspectionCard: React.FC<ActiveInspectionCardProps> = ({
    rounds,
    size = 'md',
}) => {
    const navigate = useNavigate();
    
    // State สำหรับจัดการว่ากำลังดูรอบไหนอยู่
    const [currentIndex, setCurrentIndex] = useState(0);
    // ดึงข้อมูลรอบปัจจุบันที่กำลังแสดง
    const round = rounds[currentIndex];

    // State สำหรับ Countdown Real-time
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            day: 'numeric', month: 'short', year: 'numeric',
        });
    };

    const countdown = useMemo(() => {
        if (!round?.startDate || !round?.endDate) {
            return { type: 'ended' as const, text: 'ไม่พบข้อมูลเวลา' };
        }

        const end = new Date(round.endDate);
        const start = new Date(round.startDate);

        const formatTimeText = (diff: number) => {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            let text = '';
            if (days > 0) text += `${days} วัน `;
            if (hours > 0 || days > 0) text += `${hours} ชม. `;
            text += `${minutes} นาที`;
            return text;
        };

        if (now < start) {
            const diff = start.getTime() - now.getTime();
            return { type: 'waiting' as const, text: `เริ่มใน ${formatTimeText(diff)}` };
        }

        if (now >= start && now <= end) {
            const diff = end.getTime() - now.getTime();
            return { type: 'active' as const, text: `เหลือเวลา ${formatTimeText(diff)}` };
        }

        return { type: 'ended' as const, text: 'หมดเวลาส่งแล้ว' };
    }, [now, round?.startDate, round?.endDate]);

    // ฟังก์ชันเปลี่ยนรอบ
    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation(); // ป้องกันการเผลอกดเข้า Card
        setCurrentIndex((prev) => (prev < rounds.length - 1 ? prev + 1 : 0));
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : rounds.length - 1));
    };

    const handleClick = () => {
        navigate('/student/inspections', { 
            state: { selectedRoundId: round.inspectionId } 
        });
    };

    const sizeClasses = { sm: 'p-4', md: 'p-5', lg: 'p-6' };

    if (!rounds || rounds.length === 0 || !round) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleClick}
            className={`
                bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700
                dark:from-blue-600 dark:via-blue-700 dark:to-indigo-800
                rounded-2xl shadow-xl shadow-blue-200 dark:shadow-blue-900/30 cursor-pointer
                hover:shadow-2xl hover:shadow-blue-300 dark:hover:shadow-blue-900/50 hover:-translate-y-1
                transition-all duration-300 overflow-hidden relative
                ${sizeClasses[size]}
            `}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
                {/* Header & Controls */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <FiClipboard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-white/70 text-xs uppercase tracking-wider">รอบตรวจที่เปิดรับไฟล์</p>
                            <h3 className="text-white font-bold text-lg leading-tight line-clamp-1">
                                {round.title || 'ไม่มีชื่อรอบ'}
                            </h3>
                        </div>
                    </div>

                    {/* แสดงปุ่มเปลี่ยนรอบ เฉพาะเมื่อมีมากกว่า 1 รอบ */}
                    {rounds.length > 1 && (
                        <div className="flex items-center gap-2 bg-black/10 rounded-full p-1 backdrop-blur-sm z-20">
                            <button
                                onClick={handlePrev}
                                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            >
                                <FiChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-white/90 text-xs font-medium px-1">
                                {currentIndex + 1}/{rounds.length}
                            </span>
                            <button
                                onClick={handleNext}
                                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            >
                                <FiChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* เนื้อหาเปลี่ยนตามรอบที่เลือก */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-white/80 text-sm">
                                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                                    {round.term}/{round.academicYear}
                                </span>
                                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                                    รอบที่ {round.roundNumber}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <FiCalendar className="w-4 h-4 shrink-0" />
                                <span className="truncate">
                                    {formatDate(round.startDate)} - {formatDate(round.endDate)}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
                            <div className={`
                                flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm
                                ${countdown.type === 'active' ? 'bg-emerald-500/30 text-emerald-100' : ''}
                                ${countdown.type === 'waiting' ? 'bg-amber-500/30 text-amber-100' : ''}
                                ${countdown.type === 'ended' ? 'bg-red-500/30 text-red-100' : ''}
                            `}>
                                <FiClock className="w-4 h-4" />
                                {countdown.text}
                            </div>

                            <div className="flex items-center gap-1 text-white/90 hover:text-white text-sm font-medium transition-colors">
                                <span>ส่งไฟล์รอบนี้</span>
                                <FiArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default ActiveInspectionCard;