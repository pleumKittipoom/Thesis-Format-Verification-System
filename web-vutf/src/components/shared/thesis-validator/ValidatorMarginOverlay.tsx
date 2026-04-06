// src/components/shared/thesis-validator/ValidatorMarginOverlay.tsx
import React from 'react';
import { PAGE_MARGINS, INDENT_GUIDELINES } from './ValidatorMarginDropdown';

interface Props {
  activeMargins: string[];
  pageDimensions: { width: number; height: number };
}

export const ValidatorMarginOverlay: React.FC<Props> = ({ activeMargins, pageDimensions }) => {
  if (!pageDimensions.width || !pageDimensions.height || activeMargins.length === 0) {
    return null;
  }

  // สูตรคำนวณ mm -> point (pt) -> % ของความกว้าง/สูงกระดาษ
  const mmToPt = (mm: number) => (mm / 25.4) * 72;
  const getPercentX = (mm: number) => (mmToPt(mm) / pageDimensions.width) * 100;
  const getPercentY = (mm: number) => (mmToPt(mm) / pageDimensions.height) * 100;

  const showPageMargins = activeMargins.includes('page-margins');

  return (
    <div className="absolute inset-0 z-40 pointer-events-none">
      
      {/* 1. วาดเส้นขอบกระดาษ (Page Margins) */}
      {showPageMargins && (
        <>
          {/* ขอบซ้าย */}
          <div className="absolute opacity-50 top-0 bottom-0" style={{ left: `${getPercentX(PAGE_MARGINS.left)}%`, width: '1px', borderLeft: '1.5px solid #6366f1' }} />
          {/* ขอบขวา */}
          <div className="absolute opacity-50 top-0 bottom-0" style={{ right: `${getPercentX(PAGE_MARGINS.right)}%`, width: '1px', borderRight: '1.5px solid #6366f1' }} />
          {/* ขอบบน */}
          <div className="absolute opacity-50 left-0 right-0" style={{ top: `${getPercentY(PAGE_MARGINS.top)}%`, height: '1px', borderTop: '1.5px solid #6366f1' }} />
          {/* ขอบล่าง */}
          <div className="absolute opacity-50 left-0 right-0" style={{ bottom: `${getPercentY(PAGE_MARGINS.bottom)}%`, height: '1px', borderBottom: '1.5px solid #6366f1' }} />
          
          {/* ปรับขนาด font บนมือถือ (text-[8px] md:text-[10px]) */}
          <span className="absolute text-[8px] md:text-[10px] font-bold text-indigo-500 bg-white/80 px-1 rounded" 
                style={{ top: '5px', left: `${getPercentX(PAGE_MARGINS.left)}%`, transform: 'translateX(-50%)' }}>
            Margin Left
          </span>
        </>
      )}

      {/* 2. วาดเส้นระยะเยื้อง (Indents) */}
      {INDENT_GUIDELINES.filter(guide => activeMargins.includes(guide.id)).map((guide) => {
        // ระยะเยื้องต้องเริ่มนับจากขอบซ้าย (Margin Left) + ระยะ Indent
        const totalIndentMm = PAGE_MARGINS.left + guide.mm;
        const positionPercentX = getPercentX(totalIndentMm);

        return (
          <div 
            key={guide.id} 
            className="absolute opacity-60 top-0 bottom-0" 
            style={{ 
              left: `${positionPercentX}%`, 
              width: '1px', 
              borderLeft: '1px dashed #ec4899'
            }}
          >
            <div className="relative w-full h-full">
               <span className="absolute text-[7px] md:text-[9px] text-pink-500 font-mono bg-white/90 dark:bg-gray-800/90 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-50"
                     style={{ top: '80px', left: '-4px', transform: 'translateX(-50%)' }}>
                 {guide.mm}mm
               </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};