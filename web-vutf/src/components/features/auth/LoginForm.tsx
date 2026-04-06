// src/components/features/auth/LoginForm.tsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { authService } from '../../../services/auth.service';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';


export const LoginForm = () => {
    const navigate = useNavigate(); // Hook สำหรับสั่งเปลี่ยนหน้า
    const { login, user, isAuthenticated, isLoading: authLoading } = useAuth();

    // State ข้อมูลฟอร์ม
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // State สำหรับจัดการ UX (โหลด/เออเร่อ)
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // เช็คว่าโหลดข้อมูล Auth เสร็จหรือยัง และ ล็อกอินอยู่หรือไม่
        if (!authLoading && isAuthenticated && user) {
            const role = user.role?.toLowerCase();

            if (role === 'student') {
                navigate('/student/dashboard', { replace: true });
            } else if (role === 'instructor') {
                navigate('/instructor/dashboard', { replace: true });
            } else if (role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        }
    }, [isAuthenticated, user, authLoading, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await login({ email, password });
            const userRes = await authService.getMe();

            if (userRes && userRes.data) {
                const role = userRes.data.role.toLowerCase();

                if (role === 'student') {
                    navigate('/student/dashboard');
                } else if (role === 'instructor') {
                    navigate('/instructor/dashboard');
                } else if (role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
                console.log(`Login Success as ${role}`);
            }

        } catch (err: any) {
            console.error('Login Failed:', err);
            const extractedMessage = err?.response?.data?.message || err?.message;
            if (extractedMessage && !extractedMessage.includes('Request failed')) {
                setError(extractedMessage);
            } else {
                setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading) {
        return <div className="min-h-screen flex justify-center items-center">Checking authentication...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Welcome to</h2>
                <h2 className="text-3xl font-bold text-blue-600">Thesis Review</h2>
            </div>

            {/* --- ส่วนแสดง Error Message --- */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center rounded-r">
                    <FiAlertCircle className="mr-2" size={20} />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            <Input
                label="Email"
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<FiMail size={20} />}
                disabled={isLoading} // ห้ามแก้ตอนกำลังโหลด
                required
            />

            <Input
                label="Password"
                type="password"
                placeholder="***********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<FiLock size={20} />}
                disabled={isLoading} // ห้ามแก้ตอนกำลังโหลด
                required
            />

            <div className="flex items-center justify-between mb-6">
                <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                    <input type="checkbox" className="mr-2 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    Remember me
                </label>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                    Forgot Password?
                </Link>
            </div>

            <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex justify-center items-center transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isLoading} // ปิดปุ่มตอนกำลังโหลด
            >
                {isLoading ? (
                    // Loading Spinner เล็กๆ (Optional)
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                    </>
                ) : (
                    'Login'
                )}
            </Button>

            <p className="mt-4 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register/email" className="text-blue-600 hover:underline">
                    Register
                </Link>
            </p>
        </form>
    );
};