// src/components/shared/thesis-validator/ValidatorDrawingLayer.tsx
import React, { useState, useRef } from 'react';

interface Props {
  isDrawingMode: boolean;
  pageDimensions: { width: number; height: number };
  onDrawComplete: (bbox: number[]) => void;
}

export const ValidatorDrawingLayer: React.FC<Props> = ({ isDrawingMode, pageDimensions, onDrawComplete }) => {
  const layerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });

  // ถ้าไม่ได้เปิดโหมดวาด และไม่ได้กำลังวาดอยู่ ไม่ต้องเรนเดอร์ Layer นี้ เพื่อให้ผู้ใช้กด Issue อื่นๆ ได้ตามปกติ
  if (!isDrawingMode && !isDrawing) return null;

  // ฟังก์ชันดึงพิกัดเมาส์/นิ้วมือ เทียบกับกรอบของหน้า PDF
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!layerRef.current) return { x: 0, y: 0, rectWidth: 1, rectHeight: 1 };
    const rect = layerRef.current.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    // จำกัดขอบเขตให้อยู่ในหน้ากระดาษ (ป้องกันลากทะลุขอบ)
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(clientY - rect.top, rect.height));
    
    return { x, y, rectWidth: rect.width, rectHeight: rect.height };
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingMode) return;
    const { x, y } = getCoordinates(e);
    setStartPos({ x, y });
    setCurrentPos({ x, y });
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    setCurrentPos({ x, y });
  };

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const { x, y, rectWidth, rectHeight } = getCoordinates(e);
    
    // คำนวณพิกัดมุมซ้ายบน และขวาล่าง บนหน้าจอ
    const minX = Math.min(startPos.x, x);
    const maxX = Math.max(startPos.x, x);
    const minY = Math.min(startPos.y, y);
    const maxY = Math.max(startPos.y, y);

    // ถ้าลากกรอบเล็กเกินไป (เช่น แค่คลิกเฉยๆ ไม่ได้ตั้งใจลาก) ให้ยกเลิกการสร้าง
    if (maxX - minX < 5 || maxY - minY < 5) return;

    // แปลงพิกัดหน้าจอ (Pixels) เป็นพิกัด PDF (Points) โดยใช้สัดส่วน %
    // ทำให้ได้กรอบที่เป๊ะเสมอ ไม่ว่าจะ Zoom In/Out หรือย่อหน้าจออยู่ก็ตาม
    const pdfX0 = (minX / rectWidth) * pageDimensions.width;
    const pdfY0 = (minY / rectHeight) * pageDimensions.height;
    const pdfX1 = (maxX / rectWidth) * pageDimensions.width;
    const pdfY1 = (maxY / rectHeight) * pageDimensions.height;

    // ส่ง BBox [x0, y0, x1, y1] กลับไปให้แม่
    onDrawComplete([pdfX0, pdfY0, pdfX1, pdfY1]);
  };

  // คำนวณสไตล์ของกล่องสี่เหลี่ยมที่กำลังวาด (วาดแบบ Real-time)
  const drawBoxStyle = {
    left: Math.min(startPos.x, currentPos.x),
    top: Math.min(startPos.y, currentPos.y),
    width: Math.abs(currentPos.x - startPos.x),
    height: Math.abs(currentPos.y - startPos.y),
  };

  return (
    <div 
      ref={layerRef}
      // ตั้งค่า z-[60] เพื่อให้นูนกว่ากล่อง Issue เดิม แต่ยังอยู่ใต้ Dropdown
      // touch-none ป้องกันไม่ให้หน้าจอมือถือเลื่อนเวลาเราเอานิ้วลากกรอบ
      className={`absolute inset-0 z-[60] touch-none ${isDrawingMode ? 'cursor-crosshair' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // กรณีลากเมาส์หลุดจอ
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      {isDrawing && (
        <div 
          className="absolute border-2 border-indigo-500 bg-indigo-500/20 mix-blend-multiply pointer-events-none"
          style={{
            left: `${drawBoxStyle.left}px`,
            top: `${drawBoxStyle.top}px`,
            width: `${drawBoxStyle.width}px`,
            height: `${drawBoxStyle.height}px`,
          }}
        />
      )}
    </div>
  );
};