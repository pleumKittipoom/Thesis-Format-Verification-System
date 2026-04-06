import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../../../services/auth.service';

export const VerifyOtpForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');

    // State OTP & Refs
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // State UI
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(60);

    // Timer Logic
    useEffect(() => {
        if (!email) {
            navigate('/register/email');
            return;
        }
        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [email, navigate]);

    // Input Handlers
    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        if (element.value !== "" && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResendOtp = async () => {
        if (!email) return;
        setLoading(true);
        try {
            await authService.requestRegistrationOtp({ email });
            setCountdown(60);
            setError(null);
        } catch (err: any) {
            setError('ไม่สามารถส่ง OTP ใหม่ได้ในขณะนี้');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        const otpString = otp.join("");
        if (otpString.length !== 6) {
            setError('กรุณากรอก OTP ให้ครบ 6 หลัก');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await authService.verifyRegistrationOtp({ email, otp: otpString });
            if (res.data && res.data.registrationToken) {
                sessionStorage.setItem('registrationToken', res.data.registrationToken);
                sessionStorage.setItem('registerEmail', email);
                navigate('/register/form');
            }
        } catch (err: any) {
            console.error(err);
            setError('รหัส OTP ไม่ถูกต้องหรือหมดอายุ');
            setOtp(new Array(6).fill(""));
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            {error && (
                <p className="mb-6 text-center text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>
            )}

            <form onSubmit={handleSubmit}>
                <div className="flex justify-between gap-2 mb-8">
                    {otp.map((data, index) => (
                        <input
                            key={index}
                            className="w-12 h-12 border border-gray-300 rounded-lg text-center text-xl font-bold text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            type="text"
                            maxLength={1}
                            value={data}
                            ref={(el) => (inputRefs.current[index] = el)}
                            onChange={(e) => handleChange(e.target, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
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
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 mb-6"
                >
                    {loading ? 'กำลังตรวจสอบ...' : 'ยืนยัน'}
                </button>
            </form>

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
                        className="text-blue-600 font-bold hover:underline disabled:opacity-50"
                    >
                        ส่งรหัสใหม่
                    </button>
                )}
            </div>
        </div>
    );
};