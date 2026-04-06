// src/components/features/auth/VerifyForgotOtpForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../../services/auth.service';

export const VerifyForgotOtpForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // เพิ่ม State สำหรับนับถอยหลัง
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (!email) navigate('/forgot-password');

    // Logic นับถอยหลัง
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ฟังก์ชันสำหรับกดส่งรหัสใหม่
  const handleResendOtp = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      // เรียก API ตัวเดิมกับตอนขอครั้งแรก
      await authService.requestForgotPasswordOtp({ email });
      setCountdown(60); // รีเซ็ตเวลานับถอยหลัง
    } catch (err: any) {
      const extractedMessage = err?.response?.data?.message || err?.message;
      if (extractedMessage && !extractedMessage.includes('Request failed')) {
        setError(extractedMessage);
      } else {
        setError('ไม่สามารถส่งรหัสใหม่ได้ในขณะนี้');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const otpString = otp.join("");
    if (otpString.length !== 6) return setError('กรุณากรอกให้ครบ 6 หลัก');

    setLoading(true);
    setError(null);
    try {
      await authService.verifyForgotPasswordOtp({ email, otp: otpString });
      navigate('/forgot-password/reset');
    } catch (err: any) {
      setError('รหัส OTP ไม่ถูกต้องหรือหมดอายุ');
      setOtp(new Array(6).fill(""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">ยืนยันรหัส OTP</h2>
      <p className="text-gray-500 text-sm mb-6">รหัสถูกส่งไปที่ <span className="text-blue-600 font-medium">{email}</span></p>

      {error && <p className="mb-4 text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="flex justify-center gap-2 mb-6">
          {otp.map((data, index) => (
            <input
              key={index}
              className="w-12 h-12 border border-gray-300 rounded-lg text-gray-600 text-center text-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-100"
              type="text"
              maxLength={1}
              value={data}
              ref={el => inputRefs.current[index] = el}
              onChange={e => handleChange(e.target, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              onPaste={(e) => {
                e.preventDefault();
                const pasteData = e.clipboardData.getData('text').slice(0, 6).split('');
                if (pasteData.length === 6) {
                  setOtp(pasteData);
                  inputRefs.current[5]?.focus();
                }
              }}
              disabled={loading}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || otp.join("").length !== 6}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl disabled:opacity-50 transition-all mb-6"
        >
          {loading ? 'กำลังตรวจสอบ...' : 'ยืนยัน'}
        </button>
      </form>

      {/* ส่วนแสดงปุ่ม Resend */}
      <div className="text-center text-sm text-gray-600">
        ยังไม่ได้รับรหัส? {' '}
        {countdown > 0 ? (
          <span className="text-gray-400 cursor-not-allowed">
            ส่งใหม่ได้ใน {countdown} วินาที
          </span>
        ) : (
          <button
            onClick={handleResendOtp}
            disabled={loading}
            className="text-blue-600 font-bold hover:underline disabled:opacity-50 cursor-pointer"
          >
            ส่งรหัสใหม่
          </button>
        )}
      </div>

    </div>
  );
};