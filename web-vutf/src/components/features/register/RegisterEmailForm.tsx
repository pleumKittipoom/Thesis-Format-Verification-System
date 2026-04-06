// src/components/features/register/RegisterEmailForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/auth.service';
import { FiMail, FiArrowRight, FiAlertCircle } from 'react-icons/fi';

export const RegisterEmailForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateEmail = (email: string) => {
        const rmuttRegex = /^[a-zA-Z0-9._%+-]+@mail\.rmutt\.ac\.th$/;
        return rmuttRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // 1. Validate Client-side
        if (!validateEmail(email)) {
            setError('รูปแบบอีเมลไม่ถูกต้อง');
            return;
        }

        setLoading(true);
        try {
            // 2. เรียก API Request OTP
            await authService.requestRegistrationOtp({ email });

            // 3. Success -> ไปหน้า verify
            navigate(`/register/verify-otp?email=${encodeURIComponent(email)}`);

        } catch (err: any) {
            console.error(err);
            if (err.message?.includes('409') || err.message?.includes('Email')) {
                setError('อีเมลนี้ถูกใช้งานแล้ว กรุณาเข้าสู่ระบบ');
            } else {
                setError(err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* ส่วนแสดง Error Message */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2 animate-fade-in">
                    <FiAlertCircle size={18} className="shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email (@mail.rmutt.ac.th)</label>
                <div className="relative">
                    <FiMail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError(null);
                        }}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        placeholder="student@mail.rmutt.ac.th"
                        required
                        disabled={loading}
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        กำลังตรวจสอบ...
                    </>
                ) : (
                    <>ถัดไป <FiArrowRight /></>
                )}
            </button>
        </form>
    );
};