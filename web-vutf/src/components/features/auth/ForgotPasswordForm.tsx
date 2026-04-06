import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../../services/auth.service';
import { Input } from '../../common/Input';
import { Button } from '../../common/Button';
import { FiMail, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';

export const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.requestForgotPasswordOtp({ email });
      // สำเร็จ -> ไปหน้ายืนยัน OTP (ส่ง email ไปทาง URL)
      navigate(`/forgot-password/verify?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      // Backend อาจจะตอบ 404 ถ้าไม่เจออีเมล
      setError(err.message || 'ไม่พบอีเมลนี้ในระบบ หรือเกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ลืมรหัสผ่าน?</h2>
        <p className="text-gray-500 text-sm">กรอกอีเมลของคุณเพื่อรับรหัส OTP สำหรับตั้งรหัสใหม่</p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
           <FiAlertCircle /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<FiMail />}
          placeholder="email@example.com"
          required
          disabled={loading}
        />

        <Button disabled={loading} className="w-full">
          {loading ? 'กำลังส่งรหัส...' : 'ส่งรหัส OTP'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-2">
            <FiArrowLeft /> กลับไปหน้าเข้าสู่ระบบ
        </Link>
      </div>
    </div>
  );
};